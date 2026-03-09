import { normalizeSavedCatchRecords } from '../src/features/storage/catchRecordParser';
import { parseRuleVersions, parseRules } from '../src/features/regulations/parsers';

describe('bundle parsing guards', () => {
  test('fills missing version metadata with migration-safe defaults', () => {
    const parsed = parseRuleVersions([
      {
        id: 'v1',
        label: 'Version 1',
        publishedAt: '2026-03-08',
        freshnessWindowDays: 120,
        sourceIds: []
      }
    ]);

    expect(parsed[0]?.staleWarningThresholdDays).toBe(90);
    expect(parsed[0]?.effectiveStart).toBe('2026-03-08');
    expect(parsed[0]?.updatedAt).toBe('2026-03-08');
  });

  test('fills missing rule updated_at from effective start', () => {
    const parsed = parseRules([
      {
        id: 'rule-1',
        speciesId: 'red_drum',
        waterType: 'saltwater',
        zoneId: 'salt_statewide',
        fishingModes: ['shore'],
        appliesInFederalWaters: 'state_only',
        effectiveStart: '2026-03-08',
        effectiveEnd: null,
        seasonWindows: [],
        specialNotes: [],
        sourceType: 'official',
        sourceLabel: 'FWC',
        sourceUrl: 'https://example.com',
        sourceId: 'source-1',
        version: 'v1'
      }
    ]);

    expect(parsed[0]?.updatedAt).toBe('2026-03-08');
  });
});

describe('saved catch normalization', () => {
  test('upgrades legacy records without crashing', () => {
    const parsed = normalizeSavedCatchRecords([
      {
        id: 'legacy-1',
        createdAt: '2026-03-08T00:00:00.000Z',
        speciesId: 'red_drum',
        speciesName: 'Red Drum',
        confidence: 0.81,
        measurementIn: 22.5,
        decision: 'LEGAL',
        why: ['legacy trace']
      }
    ]);

    expect(parsed[0]?.retainedDisposition).toBe('retained');
    expect(parsed[0]?.topCandidates).toEqual([]);
    expect(parsed[0]?.uncertaintyIn).toBe(0.8);
    expect(parsed[0]?.decisionTrace).toEqual([]);
  });
});
