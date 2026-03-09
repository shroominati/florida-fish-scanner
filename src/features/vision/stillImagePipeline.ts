import * as FileSystem from 'expo-file-system';

import { classifyFishPhoto } from '../classifier/mockClassifier';
import type {
  ClassificationResult,
  ConfidenceLabel,
  FishDetectionResult,
  ScanFailureReason,
  ScanPhotoAsset,
  ScanQualityAssessment,
  ScanSession,
  VisionConfidence,
  VisionScanAnalysis
} from '../../types/domain';
import type { FishClassifier, FishDetector, ScanVisionPipeline, VisionFrameInput } from './interfaces';

function labelForScore(score: number): ConfidenceLabel {
  if (score >= 0.85) {
    return 'high';
  }
  if (score >= 0.65) {
    return 'medium';
  }
  return 'low';
}

function confidence(score: number, reasons: string[]): VisionConfidence {
  const clamped = Math.max(0, Math.min(0.99, Number(score.toFixed(2))));
  return {
    score: clamped,
    label: labelForScore(clamped),
    reasons
  };
}

function normalizedFileDensity(photo: ScanPhotoAsset): number {
  const pixels = Math.max(photo.width * photo.height, 1);
  const bytes = photo.fileSizeBytes ?? pixels * 0.4;
  return Math.min(1, bytes / pixels);
}

function brightnessScore(photo: ScanPhotoAsset): number {
  if (typeof photo.exifBrightnessValue === 'number') {
    const normalized = (photo.exifBrightnessValue + 4) / 8;
    return Math.max(0, Math.min(1, normalized));
  }

  return Math.max(0.25, Math.min(0.85, normalizedFileDensity(photo) + 0.18));
}

function blurScore(photo: ScanPhotoAsset): number {
  return Math.max(0.2, Math.min(0.95, normalizedFileDensity(photo) * 1.2));
}

function angleScore(photo: ScanPhotoAsset): number {
  const ratio = photo.width / Math.max(photo.height, 1);
  if (ratio >= 1.2) {
    return 0.88;
  }
  if (ratio >= 0.95) {
    return 0.7;
  }
  return 0.48;
}

function framingScore(photo: ScanPhotoAsset): number {
  const shortestSide = Math.min(photo.width, photo.height);
  if (shortestSide >= 900) {
    return 0.9;
  }
  if (shortestSide >= 700) {
    return 0.74;
  }
  return 0.52;
}

function warningsFromQuality(
  photo: ScanPhotoAsset
): { quality: ScanQualityAssessment; fishLikelyVisible: boolean } {
  const brightness = brightnessScore(photo);
  const blur = blurScore(photo);
  const angle = angleScore(photo);
  const framing = framingScore(photo);
  const warnings: ScanFailureReason[] = [];
  const guidance: string[] = [];

  if (brightness < 0.35) {
    warnings.push('frame_too_dark');
    guidance.push('Move into brighter light or avoid backlighting before capture.');
  } else if (brightness > 0.9) {
    warnings.push('frame_too_bright');
    guidance.push('Reduce glare on reflective scales and move the fish out of direct hotspots.');
  }

  if (blur < 0.45) {
    warnings.push('frame_too_blurry');
    guidance.push('Stabilize the phone and wait for focus lock before capturing.');
  }

  if (angle < 0.6) {
    warnings.push('camera_angle_too_steep');
    guidance.push('Shoot from above with the fish lying flatter across the frame.');
  }

  if (framing < 0.6) {
    warnings.push('fish_too_small');
    guidance.push('Move closer so the fish body and calibration reference occupy more of the frame.');
  }

  const fishLikelyVisible =
    !photo.uri.includes('no-fish') &&
    brightness >= 0.28 &&
    blur >= 0.32 &&
    framing >= 0.45;

  return {
    fishLikelyVisible,
    quality: {
      brightness: confidence(brightness, ['Exposure estimate based on EXIF brightness or image density.']),
      blur: confidence(blur, ['Sharpness estimate based on file density relative to image size.']),
      angle: confidence(angle, ['Camera angle estimate based on frame orientation and framing geometry.']),
      framing: confidence(framing, ['Framing estimate based on captured resolution and crop risk.']),
      warnings,
      guidance
    }
  };
}

