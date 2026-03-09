import { Linking, StyleSheet, Text, View } from 'react-native';

import { ConfidenceBadge } from '../components/ConfidenceBadge';
import { InfoCard } from '../components/InfoCard';
import { ButtonRow, PrimaryButton } from '../components/PrimaryButton';
import { ScreenShell } from '../components/ScreenShell';
import { colors, spacing } from '../theme';
import type { EvaluationSummary, MeasurementResult, Species, SpeciesCandidate } from '../types/domain';
import { inches, percent } from '../utils/format';

interface ResultScreenProps {
  species?: Species;
  speciesConfidence: number;
  topCandidates: SpeciesCandidate[];
  evaluation: EvaluationSummary;
  measurement: MeasurementResult;
  onBack: () => void;
  onSaveRetained: () => void;
  onSaveReleased: () => void;
  onStartOver: () => void;
}

function tone(status: EvaluationSummary['status']) {
  if (status === 'LEGAL') {
    return 'high';
  }
  if (status === 'ILLEGAL') {
    return 'low';
  }
  return 'medium';
}

export function ResultScreen({
  species,
  speciesConfidence,
  topCandidates,
  evaluation,
  measurement,
  onBack,
  onSaveRetained,
  onSaveReleased,
  onStartOver
}: ResultScreenProps) {
  return (
    <ScreenShell
      title={
        evaluation.status === 'LEGAL'
          ? 'Likely Legal'
          : evaluation.status === 'ILLEGAL'
            ? 'Likely Not Legal'
            : 'Need Manual Verification'
      }
      subtitle="The result reflects the selected species, the measured fish, and the active bundled regulation data. Close calls should be verified manually against the current official source."
      footer={
        <ButtonRow>
          <PrimaryButton label="Back" onPress={onBack} variant="ghost" />
          <PrimaryButton label="Start New Scan" onPress={onStartOver} variant="secondary" />
        </ButtonRow>
      }
    >
      <InfoCard
        title={species?.commonName ?? 'Selected species'}
        subtitle={`Species confidence ${percent(speciesConfidence)} • Measured total length ${inches(measurement.totalLengthIn)} +/- ${measurement.uncertaintyIn.toFixed(1)} in`}
      >
        <View style={styles.summaryRow}>
          <ConfidenceBadge label={evaluation.status} tone={tone(evaluation.status)} />
          <ConfidenceBadge label={`${evaluation.confidenceLabel} decision`} tone={evaluation.confidenceLabel} />
          <ConfidenceBadge
            label={`${measurement.confidenceLabel ?? 'medium'} measurement`}
            tone={measurement.confidenceLabel ?? 'medium'}
          />
        </View>
        {evaluation.disclaimer ? <Text style={styles.disclaimer}>{evaluation.disclaimer}</Text> : null}
      </InfoCard>

      <InfoCard title="Species Decision" subtitle="The app keeps the candidate list visible to avoid fake certainty.">
        {topCandidates.map((candidate, index) => (
          <View key={candidate.speciesId} style={styles.candidateRow}>
            <Text style={styles.candidateName}>
              #{index + 1} {candidate.commonName}
            </Text>
            <ConfidenceBadge
              label={percent(candidate.confidence)}
              tone={candidate.confidence >= 0.85 ? 'high' : candidate.confidence >= 0.7 ? 'medium' : 'low'}
            />
          </View>
        ))}
      </InfoCard>

      <InfoCard title="Decision Trace" subtitle="The rule logic stays visible so the angler can audit the legality output.">
        <View style={styles.stack}>
          {evaluation.trace.map((item) => (
            <View key={`${item.title}-${item.detail}`} style={styles.traceRow}>
              <View style={styles.traceHeader}>
                <Text style={styles.traceTitle}>{item.title}</Text>
                {item.severity === 'warning' ? <ConfidenceBadge label="warning" tone="medium" /> : null}
              </View>
              <Text style={styles.traceDetail}>{item.detail}</Text>
              {item.sourceUrl ? (
                <Text
                  style={styles.sourceLink}
                  onPress={() => {
                    if (item.sourceUrl) {
                      void Linking.openURL(item.sourceUrl);
                    }
                  }}
                >
                  {item.sourceUrl}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      </InfoCard>

      <InfoCard
        title="Rule Context"
        subtitle={
          evaluation.zone
            ? `${evaluation.zone.name} • Rule version ${evaluation.matchedRule?.ruleVersion.id ?? 'missing'}`
            : 'Zone missing'
        }
      >
        {evaluation.ruleLogicSummary?.map((line) => (
          <Text key={line} style={styles.detail}>
            • {line}
          </Text>
        ))}
        {evaluation.matchedRule?.rule.sourceUrl ? (
          <Text
            style={styles.sourceLink}
            onPress={() => {
              const sourceUrl = evaluation.matchedRule?.rule.sourceUrl;
              if (sourceUrl) {
                void Linking.openURL(sourceUrl);
              }
            }}
          >
            {evaluation.matchedRule.rule.sourceUrl}
          </Text>
        ) : null}
      </InfoCard>

      <InfoCard title="Warnings and Notes" subtitle="The app should stay explicit when confidence or freshness is weak.">
        <View style={styles.stack}>
          {evaluation.reasons.map((reason) => (
            <Text key={reason} style={styles.detail}>
              • {reason}
            </Text>
          ))}
          {evaluation.notes.map((note) => (
            <Text key={note} style={styles.detail}>
              • {note}
            </Text>
          ))}
          {evaluation.staleData ? (
            <Text style={styles.detail}>• The rule bundle is stale for the requested date, so manual verification is required.</Text>
          ) : null}
          <Text style={styles.footerNote}>This is an aid, not legal advice.</Text>
        </View>
      </InfoCard>

      <ButtonRow>
        <PrimaryButton label="Save as Retained" onPress={onSaveRetained} />
        <PrimaryButton label="Save as Released" onPress={onSaveReleased} variant="secondary" />
      </ButtonRow>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap'
  },
  disclaimer: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.warning,
    fontWeight: '700'
  },
  candidateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm
  },
  candidateName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: colors.text
  },
  stack: {
    gap: spacing.sm
  },
  traceRow: {
    gap: spacing.xs,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border
  },
  traceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm
  },
  traceTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.accentDark
  },
  traceDetail: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text
  },
  sourceLink: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.accentDark,
    textDecorationLine: 'underline'
  },
  detail: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text
  },
  footerNote: {
    marginTop: spacing.sm,
    fontSize: 12,
    fontWeight: '800',
    color: colors.textMuted
  }
});
