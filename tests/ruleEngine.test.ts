import { evaluateCatchLegality } from '../src/features/regulations/ruleEngine';
import { repository } from '../src/features/regulations/repository';
import type { CatchEvaluationInput, DeviceLocation, MeasurementResult, WaterType } from '../src/types/domain';

function location(latitude: number, longitude: number): DeviceLocation {
  return {
    latitude,
    longitude,
    capturedAt: '2026-03-08T12:00:00.000Z',
    source: 'gps'
  };
}

function measurement(
  totalLengthIn: number,
  uncertaintyIn = 0.2,
  confidence = 0.92,
  userAdjusted = true
): MeasurementResult {
  return {
    totalLengthIn,
    uncertaintyIn,
    confidence,
    method: userAdjusted ? 'manual_points' : 'reference_object',
    userAdjusted,
    calibrationReferenceIn: 10,
    fishPixelLength: 480,
    referencePixelLength: 200
  };
}

function buildInput(overrides: Partial<CatchEvaluationInput> & { speciesId: string }): CatchEvaluationInput {
  const waterType: WaterType = overrides.context?.waterType ?? 'saltwater';
  const hasLocationOverride =
    overrides.context !== undefined && Object.prototype.hasOwnProperty.call(overrides.context, 'location');

  return {
    speciesId: overrides.speciesId,
    speciesConfidence: overrides.speciesConfidence ?? 0.93,
    speciesConfirmed: overrides.speciesConfirmed ?? true,
    measurement: overrides.measurement ?? measurement(24),
    context: {
      waterType,
      fishingMode: overrides.context?.fishingMode ?? (waterType === 'freshwater' ? 'inland' : 'shore'),
      location: hasLocationOverride ? overrides.context?.location : location(30.25, -81.39),
      manualZoneId: overrides.context?.manualZoneId,
      retainedCount: overrides.context?.retainedCount ?? 0,
      retainedOverMaxCount: overrides.context?.retainedOverMaxCount ?? 0,
      requestDate: overrides.context?.requestDate ?? '2026-03-08'
    }
  };
}

