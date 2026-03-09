import type { CalibrationMode, SavedCatchRecord, SpeciesCandidate } from '../../types/domain';

function parseCandidates(value: unknown): SpeciesCandidate[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is SpeciesCandidate => {
      if (!item || typeof item !== 'object') {
        return false;
      }

      const candidate = item as Record<string, unknown>;
      return (
        typeof candidate.speciesId === 'string' &&
        typeof candidate.commonName === 'string' &&
        typeof candidate.confidence === 'number' &&
        typeof candidate.reasoning === 'string'
      );
    })
    .slice(0, 3);
}

function parseCalibrationMode(value: unknown): CalibrationMode | undefined {
  return value === 'known_length' || value === 'printed_card' ? value : undefined;
}

function parseDecision(value: unknown): SavedCatchRecord['decision'] {
  return value === 'LEGAL' || value === 'ILLEGAL' || value === 'UNCERTAIN' ? value : 'UNCERTAIN';
}

function parseLocationSource(value: unknown): 'gps' | 'manual' | 'demo' {
  return value === 'manual' || value === 'demo' ? value : 'gps';
}

function parseRetainedDisposition(value: unknown): SavedCatchRecord['retainedDisposition'] {
  return value === 'released' ? 'released' : 'retained';
}

function parseSeverity(value: unknown): 'info' | 'warning' {
  return value === 'warning' ? 'warning' : 'info';
}

export function normalizeSavedCatchRecords(input: unknown): SavedCatchRecord[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
    .map((item, index) => ({
      id: typeof item.id === 'string' ? item.id : `legacy-catch-${index}`,
      createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
      speciesId: typeof item.speciesId === 'string' ? item.speciesId : 'unknown_species',
      speciesName: typeof item.speciesName === 'string' ? item.speciesName : 'Unknown species',
      confidence: typeof item.confidence === 'number' ? item.confidence : 0.5,
      photoUri: typeof item.photoUri === 'string' ? item.photoUri : undefined,
      topCandidates: parseCandidates(item.topCandidates),
      measurementIn: typeof item.measurementIn === 'number' ? item.measurementIn : 0,
      uncertaintyIn: typeof item.uncertaintyIn === 'number' ? item.uncertaintyIn : 0.8,
      measurementConfidence:
        typeof item.measurementConfidence === 'number' ? item.measurementConfidence : 0.65,
      calibrationMode: parseCalibrationMode(item.calibrationMode),
      decision: parseDecision(item.decision),
      zoneName: typeof item.zoneName === 'string' ? item.zoneName : undefined,
      location:
        item.location && typeof item.location === 'object'
          ? {
              latitude:
                typeof (item.location as Record<string, unknown>).latitude === 'number'
                  ? ((item.location as Record<string, unknown>).latitude as number)
                  : 0,
              longitude:
                typeof (item.location as Record<string, unknown>).longitude === 'number'
                  ? ((item.location as Record<string, unknown>).longitude as number)
                  : 0,
              accuracyM:
                typeof (item.location as Record<string, unknown>).accuracyM === 'number'
                  ? ((item.location as Record<string, unknown>).accuracyM as number)
                  : undefined,
              capturedAt:
                typeof (item.location as Record<string, unknown>).capturedAt === 'string'
                  ? ((item.location as Record<string, unknown>).capturedAt as string)
                  : new Date().toISOString(),
              source: parseLocationSource((item.location as Record<string, unknown>).source)
            }
          : undefined,
      retainedDisposition: parseRetainedDisposition(item.retainedDisposition),
      decisionTrace: Array.isArray(item.decisionTrace)
        ? item.decisionTrace
            .filter((trace): trace is SavedCatchRecord['decisionTrace'][number] => {
              if (!trace || typeof trace !== 'object') {
                return false;
              }
              const candidate = trace as Record<string, unknown>;
              return typeof candidate.title === 'string' && typeof candidate.detail === 'string';
            })
            .map((trace) => ({
              title: trace.title,
              detail: trace.detail,
              sourceUrl: typeof trace.sourceUrl === 'string' ? trace.sourceUrl : undefined,
              severity: parseSeverity(trace.severity)
            }))
        : [],
      why: Array.isArray(item.why)
        ? item.why.filter((reason): reason is string => typeof reason === 'string')
        : []
    }))
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}
