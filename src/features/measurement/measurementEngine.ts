import type {
  CalibrationMode,
  ConfidenceLabel,
  MeasurementMethod,
  MeasurementResult,
  Point2D
} from '../../types/domain';

interface MeasurementInput {
  method: MeasurementMethod;
  fishPixelLength: number;
  referencePixelLength: number;
  referenceLengthIn: number;
  userAdjusted: boolean;
  calibrationMode?: CalibrationMode;
  sourcePhotoUri?: string;
  nosePoint?: Point2D;
  tailPoint?: Point2D;
  referenceStartPoint?: Point2D;
  referenceEndPoint?: Point2D;
  autoConfidence?: number;
}

export interface ManualMeasurementInput {
  nosePoint: Point2D;
  tailPoint: Point2D;
  referenceStartPoint: Point2D;
  referenceEndPoint: Point2D;
  referenceLengthIn: number;
  calibrationMode: CalibrationMode;
  sourcePhotoUri?: string;
  userAdjusted: boolean;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function labelForConfidence(score: number): ConfidenceLabel {
  if (score >= 0.85) {
    return 'high';
  }
  if (score >= 0.65) {
    return 'medium';
  }
  return 'low';
}

export function distanceBetweenPoints(start: Point2D, end: Point2D): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function estimateFishLengthFromPoints(input: ManualMeasurementInput): MeasurementResult {
  const fishPixelLength = distanceBetweenPoints(input.nosePoint, input.tailPoint);
  const referencePixelLength = distanceBetweenPoints(input.referenceStartPoint, input.referenceEndPoint);
  const coverageRatio = referencePixelLength / Math.max(fishPixelLength, 1);
  const pointConfidence = clamp(
    0.62 + Math.min(fishPixelLength, 1) * 0.18 + Math.min(referencePixelLength, 0.35) * 0.28,
    0.45,
    0.96
  );

  return estimateFishLength({
    method: input.calibrationMode === 'printed_card' ? 'ruler_card' : 'manual_points',
    fishPixelLength,
    referencePixelLength,
    referenceLengthIn: input.referenceLengthIn,
    calibrationMode: input.calibrationMode,
    userAdjusted: input.userAdjusted,
    sourcePhotoUri: input.sourcePhotoUri,
    nosePoint: input.nosePoint,
    tailPoint: input.tailPoint,
    referenceStartPoint: input.referenceStartPoint,
    referenceEndPoint: input.referenceEndPoint,
    autoConfidence: clamp(pointConfidence * 0.8 + coverageRatio * 0.2, 0.45, 0.97)
  });
}

export function estimateFishLength(input: MeasurementInput): MeasurementResult {
  const pixelsPerInch = input.referencePixelLength / input.referenceLengthIn;
  const totalLengthIn = input.fishPixelLength / pixelsPerInch;
  const ratioConfidence = clamp(input.referencePixelLength / Math.max(input.fishPixelLength, 1), 0.2, 1);
  const methodBoost =
    input.method === 'ruler_card'
      ? 0.9
      : input.method === 'manual_points'
        ? 0.82
        : input.method === 'ar_anchor'
          ? 0.78
          : 0.72;
  const userBoost = input.userAdjusted ? 0.08 : 0;
  const confidence = clamp((input.autoConfidence ?? 0.7) * 0.4 + ratioConfidence * 0.3 + methodBoost * 0.3 + userBoost, 0.4, 0.98);
  const uncertaintyIn = clamp((1 - confidence) * 3.2, 0.2, 2.4);

  return {
    totalLengthIn: Number(totalLengthIn.toFixed(1)),
    uncertaintyIn: Number(uncertaintyIn.toFixed(1)),
    confidence: Number(confidence.toFixed(2)),
    confidenceLabel: labelForConfidence(confidence),
    method: input.method,
    calibrationMode: input.calibrationMode,
    userAdjusted: input.userAdjusted,
    calibrationReferenceIn: Number(input.referenceLengthIn.toFixed(1)),
    fishPixelLength: input.fishPixelLength,
    referencePixelLength: input.referencePixelLength,
    sourcePhotoUri: input.sourcePhotoUri,
    nosePoint: input.nosePoint,
    tailPoint: input.tailPoint,
    referenceStartPoint: input.referenceStartPoint,
    referenceEndPoint: input.referenceEndPoint,
    notes: [
      input.userAdjusted
        ? 'Manual point placement was used for fish and reference calibration.'
        : 'This estimate relies on non-manual alignment and should be checked carefully.'
    ]
  };
}
