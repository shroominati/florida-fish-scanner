import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ImagePointAnnotator, type AnnotationKey } from '../components/ImagePointAnnotator';
import { ConfidenceBadge } from '../components/ConfidenceBadge';
import { InfoCard } from '../components/InfoCard';
import { ButtonRow, PrimaryButton } from '../components/PrimaryButton';
import { ScreenShell } from '../components/ScreenShell';
import { estimateFishLengthFromPoints } from '../features/measurement/measurementEngine';
import { repository } from '../features/regulations/repository';
import { colors, spacing } from '../theme';
import type {
  CalibrationMode,
  CatchContext,
  MeasurementResult,
  Point2D,
  Species
} from '../types/domain';
import { inches } from '../utils/format';

interface MeasureScreenProps {
  species?: Species;
  photoUri?: string;
  context: CatchContext;
  measurement?: MeasurementResult;
  scanSummary?: string[];
  onBack: () => void;
  onEvaluate: (measurement: MeasurementResult, context: CatchContext) => void;
}

const orderedPoints: AnnotationKey[] = ['nose', 'tail', 'referenceStart', 'referenceEnd'];

function numericValue(value: string, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function MeasureScreen({
  species,
  photoUri,
  context,
  measurement,
  scanSummary,
  onBack,
  onEvaluate
}: MeasureScreenProps) {
  const [waterType, setWaterType] = useState(context.waterType);
  const [fishingMode, setFishingMode] = useState(context.fishingMode);
  const [manualZoneId, setManualZoneId] = useState(context.manualZoneId ?? '');
  const [retainedCount, setRetainedCount] = useState(String(context.retainedCount));
  const [retainedOverMaxCount, setRetainedOverMaxCount] = useState(String(context.retainedOverMaxCount ?? 0));
  const [calibrationMode, setCalibrationMode] = useState<CalibrationMode>(
    measurement?.calibrationMode ?? 'printed_card'
  );
  const [referenceLengthIn, setReferenceLengthIn] = useState(
    String(measurement?.calibrationReferenceIn ?? 4)
  );
  const [activePoint, setActivePoint] = useState<AnnotationKey>('nose');
  const [points, setPoints] = useState<Partial<Record<AnnotationKey, Point2D>>>({
    nose: measurement?.nosePoint,
    tail: measurement?.tailPoint,
    referenceStart: measurement?.referenceStartPoint,
    referenceEnd: measurement?.referenceEndPoint
  });

  const manualZones = useMemo(
    () =>
      repository.zones.filter(
        (zone) =>
          zone.waterType === waterType &&
          (zone.parentZoneId !== null || zone.id === 'freshwater_statewide' || zone.id === 'salt_statewide')
      ),
    [waterType]
  );

  const previewMeasurement = useMemo(() => {
    if (!points.nose || !points.tail || !points.referenceStart || !points.referenceEnd) {
      return undefined;
    }

    return estimateFishLengthFromPoints({
      nosePoint: points.nose,
      tailPoint: points.tail,
      referenceStartPoint: points.referenceStart,
      referenceEndPoint: points.referenceEnd,
      referenceLengthIn: numericValue(referenceLengthIn, calibrationMode === 'printed_card' ? 4 : 10),
      calibrationMode,
      sourcePhotoUri: photoUri,
      userAdjusted: true
    });
  }, [calibrationMode, photoUri, points, referenceLengthIn]);

  const allPointsPlaced = orderedPoints.every((key) => Boolean(points[key]));

  const onPointSet = (key: AnnotationKey, point: Point2D) => {
    setPoints((current) => ({
      ...current,
      [key]: point
    }));

    const nextIndex = orderedPoints.indexOf(key) + 1;
    const nextPoint = orderedPoints[nextIndex];
    if (nextPoint) {
      setActivePoint(nextPoint);
    }
  };

  return (
    <ScreenShell
      title="Measure and Context"
      subtitle={`Mark the fish and reference points for ${species?.commonName ?? 'the selected fish'}, then run the regulation engine with the catch context.`}
      footer={<PrimaryButton label="Back" onPress={onBack} variant="ghost" />}
    >
      <InfoCard
        title="Manual Assisted Measurement"
        subtitle="This phase prioritizes reliability. The angler places the measurement points instead of trusting automatic segmentation."
      >
        <View style={styles.choiceGrid}>
          <ChoicePill
            active={calibrationMode === 'printed_card'}
            label="Printed 4 in card"
            onPress={() => {
              setCalibrationMode('printed_card');
              setReferenceLengthIn('4');
            }}
          />
          <ChoicePill
            active={calibrationMode === 'known_length'}
            label="Known-length reference"
            onPress={() => {
              setCalibrationMode('known_length');
              setReferenceLengthIn(measurement?.calibrationReferenceIn ? String(measurement.calibrationReferenceIn) : '10');
            }}
          />
        </View>

        <Field
          label={calibrationMode === 'printed_card' ? 'Printed card inches' : 'Reference inches'}
          value={referenceLengthIn}
          onChange={setReferenceLengthIn}
        />

        <ImagePointAnnotator
          photoUri={photoUri}
          activeKey={activePoint}
          points={points}
          onPointSet={onPointSet}
        />

        <View style={styles.choiceGrid}>
          {orderedPoints.map((key) => (
            <ChoicePill
              key={key}
              active={activePoint === key}
              label={`${points[key] ? 'Edit' : 'Place'} ${labelForKey(key)}`}
              onPress={() => setActivePoint(key)}
            />
          ))}
        </View>

        {previewMeasurement ? (
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>Current measurement</Text>
              <ConfidenceBadge
                label={`${previewMeasurement.confidenceLabel ?? 'medium'} confidence`}
                tone={previewMeasurement.confidenceLabel ?? 'medium'}
              />
            </View>
            <Text style={styles.previewValue}>
              {inches(previewMeasurement.totalLengthIn)} +/- {previewMeasurement.uncertaintyIn.toFixed(1)} in
            </Text>
            {(previewMeasurement.notes ?? []).map((note) => (
              <Text key={note} style={styles.previewNote}>
                • {note}
              </Text>
            ))}
          </View>
        ) : (
          <Text style={styles.helpText}>
            Place all four points to compute total length and uncertainty.
          </Text>
        )}

        <PrimaryButton
          label="Clear Points"
          onPress={() => {
            setPoints({});
            setActivePoint('nose');
          }}
          variant="ghost"
        />
      </InfoCard>

      <InfoCard
        title="Reference Card"
        subtitle="The printable card mode assumes the app card is visible in the photo. If it is not, switch to known-length reference and enter the exact reference length."
      >
        <Text style={styles.helpText}>Recommended card: 4 inches long, high-contrast bars, printed at 100% scale.</Text>
      </InfoCard>

      {scanSummary?.length ? (
        <InfoCard title="Scan Guidance" subtitle="The measurement step retains the capture guidance from the scan pipeline.">
          {scanSummary.map((item) => (
            <Text key={item} style={styles.helpText}>
              • {item}
            </Text>
          ))}
        </InfoCard>
      ) : null}

      <InfoCard
        title="Fishing Context"
        subtitle="The legality decision depends on water type, place, mode, date, and how many fish are already retained."
      >
        <Text style={styles.label}>Water type</Text>
        <View style={styles.choiceGrid}>
          <ChoicePill active={waterType === 'saltwater'} label="Saltwater" onPress={() => setWaterType('saltwater')} />
          <ChoicePill active={waterType === 'freshwater'} label="Freshwater" onPress={() => setWaterType('freshwater')} />
        </View>

        <Text style={styles.label}>Fishing mode</Text>
        <View style={styles.choiceGrid}>
          {(['shore', 'boat', 'pier', 'nearshore', 'offshore', 'federal', 'inland'] as const)
            .filter((item) =>
              waterType === 'freshwater'
                ? item === 'shore' || item === 'boat' || item === 'inland'
                : item !== 'inland'
            )
            .map((item) => (
              <ChoicePill key={item} active={fishingMode === item} label={item} onPress={() => setFishingMode(item)} />
            ))}
        </View>

        <Text style={styles.label}>Manual zone override</Text>
        <View style={styles.choiceGrid}>
          {manualZones.slice(0, 8).map((zone) => (
            <ChoicePill
              key={zone.id}
              active={manualZoneId === zone.id}
              label={zone.name}
              onPress={() => setManualZoneId(zone.id)}
            />
          ))}
        </View>

        <View style={styles.row}>
          <Field label="Already kept" value={retainedCount} onChange={setRetainedCount} />
          <Field label="Over-slot kept" value={retainedOverMaxCount} onChange={setRetainedOverMaxCount} />
        </View>
      </InfoCard>

      <ButtonRow>
        <PrimaryButton
          label="Run Regulation Engine"
          onPress={() => {
            if (!previewMeasurement) {
              return;
            }

            const nextContext: CatchContext = {
              ...context,
              waterType,
              fishingMode,
              manualZoneId: manualZoneId || undefined,
              retainedCount: Math.max(0, Number(retainedCount) || 0),
              retainedOverMaxCount: Math.max(0, Number(retainedOverMaxCount) || 0)
            };

            onEvaluate(previewMeasurement, nextContext);
          }}
          disabled={!allPointsPlaced || !previewMeasurement}
        />
      </ButtonRow>
    </ScreenShell>
  );
}

function labelForKey(key: AnnotationKey): string {
  if (key === 'referenceStart') {
    return 'reference start';
  }
  if (key === 'referenceEnd') {
    return 'reference end';
  }
  return key;
}

function ChoicePill({
  active,
  label,
  onPress
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.choice, active && styles.choiceActive]} onPress={onPress}>
      <Text style={[styles.choiceText, active && styles.choiceTextActive]}>{label}</Text>
    </Pressable>
  );
}

function Field({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType="decimal-pad"
        style={styles.input}
        placeholderTextColor={colors.textMuted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm
  },
  field: {
    flex: 1,
    gap: spacing.xs
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted
  },
  input: {
    minHeight: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    color: colors.text
  },
  choiceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm
  },
  choice: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  choiceActive: {
    backgroundColor: '#FFF0E5',
    borderColor: colors.accentDark
  },
  choiceText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text
  },
  choiceTextActive: {
    color: colors.accentDark
  },
  helpText: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textMuted
  },
  previewCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text
  },
  previewValue: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.navy
  },
  previewNote: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.textMuted
  }
});
