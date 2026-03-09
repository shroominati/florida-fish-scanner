import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

import { repository } from './src/features/regulations/repository';
import { evaluateCatchLegality } from './src/features/regulations/ruleEngine';
import { loadSavedCatches, saveCatch } from './src/features/storage/catchStore';
import { stillImagePipeline } from './src/features/vision/stillImagePipeline';
import { DevInspectorScreen } from './src/screens/DevInspectorScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { MeasureScreen } from './src/screens/MeasureScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { ReviewSpeciesScreen } from './src/screens/ReviewSpeciesScreen';
import { SavedCatchesScreen } from './src/screens/SavedCatchesScreen';
import { ScanScreen } from './src/screens/ScanScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { requestCurrentLocation } from './src/services/locationService';
import type {
  CatchContext,
  DeviceLocation,
  RetainedDisposition,
  SavedCatchRecord,
  ScanPhotoAsset,
  ScanSession
} from './src/types/domain';

type ScreenKey = 'home' | 'scan' | 'review' | 'measure' | 'result' | 'saved' | 'settings' | 'dev';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function createSessionId() {
  return `scan-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

const emptyContext: CatchContext = {
  waterType: 'saltwater',
  fishingMode: 'shore',
  retainedCount: 0,
  retainedOverMaxCount: 0,
  requestDate: today()
};

function createEmptySession(): ScanSession {
  return {
    id: createSessionId(),
    speciesCandidates: [],
    speciesConfirmed: false,
    context: emptyContext
  };
}

export default function App() {
  const latestVersion = repository.ruleVersions[0];
  const [screen, setScreen] = useState<ScreenKey>('home');
  const [session, setSession] = useState<ScanSession>(createEmptySession());
  const [savedCatches, setSavedCatches] = useState<SavedCatchRecord[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    void loadSavedCatches().then(setSavedCatches);
  }, []);

  const selectedSpecies = useMemo(
    () => repository.species.find((item) => item.id === session.selectedSpeciesId),
    [session.selectedSpeciesId]
  );
  const selectedCandidate = useMemo(
    () => session.speciesCandidates.find((item) => item.speciesId === session.selectedSpeciesId),
    [session.selectedSpeciesId, session.speciesCandidates]
  );

  const refreshLocation = async (): Promise<DeviceLocation | undefined> => {
    const location = await requestCurrentLocation();

    if (location) {
      setSession((current) => ({
        ...current,
        deviceLocation: location,
        context: {
          ...current.context,
          requestDate: location.capturedAt.slice(0, 10)
        }
      }));
    }

    return location;
  };

  const startNewScan = () => {
    setSession(createEmptySession());
    setScreen('scan');
  };

  const handleCapture = async (photo: ScanPhotoAsset, location?: DeviceLocation) => {
    setIsAnalyzing(true);
    const capturedAt = new Date().toISOString();
    const nextSession: ScanSession = {
      ...session,
      id: session.id ?? createSessionId(),
      photoUri: photo.uri,
      photoAsset: photo,
      capturedAt,
      deviceLocation: location ?? session.deviceLocation,
      context: {
        ...session.context,
        requestDate: capturedAt.slice(0, 10)
      }
    };

    const analysis = await stillImagePipeline.analyzeFrame({
      photo,
      session: nextSession
    });

    setSession((current) => ({
      ...current,
      id: nextSession.id,
      photoUri: photo.uri,
      photoAsset: analysis.photo,
      capturedAt,
      deviceLocation: location ?? current.deviceLocation,
      scanAnalysis: analysis,
      speciesCandidates: analysis.classification.candidates,
      selectedSpeciesId: analysis.classification.selectedSpeciesId ?? analysis.classification.candidates[0]?.speciesId,
      speciesConfirmed: false,
      measurement: undefined,
      evaluation: undefined
    }));
    setIsAnalyzing(false);
  };

  const retakeScan = () => {
    setSession((current) => ({
      ...current,
      photoUri: undefined,
      photoAsset: undefined,
      scanAnalysis: undefined,
      speciesCandidates: [],
      selectedSpeciesId: undefined,
      speciesConfirmed: false,
      measurement: undefined,
      evaluation: undefined
    }));
  };

  const continueFromScan = () => {
    setScreen('review');
  };

  const confirmSpecies = (speciesId: string) => {
    setSession((current) => ({
      ...current,
      selectedSpeciesId: speciesId,
      speciesConfirmed: true
    }));
    setScreen('measure');
  };

  const runEvaluation = (measurement: NonNullable<ScanSession['measurement']>, context: CatchContext) => {
    if (!session.selectedSpeciesId) {
      return;
    }

    const candidate = session.speciesCandidates.find((item) => item.speciesId === session.selectedSpeciesId);
    const evaluation = evaluateCatchLegality({
      speciesId: session.selectedSpeciesId,
      speciesConfidence: candidate?.confidence ?? 0.6,
      speciesConfirmed: session.speciesConfirmed,
      measurement,
      context: {
        ...context,
        location: session.deviceLocation
      }
    });

    setSession((current) => ({
      ...current,
      measurement,
      context,
      evaluation
    }));
    setScreen('result');
  };

  const persistCatch = async (retainedDisposition: RetainedDisposition) => {
    if (!session.selectedSpeciesId || !session.measurement || !session.evaluation) {
      return;
    }

    const candidate = session.speciesCandidates.find((item) => item.speciesId === session.selectedSpeciesId);
    const speciesName =
      repository.species.find((item) => item.id === session.selectedSpeciesId)?.commonName ?? session.selectedSpeciesId;

    const record: SavedCatchRecord = {
      id: `catch-${Date.now()}`,
      createdAt: new Date().toISOString(),
      speciesId: session.selectedSpeciesId,
      speciesName,
      confidence: candidate?.confidence ?? 0.6,
      photoUri: session.photoUri,
      topCandidates: session.speciesCandidates.slice(0, 3),
      measurementIn: session.measurement.totalLengthIn,
      uncertaintyIn: session.measurement.uncertaintyIn,
      measurementConfidence: session.measurement.confidence,
      calibrationMode: session.measurement.calibrationMode,
      decision: session.evaluation.status,
      zoneName: session.evaluation.zone?.name,
      location: session.deviceLocation,
      retainedDisposition,
      decisionTrace: session.evaluation.trace,
      why: session.evaluation.trace.map((item) => `${item.title}: ${item.detail}`)
    };

    const next = await saveCatch(record);
    setSavedCatches(next);
    Alert.alert('Catch saved', retainedDisposition === 'retained' ? 'Stored as retained.' : 'Stored as released.');
  };

  if (screen === 'home') {
    return (
      <>
        <StatusBar style="dark" />
        <HomeScreen
          latestVersion={latestVersion ?? repository.ruleVersions.slice(-1)[0]!}
          savedCount={savedCatches.length}
          onScan={startNewScan}
          onSaved={() => setScreen('saved')}
          onSettings={() => setScreen('settings')}
        />
      </>
    );
  }

  if (screen === 'scan') {
    return (
      <>
        <StatusBar style="dark" />
        <ScanScreen
          deviceLocation={session.deviceLocation}
          analysis={session.scanAnalysis}
          isAnalyzing={isAnalyzing}
          onBack={() => setScreen('home')}
          onCapture={(photo, location) => {
            void handleCapture(photo, location);
          }}
          onRefreshLocation={refreshLocation}
          onRetake={retakeScan}
          onContinue={continueFromScan}
        />
      </>
    );
  }

  if (screen === 'review') {
    return (
      <>
        <StatusBar style="dark" />
        <ReviewSpeciesScreen
          candidates={session.speciesCandidates}
          speciesCatalog={repository.species}
          selectedSpeciesId={session.selectedSpeciesId}
          onBack={() => setScreen('scan')}
          onConfirm={confirmSpecies}
        />
      </>
    );
  }

  if (screen === 'measure') {
    return (
      <>
        <StatusBar style="dark" />
        <MeasureScreen
          species={selectedSpecies}
          photoUri={session.photoUri}
          context={{
            ...session.context,
            requestDate: session.context.requestDate || today()
          }}
          measurement={session.measurement}
          scanSummary={session.scanAnalysis?.summary}
          onBack={() => setScreen('review')}
          onEvaluate={runEvaluation}
        />
      </>
    );
  }

  if (screen === 'result' && session.measurement && session.evaluation) {
    return (
      <>
        <StatusBar style="dark" />
        <ResultScreen
          species={selectedSpecies}
          speciesConfidence={selectedCandidate?.confidence ?? 0.5}
          topCandidates={session.speciesCandidates.slice(0, 3)}
          evaluation={session.evaluation}
          measurement={session.measurement}
          onBack={() => setScreen('measure')}
          onSaveRetained={() => {
            void persistCatch('retained');
          }}
          onSaveReleased={() => {
            void persistCatch('released');
          }}
          onStartOver={startNewScan}
        />
      </>
    );
  }

  if (screen === 'saved') {
    return (
      <>
        <StatusBar style="dark" />
        <SavedCatchesScreen catches={savedCatches} onBack={() => setScreen('home')} />
      </>
    );
  }

  if (screen === 'dev') {
    return (
      <>
        <StatusBar style="dark" />
        <DevInspectorScreen session={session} onBack={() => setScreen('settings')} />
      </>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <SettingsScreen
        latestVersion={latestVersion ?? repository.ruleVersions.slice(-1)[0]!}
        sources={repository.dataSources}
        onBack={() => setScreen('home')}
        onOpenDev={__DEV__ ? () => setScreen('dev') : undefined}
      />
    </>
  );
}
