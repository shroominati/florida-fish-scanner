import {
  distanceBetweenPoints,
  estimateFishLengthFromPoints
} from '../src/features/measurement/measurementEngine';

describe('measurement engine', () => {
  test('computes Euclidean distance between points', () => {
    expect(distanceBetweenPoints({ x: 0, y: 0 }, { x: 3, y: 4 })).toBeCloseTo(5);
  });

  test('builds a manual printed-card measurement from annotation points', () => {
    const result = estimateFishLengthFromPoints({
      nosePoint: { x: 0.1, y: 0.5 },
      tailPoint: { x: 0.8, y: 0.5 },
      referenceStartPoint: { x: 0.15, y: 0.8 },
      referenceEndPoint: { x: 0.35, y: 0.8 },
      referenceLengthIn: 4,
      calibrationMode: 'printed_card',
      sourcePhotoUri: 'demo://fish',
      userAdjusted: true
    });

    expect(result.totalLengthIn).toBeCloseTo(14, 0);
    expect(result.calibrationMode).toBe('printed_card');
    expect(result.method).toBe('ruler_card');
    expect(result.nosePoint).toEqual({ x: 0.1, y: 0.5 });
    expect(result.referenceStartPoint).toEqual({ x: 0.15, y: 0.8 });
    expect(result.confidence).toBeGreaterThan(0.65);
    expect(result.confidenceLabel).toBe('medium');
  });

  test('marks auto confidence lower when the reference span is weak', () => {
    const result = estimateFishLengthFromPoints({
      nosePoint: { x: 0.1, y: 0.2 },
      tailPoint: { x: 0.95, y: 0.25 },
      referenceStartPoint: { x: 0.1, y: 0.8 },
      referenceEndPoint: { x: 0.16, y: 0.8 },
      referenceLengthIn: 2,
      calibrationMode: 'known_length',
      userAdjusted: true
    });

    expect(result.confidenceLabel).toBe('low');
    expect(result.uncertaintyIn).toBeGreaterThan(0.2);
  });
});
