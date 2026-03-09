import { StyleSheet, Text, View } from 'react-native';

import { InfoCard } from '../components/InfoCard';
import { ButtonRow, PrimaryButton } from '../components/PrimaryButton';
import { ScreenShell } from '../components/ScreenShell';
import { colors, spacing } from '../theme';
import type { RuleVersion } from '../types/domain';

interface HomeScreenProps {
  latestVersion: RuleVersion;
  savedCount: number;
  onScan: () => void;
  onSaved: () => void;
  onSettings: () => void;
}

export function HomeScreen({
  latestVersion,
  savedCount,
  onScan,
  onSaved,
  onSettings
}: HomeScreenProps) {
  return (
    <ScreenShell
      title="Fish first. Rules second. Decision last."
      subtitle="The app only returns LEGAL when species, measurement, location, date, and active Florida rules all line up."
    >
      <InfoCard
        title="Scan Fish"
        subtitle="Capture a fish photo, confirm the species, calibrate length, and evaluate the regulation trace."
      >
        <PrimaryButton label="Open Camera" onPress={onScan} />
      </InfoCard>

      <InfoCard
        title="Regulation Freshness"
        subtitle={`Bundle ${latestVersion.id} published ${latestVersion.publishedAt}. Cached for offline use, but still verify if the fish is close to a limit.`}
      >
        <Text style={styles.smallText}>Primary authorities: FWC saltwater, FWC freshwater, FWC fish management areas, NOAA for future federal expansion.</Text>
      </InfoCard>

      <View style={styles.row}>
        <View style={styles.flex}>
          <InfoCard title="Saved Catches" subtitle={`${savedCount} stored locally on this device.`}>
            <PrimaryButton label="View Saved" onPress={onSaved} variant="secondary" />
          </InfoCard>
        </View>
        <View style={styles.flex}>
          <InfoCard title="Settings" subtitle="Thresholds, stale data status, and regulation sources.">
            <PrimaryButton label="Open Settings" onPress={onSettings} variant="secondary" />
          </InfoCard>
        </View>
      </View>

      <InfoCard title="Field Footers" subtitle="This app is a decision aid, not legal advice. If the confidence is low or the rule context is missing, it returns UNCERTAIN.">
        <ButtonRow>
          <PrimaryButton label="Scan Fish Now" onPress={onScan} />
        </ButtonRow>
      </InfoCard>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.md
  },
  flex: {
    flex: 1
  },
  smallText: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textMuted
  }
});
