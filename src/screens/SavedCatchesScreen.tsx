import { Image, StyleSheet, Text, View } from 'react-native';

import { ConfidenceBadge } from '../components/ConfidenceBadge';
import { InfoCard } from '../components/InfoCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenShell } from '../components/ScreenShell';
import { colors, spacing } from '../theme';
import type { SavedCatchRecord } from '../types/domain';

interface SavedCatchesScreenProps {
  catches: SavedCatchRecord[];
  onBack: () => void;
}

export function SavedCatchesScreen({ catches, onBack }: SavedCatchesScreenProps) {
  return (
    <ScreenShell
      title="Saved Catches"
      subtitle="Each saved record keeps the original image, species candidates, measurement details, location snapshot, and the decision trace used at the time."
      footer={<PrimaryButton label="Back Home" onPress={onBack} variant="ghost" />}
    >
      {catches.length === 0 ? (
        <InfoCard title="No saved catches yet" subtitle="Run a scan and save the result to keep a local log." />
      ) : (
        catches.map((record) => (
          <InfoCard
            key={record.id}
            title={record.speciesName}
            subtitle={`${record.createdAt.slice(0, 10)} • ${record.measurementIn.toFixed(1)} in +/- ${record.uncertaintyIn.toFixed(1)} • ${record.zoneName ?? 'Zone unavailable'}`}
          >
            {record.photoUri ? (
              <Image source={{ uri: record.photoUri }} style={styles.photo} resizeMode="cover" />
            ) : null}
            <View style={styles.row}>
              <ConfidenceBadge
                label={record.decision}
                tone={record.decision === 'LEGAL' ? 'high' : record.decision === 'ILLEGAL' ? 'low' : 'medium'}
              />
              <ConfidenceBadge
                label={`${Math.round(record.confidence * 100)}% species`}
                tone={record.confidence >= 0.85 ? 'high' : record.confidence >= 0.7 ? 'medium' : 'low'}
              />
              <ConfidenceBadge
                label={`${Math.round(record.measurementConfidence * 100)}% measurement`}
                tone={record.measurementConfidence >= 0.85 ? 'high' : record.measurementConfidence >= 0.7 ? 'medium' : 'low'}
              />
            </View>
            <Text style={styles.meta}>
              {record.retainedDisposition === 'retained' ? 'Saved as retained fish.' : 'Saved as released fish.'}
            </Text>
            <Text style={styles.meta}>
              Calibration: {record.calibrationMode ?? 'unknown'}.
              {record.location
                ? ` GPS ${record.location.latitude.toFixed(4)}, ${record.location.longitude.toFixed(4)}.`
                : ' GPS unavailable.'}
            </Text>
            {record.topCandidates.map((candidate) => (
              <Text key={`${record.id}-${candidate.speciesId}`} style={styles.reason}>
                • Candidate {candidate.commonName}: {Math.round(candidate.confidence * 100)}%
              </Text>
            ))}
            {record.why.map((reason) => (
              <Text key={reason} style={styles.reason}>
                • {reason}
              </Text>
            ))}
          </InfoCard>
        ))
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  photo: {
    width: '100%',
    height: 160,
    borderRadius: 18
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap'
  },
  meta: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.text
  },
  reason: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted
  }
});
