import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ConfidenceBadge } from '../components/ConfidenceBadge';
import { InfoCard } from '../components/InfoCard';
import { ButtonRow, PrimaryButton } from '../components/PrimaryButton';
import { ScreenShell } from '../components/ScreenShell';
import { colors, spacing } from '../theme';
import type { Species, SpeciesCandidate } from '../types/domain';
import { percent } from '../utils/format';

interface ReviewSpeciesScreenProps {
  candidates: SpeciesCandidate[];
  speciesCatalog: Species[];
  selectedSpeciesId?: string;
  onBack: () => void;
  onConfirm: (speciesId: string) => void;
}

export function ReviewSpeciesScreen({
  candidates,
  speciesCatalog,
  selectedSpeciesId,
  onBack,
  onConfirm
}: ReviewSpeciesScreenProps) {
  const [query, setQuery] = useState('');

  const searched = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return speciesCatalog.slice(0, 8);
    }

    return speciesCatalog.filter((item) => {
      const haystack = [item.commonName, item.scientificName, ...item.aliases].join(' ').toLowerCase();
      return haystack.includes(normalized);
    });
  }, [query, speciesCatalog]);

  const selected = speciesCatalog.find((item) => item.id === selectedSpeciesId);

  return (
    <ScreenShell
      title="Confirm Species"
      subtitle="The model always returns a candidate list. If the top score is low or the species is visually similar, make the angler confirm it."
      footer={<PrimaryButton label="Back" onPress={onBack} variant="ghost" />}
    >
      <InfoCard title="Top Candidates" subtitle="The app keeps the top three predictions and exposes their confidence rather than hiding uncertainty.">
        <View style={styles.stack}>
          {candidates.map((candidate, index) => {
            const active = candidate.speciesId === selectedSpeciesId;
            return (
              <Pressable
                key={candidate.speciesId}
                style={[styles.candidate, active && styles.activeCandidate]}
                onPress={() => onConfirm(candidate.speciesId)}
              >
                <View style={styles.candidateHeader}>
                  <Text style={styles.rank}>#{index + 1}</Text>
                  <Text style={styles.name}>{candidate.commonName}</Text>
                  <ConfidenceBadge
                    label={percent(candidate.confidence)}
                    tone={candidate.confidence >= 0.85 ? 'high' : candidate.confidence >= 0.7 ? 'medium' : 'low'}
                  />
                </View>
                <Text style={styles.reason}>{candidate.reasoning}</Text>
              </Pressable>
            );
          })}
        </View>
      </InfoCard>

      <InfoCard title="Manual Search" subtitle="If the classifier is wrong, choose the species the angler confirms.">
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search species or alias"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        <View style={styles.stack}>
          {searched.slice(0, 6).map((item) => (
            <Pressable
              key={item.id}
              style={[styles.searchResult, item.id === selectedSpeciesId && styles.activeCandidate]}
              onPress={() => onConfirm(item.id)}
            >
              <Text style={styles.name}>{item.commonName}</Text>
              <Text style={styles.reason}>{item.aliases.join(', ')}</Text>
            </Pressable>
          ))}
        </View>
      </InfoCard>

      <ButtonRow>
        <PrimaryButton
          label={selected ? `Use ${selected.commonName}` : 'Select a Species'}
          onPress={() => {
            if (selectedSpeciesId) {
              onConfirm(selectedSpeciesId);
            }
          }}
          disabled={!selectedSpeciesId}
        />
      </ButtonRow>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.sm
  },
  candidate: {
    padding: spacing.md,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs
  },
  activeCandidate: {
    borderColor: colors.accentDark,
    backgroundColor: '#FFF0E5'
  },
  candidateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm
  },
  rank: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.accentDark
  },
  name: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    color: colors.text
  },
  reason: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted
  },
  input: {
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    color: colors.text
  },
  searchResult: {
    padding: spacing.md,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs
  }
});