describe('regulation decision engine', () => {
  test.each([
    ['red drum legal northeast', buildInput({ speciesId: 'red_drum', measurement: measurement(24) }), 'LEGAL'],
    ['red drum too short', buildInput({ speciesId: 'red_drum', measurement: measurement(17, 0.1) }), 'ILLEGAL'],
    ['red drum boundary uncertain', buildInput({ speciesId: 'red_drum', measurement: measurement(17.9, 0.3) }), 'UNCERTAIN'],
    [
      'red drum bag limit exceeded',
      buildInput({ speciesId: 'red_drum', context: { retainedCount: 1, requestDate: '2026-03-08', waterType: 'saltwater', fishingMode: 'shore', location: location(30.25, -81.39) } }),
      'ILLEGAL'
    ],
    ['red drum low species confidence', buildInput({ speciesId: 'red_drum', speciesConfirmed: false, speciesConfidence: 0.62 }), 'UNCERTAIN'],
    ['red drum user-confirmed despite low confidence', buildInput({ speciesId: 'red_drum', speciesConfirmed: true, speciesConfidence: 0.62 }), 'LEGAL'],
    ['black drum legal in slot', buildInput({ speciesId: 'black_drum', measurement: measurement(20) }), 'LEGAL'],
    [
      'black drum one over allowed',
      buildInput({ speciesId: 'black_drum', measurement: measurement(30), context: { retainedCount: 0, retainedOverMaxCount: 0, requestDate: '2026-03-08', waterType: 'saltwater', fishingMode: 'shore', location: location(30.25, -81.39) } }),
      'LEGAL'
    ],
    [
      'black drum second over not allowed',
      buildInput({ speciesId: 'black_drum', measurement: measurement(30), context: { retainedCount: 1, retainedOverMaxCount: 1, requestDate: '2026-03-08', waterType: 'saltwater', fishingMode: 'shore', location: location(30.25, -81.39) } }),
      'ILLEGAL'
    ],
    [
      'southwest snook closed in summer',
      buildInput({ speciesId: 'snook_common', measurement: measurement(30), context: { requestDate: '2026-06-15', waterType: 'saltwater', fishingMode: 'shore', location: location(26.14, -81.80), retainedCount: 0 } }),
      'ILLEGAL'
    ],
    [
      'southwest snook legal in spring',
      buildInput({ speciesId: 'snook_common', measurement: measurement(30), context: { requestDate: '2026-03-15', waterType: 'saltwater', fishingMode: 'shore', location: location(26.14, -81.80), retainedCount: 0 } }),
      'LEGAL'
    ],
    [
      'southeast snook above slot',
      buildInput({ speciesId: 'snook_common', measurement: measurement(33.2), context: { requestDate: '2026-03-10', waterType: 'saltwater', fishingMode: 'shore', location: location(25.77, -80.13), retainedCount: 0 } }),
      'ILLEGAL'
    ],
    [
      'northeast snook legal',
      buildInput({ speciesId: 'snook_common', measurement: measurement(29), context: { requestDate: '2026-03-10', waterType: 'saltwater', fishingMode: 'shore', location: location(30.25, -81.39), retainedCount: 0 } }),
      'LEGAL'
    ],
    [
      'seatrout before effective date',
      buildInput({ speciesId: 'spotted_seatrout', measurement: measurement(17), context: { requestDate: '2026-03-15', waterType: 'saltwater', fishingMode: 'shore', location: location(27.46, -80.29), retainedCount: 0 } }),
      'UNCERTAIN'
    ],
    [
      'central east seatrout closed in November',
      buildInput({ speciesId: 'spotted_seatrout', measurement: measurement(17), context: { requestDate: '2026-11-15', waterType: 'saltwater', fishingMode: 'shore', location: location(27.46, -80.29), retainedCount: 0 } }),
      'ILLEGAL'
    ],
    [
      'south seatrout legal in July',
      buildInput({ speciesId: 'spotted_seatrout', measurement: measurement(18), context: { requestDate: '2026-06-30', waterType: 'saltwater', fishingMode: 'shore', manualZoneId: 'salt_south', retainedCount: 0 } }),
      'LEGAL'
    ],
    ['tarpon is catch and release only', buildInput({ speciesId: 'tarpon', measurement: measurement(42) }), 'ILLEGAL'],
    [
      'largemouth statewide legal under one-over rule',
      buildInput({ speciesId: 'largemouth_bass', measurement: measurement(15), context: { requestDate: '2026-03-08', waterType: 'freshwater', fishingMode: 'inland', location: location(28.54, -81.37), retainedCount: 0 } }),
      'LEGAL'
    ],
    [
      'largemouth statewide second fish over 16 illegal',
      buildInput({ speciesId: 'largemouth_bass', measurement: measurement(18), context: { requestDate: '2026-03-08', waterType: 'freshwater', fishingMode: 'inland', location: location(28.54, -81.37), retainedCount: 1, retainedOverMaxCount: 1 } }),
      'ILLEGAL'
    ],
    [
      'lake victor special area legal under 16',
      buildInput({ speciesId: 'largemouth_bass', measurement: measurement(15.5), context: { requestDate: '2026-03-08', waterType: 'freshwater', fishingMode: 'inland', location: location(30.91, -85.91), retainedCount: 0 } }),
      'LEGAL'
    ],
    [
      'lake victor special area 16 or longer illegal',
      buildInput({ speciesId: 'largemouth_bass', measurement: measurement(16.2), context: { requestDate: '2026-03-08', waterType: 'freshwater', fishingMode: 'inland', location: location(30.91, -85.91), retainedCount: 0 } }),
      'ILLEGAL'
    ],
    [
      'missing zone context returns uncertain',
      buildInput({ speciesId: 'red_drum', context: { requestDate: '2026-03-08', waterType: 'saltwater', fishingMode: 'shore', location: undefined, retainedCount: 0 } }),
      'UNCERTAIN'
    ],
    [
      'stale rule bundle returns uncertain',
      buildInput({ speciesId: 'red_drum', context: { requestDate: '2026-08-01', waterType: 'saltwater', fishingMode: 'shore', location: location(30.25, -81.39), retainedCount: 0 } }),
      'UNCERTAIN'
    ],
    [
      'state-only rule in federal waters returns uncertain',
      buildInput({ speciesId: 'red_drum', context: { requestDate: '2026-03-08', waterType: 'saltwater', fishingMode: 'federal', location: location(30.25, -81.39), retainedCount: 0 } }),
      'UNCERTAIN'
    ],
    ['pompano legal over minimum', buildInput({ speciesId: 'florida_pompano', measurement: measurement(12) }), 'LEGAL'],
    ['pompano under minimum', buildInput({ speciesId: 'florida_pompano', measurement: measurement(10.5, 0.1) }), 'ILLEGAL']
  ])('%s', (_label, input, expected) => {
    expect(evaluateCatchLegality(input, repository).status).toBe(expected);
  });

  test('boundary-crossing measurement with low confidence is uncertain even when a rule matches', () => {
    const result = evaluateCatchLegality(
      buildInput({
        speciesId: 'red_drum',
        measurement: measurement(18.1, 0.4, 0.6, false),
        speciesConfirmed: true
      }),
      repository
    );

    expect(result.status).toBe('UNCERTAIN');
    expect(result.disclaimer).toContain('Verify before harvest');
  });

  test('decision trace includes rule version and source-backed logic', () => {
    const result = evaluateCatchLegality(
      buildInput({
        speciesId: 'red_drum',
        measurement: measurement(24),
        speciesConfirmed: true
      }),
      repository
    );

    expect(result.trace.some((item) => item.title === 'Rule Version')).toBe(true);
    expect(result.trace.some((item) => item.title === 'Rule Logic')).toBe(true);
    expect(result.matchedRule?.rule.sourceUrl).toContain('myfwc.com');
    expect(result.ruleLogicSummary?.length).toBeGreaterThan(0);
  });
});
