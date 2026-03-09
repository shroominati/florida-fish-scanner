import { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { InfoCard } from '../components/InfoCard';
import { ButtonRow, PrimaryButton } from '../components/PrimaryButton';
import { ScreenShell } from '../components/ScreenShell';
import { evaluateCatchLegality } from '../features/regulations/ruleEngine';
import { repository } from '../features/regulations/repository';
import { resolveZoneFromLocation } from '../features/regulations/zoneResolver';
import { colors, spacing } from '../theme';
import type { DeviceLocation, ScanSession, WaterType } from '../types/domain';

interface DevInspectorScreenProps {
  session: ScanSession;
  onBack: () => void;
}

function parseNumber(value: string, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function DevInspectorScreen({ session, onBack }: DevInspectorScreenProps) {
  const [speciesId, setSpeciesId] = useState(session.selectedSpeciesId ?? 'red_drum');
  const [lengthIn, setLengthIn] = useState(String(session.measurement?.totalLengthIn ?? 24));
  const [retainedCount, setRetainedCount] = useState(String(session.context.retainedCount));
  const [waterType, setWaterType] = useState<WaterType>(session.context.waterType);
  const [zoneId, setZoneId] = useState(session.context.manualZoneId ?? '');

  const resolvedZone = useMemo(
    () => resolveZoneFromLocation(repository, waterType, session.deviceLocation),
    [session.deviceLocation, waterType]
  );

  const simulation = useMemo(() => {
    return evaluateCatchLegality({
      speciesId,
      speciesConfidence: session.speciesCandidates.find((item) => item.speciesId === speciesId)?.confidence ?? 0.9,
      speciesConfirmed: true,
      measurement: session.measurement ?? {
        totalLengthIn: parseNumber(lengthIn, 24),
        uncertaintyIn: 0.5,
        confidence: 0.9,
        confidenceLabel: 'high',
        method: 'manual_points',
        calibrationMode: 'printed_card',
        userAdjusted: true,
        calibrationReferenceIn: 4,
        fishPixelLength: 300,
        referencePixelLength: 50
      },
      context: {
        ...session.context,
        waterType,
        manualZoneId: zoneId || undefined,
        retainedCount: Math.max(0, parseNumber(retainedCount, 0))
      }
    });
  }, [lengthIn, retainedCount, session, speciesId, waterType, zoneId]);

  return (
    <ScreenShell
      title="Dev Inspector"
      subtitle="Internal-only module for inspecting the loaded bundle, zone resolution, decision traces, and manual scan simulation."
      footer={<PrimaryButton label="Back" onPress={onBack} variant="ghost" />}
    >
      <InfoCard
        title="Loaded Bundle"
        subtitle={`${repository.species.length} species • ${repository.rules.length} rules • ${repository.zones.length} zones • latest ${repository.ruleVersions[0]?.id ?? 'missing'}`}
      />

      <InfoCard
        title="Zone Resolution"
        subtitle={
          session.deviceLocation
            ? `GPS ${session.deviceLocation.latitude.toFixed(4)}, ${session.deviceLocation.longitude.toFixed(4)}`
            : 'No location in the current session.'
        }
      >
        <Text style={styles.note}>Resolved zone from GPS: {resolvedZone?.name ?? 'none'}</Text>
        <Text style={styles.note}>Manual zone override: {zoneId || 'none'}</Text>
      </InfoCard>

      <InfoCard title="Manual Simulation" subtitle="Force a decision using the current bundle and inspect the resulting trace.">
        <Field label="Species ID" value={speciesId} onChange={setSpeciesId} />
        <Field label="Measured length (in)" value={lengthIn} onChange={setLengthIn} />
        <Field label="Retained count" value={retainedCount} onChange={setRetainedCount} />
        <Field label="Manual zone ID" value={zoneId} onChange={setZoneId} />
        <View style={styles.choiceRow}>
          <PrimaryButton
            label="Saltwater"
            onPress={() => setWaterType('saltwater')}
            variant={waterType === 'saltwater' ? 'primary' : 'secondary'}
          />
          <PrimaryButton
            label="Freshwater"
            onPress={() => setWaterType('freshwater')}
            variant={waterType === 'freshwater' ? 'primary' : 'secondary'}
          />
        </View>
      </InfoCard>

      <InfoCard title="Current Decision Snapshot" subtitle={`${simulation.status} • ${simulation.zone?.name ?? 'no zone'} • ${simulation.matchedRule?.ruleVersion.id ?? 'no rule version'}`}>
        {simulation.trace.map((item) => (
          <Text key={`${item.title}-${item.detail}`} style={styles.note}>
            • {item.title}: {item.detail}
          </Text>
        ))}
      </InfoCard>

      <InfoCard title="Current Session" subtitle={session.scanAnalysis?.detectorName ?? 'No scan analysis yet'}>
        <Text style={styles.note}>Scan readiness: {session.scanAnalysis?.readiness ?? 'n/a'}</Text>
        <Text style={styles.note}>Candidates: {session.speciesCandidates.map((item) => item.speciesId).join(', ') || 'none'}</Text>
      </InfoCard>
    </ScreenShell>
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
        style={styles.input}
        placeholderTextColor={colors.textMuted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.xs
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textMuted
  },
  input: {
    minHeight: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    color: colors.text
  },
  note: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.text
  },
  choiceRow: {
    flexDirection: 'row',
    gap: spacing.sm
  }
});
