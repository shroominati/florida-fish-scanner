import { getSpeciesById, repository } from '../regulations/repository';
import type { SpeciesCandidate } from '../../types/domain';

const defaults = ['red_drum', 'snook_common', 'spotted_seatrout'] as const;

function candidate(speciesId: string, confidence: number, reasoning: string): SpeciesCandidate {
  const species = getSpeciesById(speciesId);

  return {
    speciesId,
    commonName: species?.commonName ?? speciesId,
    confidence,
    reasoning
  };
}

export async function classifyFishPhoto(photoUri?: string): Promise<SpeciesCandidate[]> {
  const normalized = photoUri?.toLowerCase() ?? '';

  if (normalized.includes('tarpon')) {
    return [
      candidate('tarpon', 0.94, 'Large reflective body and upturned mouth pattern match tarpon.'),
      candidate('snook_common', 0.42, 'Elongated profile can overlap with snook in side-view shots.'),
      candidate('red_drum', 0.19, 'Fallback coastal species candidate.')
    ];
  }

  if (normalized.includes('bass')) {
    return [
      candidate('largemouth_bass', 0.91, 'Jawline and dorsal fin split are consistent with largemouth bass.'),
      candidate('black_crappie', 0.23, 'Freshwater deep-bodied fish can be confused in top-down photos.'),
      candidate('snook_common', 0.11, 'Fallback candidate.')
    ];
  }

  if (normalized.includes('pompano')) {
    return [
      candidate('florida_pompano', 0.9, 'Compressed body and short snout match Florida pompano.'),
      candidate('red_drum', 0.18, 'Fallback candidate.'),
      candidate('spotted_seatrout', 0.14, 'Fallback candidate.')
    ];
  }

  if (normalized.includes('snook')) {
    return [
      candidate('snook_common', 0.93, 'Body stripe and mouth shape match common snook.'),
      candidate('tarpon', 0.4, 'Large silver body can overlap with tarpon in bright glare.'),
      candidate('spotted_seatrout', 0.15, 'Fallback candidate.')
    ];
  }

  const mvpSpecies = defaults.map((speciesId, index) =>
    candidate(
      speciesId,
      [0.78, 0.52, 0.33][index] ?? 0.3,
      `Starter classifier fallback based on the Florida MVP species list.`
    )
  );

  return mvpSpecies.sort((left, right) => right.confidence - left.confidence);
}

export function searchSpecies(query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return repository.species.slice().sort((left, right) => left.mvpPriority - right.mvpPriority);
  }

  return repository.species
    .filter((item) => {
      const haystack = [item.commonName, item.scientificName, ...item.aliases].join(' ').toLowerCase();
      return haystack.includes(normalized);
    })
    .sort((left, right) => left.mvpPriority - right.mvpPriority);
}