export async function enrichPhotoAsset(
  photo: Omit<ScanPhotoAsset, 'fileSizeBytes'> & { fileSizeBytes?: number }
): Promise<ScanPhotoAsset> {
  if (photo.fileSizeBytes || !photo.uri || photo.uri.startsWith('demo://')) {
    return photo;
  }

  try {
    const fileInfo = await FileSystem.getInfoAsync(photo.uri);
    return {
      ...photo,
      fileSizeBytes: fileInfo.exists && 'size' in fileInfo ? fileInfo.size : undefined
    };
  } catch {
    return photo;
  }
}

export class HeuristicFishDetector implements FishDetector {
  readonly name = 'heuristic-still-detector';

  async detectFish(input: VisionFrameInput): Promise<FishDetectionResult> {
    const { quality, fishLikelyVisible } = warningsFromQuality(input.photo);
    const failures = [...quality.warnings];

    if (!fishLikelyVisible) {
      failures.push('no_fish_detected');
    }

    const areaScore = Math.max(0.25, Math.min(0.95, (input.photo.width * input.photo.height) / 1400000));
    const score = fishLikelyVisible ? Math.min(0.93, areaScore * 0.65 + 0.28) : 0.22;

    return {
      detected: fishLikelyVisible,
      confidence: confidence(
        score,
        fishLikelyVisible
          ? ['Still-image heuristic found a likely fish-shaped subject and usable frame quality.']
          : ['Still-image heuristic did not find a reliable fish subject in the frame.']
      ),
      boundingBox: fishLikelyVisible
        ? {
            x: 0.12,
            y: 0.24,
            width: 0.76,
            height: 0.38
          }
        : undefined,
      warnings: failures,
      guidance: fishLikelyVisible
        ? quality.guidance
        : [...quality.guidance, 'Retake the photo with the full fish body and reference visible.']
    };
  }
}

export class MockFishClassifier implements FishClassifier {
  readonly name = 'mock-species-classifier-v2';

  async classifyFish(input: VisionFrameInput): Promise<ClassificationResult> {
    const candidates = await classifyFishPhoto(input.photo.uri);
    const top = candidates[0];
    const warnings: ScanFailureReason[] = [];

    if ((top?.confidence ?? 0) < 0.85) {
      warnings.push('classifier_low_confidence');
    }

    return {
      candidates,
      selectedSpeciesId: top?.speciesId,
      confidence: confidence(top?.confidence ?? 0.4, [
        'Top-1 species confidence from the current classifier implementation.'
      ]),
      warnings
    };
  }
}

export class StillImageScanPipeline implements ScanVisionPipeline {
  readonly name = 'still-image-analysis-pipeline';

  constructor(
    private readonly detector: FishDetector = new HeuristicFishDetector(),
    private readonly classifier: FishClassifier = new MockFishClassifier()
  ) {}

  async analyzeFrame(input: VisionFrameInput): Promise<VisionScanAnalysis> {
    const photo = await enrichPhotoAsset(input.photo);
    const qualityState = warningsFromQuality(photo);
    const detection = await this.detector.detectFish({ ...input, photo });
    const classification = await this.classifier.classifyFish({ ...input, photo });

    const failures = Array.from(
      new Set([
        ...qualityState.quality.warnings,
        ...detection.warnings,
        ...classification.warnings
      ])
    );

    const readiness =
      !detection.detected || failures.includes('no_fish_detected')
        ? 'retry_recommended'
        : classification.confidence.score < 0.85 || qualityState.quality.warnings.length > 0
          ? 'needs_review'
          : 'ready';

    const summary = [
      detection.detected ? 'Fish detected in the captured frame.' : 'No reliable fish subject detected.',
      ...qualityState.quality.guidance,
      classification.confidence.score < 0.85
        ? 'Species confidence is below the auto-accept threshold. Confirmation is required.'
        : 'Species confidence is strong enough to prefill the confirmation step.'
    ];

    return {
      scanId: input.session.id ?? `scan-${Date.now()}`,
      detectorName: this.detector.name,
      classifierName: this.classifier.name,
      capturedAt: input.session.capturedAt ?? new Date().toISOString(),
      photo,
      readiness,
      quality: qualityState.quality,
      detection,
      classification,
      failures,
      summary
    };
  }
}

export const stillImagePipeline = new StillImageScanPipeline();
