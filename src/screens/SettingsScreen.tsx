import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { ConfidenceBadge } from '../components/ConfidenceBadge';
import { InfoCard } from '../components/InfoCard';
import { ButtonRow, PrimaryButton } from '../components/PrimaryButton';
import { ScreenShell } from '../components/ScreenShell';
import { colors, spacing } from '../theme';
import type { DataSource, RuleVersion } from '../types/domain';

interface SettingsScreenProps {
  latestVersion: RuleVersion;
  sources: DataSource[];
  onBack: () => void;
  onOpenDev?: () => void;
}

export function SettingsScreen({ latestVersion, sources, onBack, onOpenDev }: SettingsScreenProps) {
  return (
    <ScreenShell
      title="Settings and Freshness"
      subtitle="Field decisions are only as good as the cached rules and the visible calibration reference."
      footer={<PrimaryButton label="Back Home" onPress={onBack} variant="ghost" />}
    >
      <InfoCard
        title="Rule Bundle"
        subtitle={`${latestVersion.label} • published ${latestVersion.publishedAt} • stale warning ${latestVersion.staleWarningThresholdDays} days • hard stale ${latestVersion.freshnessWindowDays} days.`}
      >
        <View style={styles.row}>
          <ConfidenceBadge label="Species threshold 85%" tone="medium" />
          <ConfidenceBadge label="Measurement threshold 75%" tone="medium" />
        </View>
        {latestVersion.notes.map((note) => (
          <Text key={note} style={styles.note}>
            • {note}
          </Text>
        ))}
      </InfoCard>

      <InfoCard
        title="Printable Calibration Card"
        subtitle="The current scan flow supports a printed card or a manual known-length reference."
      >
        <Text style={styles.note}>Print at 100% scale and keep the full card visible beside the fish.</Text>
        <View style={styles.cardPreview}>
          <View style={styles.cardSegmentDark} />
          <View style={styles.cardSegmentLight} />
          <View style={styles.cardSegmentDark} />
          <View style={styles.cardSegmentLight} />
        </View>
        <Text style={styles.cardCaption}>4 inch reference card concept. Use as a ruler substitute when the fish is photographed.</Text>
      </InfoCard>

      <InfoCard title="Sources" subtitle="Primary sources are official Florida pages. NOAA remains the federal-ready authority for later offshore expansion.">
        <View style={styles.stack}>
          {sources.map((source) => (
            <Pressable key={source.id} style={styles.sourceRow} onPress={() => void Linking.openURL(source.url)}>
              <Text style={styles.sourceLabel}>{source.label}</Text>
              <Text style={styles.sourceMeta}>{source.authority}</Text>
              <Text style={styles.sourceMeta}>Verified {source.lastVerifiedAt}</Text>
              <Text style={styles.link}>{source.url}</Text>
            </Pressable>
          ))}
        </View>
      </InfoCard>

      <InfoCard title="Offline Behavior" subtitle="The app ships with a local rule snapshot and local saved-catch storage.">
        <Text style={styles.note}>• GPS loss can be handled with a manual zone override.</Text>
        <Text style={styles.note}>• If rules are stale or a rule is missing for the exact context, the decision should be UNCERTAIN.</Text>
        <Text style={styles.note}>• Manual point placement is the current reliable measurement path.</Text>
      </InfoCard>

      {__DEV__ && onOpenDev ? (
        <InfoCard title="Developer Tools" subtitle="Internal-only inspector for rules, zone resolution, and simulated scan results.">
          <ButtonRow>
            <PrimaryButton label="Open Dev Inspector" onPress={onOpenDev} variant="secondary" />
          </ButtonRow>
        </InfoCard>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm
  },
  stack: {
    gap: spacing.sm
  },
  note: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text
  },
  sourceRow: {
    padding: spacing.md,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4
  },
  sourceLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text
  },
  sourceMeta: {
    fontSize: 12,
    color: colors.textMuted
  },
  link: {
    fontSize: 12,
    color: colors.accentDark
  },
  cardPreview: {
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    height: 48
  },
  cardSegmentDark: {
    flex: 1,
    backgroundColor: colors.navy
  },
  cardSegmentLight: {
    flex: 1,
    backgroundColor: '#FFF9EE'
  },
  cardCaption: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.textMuted
  }
});
