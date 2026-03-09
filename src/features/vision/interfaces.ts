import type {
  ClassificationResult,
  FishDetectionResult,
  ScanPhotoAsset,
  ScanSession,
  VisionScanAnalysis
} from '../../types/domain';

export interface VisionFrameInput {
  photo: ScanPhotoAsset;
  session: ScanSession;
}

export interface FishDetector {
  readonly name: string;
  detectFish(input: VisionFrameInput): Promise<FishDetectionResult>;
}

export interface FishClassifier {
  readonly name: string;
  classifyFish(input: VisionFrameInput): Promise<ClassificationResult>;
}

export interface ScanVisionPipeline {
  readonly name: string;
  analyzeFrame(input: VisionFrameInput): Promise<VisionScanAnalysis>;
}
