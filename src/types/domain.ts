export type WaterType = 'saltwater' | 'freshwater';
export type FishingMode =
  | 'shore'
  | 'boat'
  | 'pier'
  | 'reef'
  | 'inland'
  | 'nearshore'
  | 'offshore'
  | 'federal';
export type DecisionStatus = 'LEGAL' | 'ILLEGAL' | 'UNCERTAIN';
export type MeasurementMethod = 'ruler_card' | 'reference_object' | 'manual_points' | 'ar_anchor';
export type CalibrationMode = 'printed_card' | 'known_length';
export type RuleSourceType = 'official' | 'official_federal' | 'secondary_cache';
export type ZoneGeometryType = 'bbox';
export type FederalScope = 'state_only' | 'adjacent_federal' | 'federal_only';
export type LocationSource = 'gps' | 'manual' | 'demo';
export type SeasonWindowStatus = 'open' | 'closed';
export type ConfidenceLabel = 'high' | 'medium' | 'low';
export type RetainedDisposition = 'retained' | 'released';
export type ScanFailureReason =
  | 'no_fish_detected'
  | 'frame_too_dark'
  | 'frame_too_bright'
  | 'frame_too_blurry'
  | 'camera_angle_too_steep'
  | 'fish_too_small'
  | 'fish_cut_off'
  | 'reference_not_visible'
  | 'image_read_failed'
  | 'classifier_low_confidence';
export type ScanReadiness = 'ready' | 'needs_review' | 'retry_recommended';

export interface Point2D {
  x: number;
  y: number;
}

export interface VisionConfidence {
  score: number;
  label: ConfidenceLabel;
  reasons: string[];
}

export interface ScanPhotoAsset {
  uri: string;
  width: number;
  height: number;
  fileSizeBytes?: number;
  exifBrightnessValue?: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Species {
  id: string;
  commonName: string;
  scientificName: string;
  aliases: string[];
  waterTypes: WaterType[];
  confusionSpeciesIds: string[];
  mvpPriority: number;
  notes: string[];
}

export interface SpeciesCandidate {
  speciesId: string;
  commonName: string;
  confidence: number;
  reasoning: string;
}

export interface MeasurementResult {
  totalLengthIn: number;
  uncertaintyIn: number;
  confidence: number;
  confidenceLabel?: ConfidenceLabel;
  method: MeasurementMethod;
  calibrationMode?: CalibrationMode;
  userAdjusted: boolean;
  calibrationReferenceIn: number;
  fishPixelLength: number;
  referencePixelLength: number;
  sourcePhotoUri?: string;
  nosePoint?: Point2D;
  tailPoint?: Point2D;
  referenceStartPoint?: Point2D;
  referenceEndPoint?: Point2D;
  notes?: string[];
}

export interface AnnualDateWindow {
  startMonthDay: string;
  endMonthDay: string;
  status: SeasonWindowStatus;
  note: string;
}

export interface RuleVersion {
  id: string;
  label: string;
  publishedAt: string;
  freshnessWindowDays: number;
  staleWarningThresholdDays: number;
  effectiveStart: string;
  effectiveEnd: string | null;
  updatedAt: string;
  sourceIds: string[];
  notes: string[];
}

export interface DataSource {
  id: string;
  label: string;
  authority: string;
  type: RuleSourceType;
  url: string;
  lastVerifiedAt: string;
  notes: string[];
}

export interface RegulationZone {
  id: string;
  name: string;
  waterType: WaterType;
  region: string;
  priority: number;
  parentZoneId: string | null;
  geometryType: ZoneGeometryType | null;
  bounds?: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  manualOnly?: boolean;
  notes: string[];
}

export interface RegulationRule {
  id: string;
  speciesId: string;
  jurisdiction: 'FL';
  waterType: WaterType;
  zoneId: string;
  fishingModes: FishingMode[];
  appliesInFederalWaters: FederalScope;
  effectiveStart: string;
  effectiveEnd: string | null;
  minLengthIn?: number;
  maxLengthIn?: number;
  minLengthInclusive?: boolean;
  maxLengthInclusive?: boolean;
  slotOnly?: boolean;
  bagLimitPerPerson?: number;
  possessionLimit?: number;
  vesselLimit?: number;
  catchAndReleaseOnly?: boolean;
  allowOneOverMaxCount?: number;
  seasonWindows: AnnualDateWindow[];
  specialNotes: string[];
  sourceType: RuleSourceType;
  sourceLabel: string;
  sourceUrl: string;
  sourceId: string;
  version: string;
  updatedAt: string;
}

export interface DeviceLocation {
  latitude: number;
  longitude: number;
  accuracyM?: number;
  capturedAt: string;
  source: LocationSource;
}

export interface CatchContext {
  waterType: WaterType;
  fishingMode: FishingMode;
  location?: DeviceLocation;
  manualZoneId?: string;
  waterbodyName?: string;
  retainedCount: number;
  retainedOverMaxCount?: number;
  requestDate: string;
}

export interface CatchEvaluationInput {
  speciesId: string;
  speciesConfidence: number;
  speciesConfirmed: boolean;
  measurement: MeasurementResult;
  context: CatchContext;
}

export interface MatchedRule {
  rule: RegulationRule;
  zone: RegulationZone;
  ruleVersion: RuleVersion;
}

export interface EvaluationTrace {
  title: string;
  detail: string;
  sourceUrl?: string;
  severity?: 'info' | 'warning';
}

export interface EvaluationSummary {
  status: DecisionStatus;
  confidenceLabel: ConfidenceLabel;
  matchedRule?: MatchedRule;
  zone?: RegulationZone;
  staleData: boolean;
  reasons: string[];
  trace: EvaluationTrace[];
  bagLimitSummary?: string;
  seasonSummary?: string;
  ruleLogicSummary?: string[];
  notes: string[];
  disclaimer?: string;
}

export interface RuleRepository {
  species: Species[];
  rules: RegulationRule[];
  zones: RegulationZone[];
  ruleVersions: RuleVersion[];
  dataSources: DataSource[];
}

export interface LengthEvaluation {
  status: DecisionStatus;
  explanation: string;
}

export interface ScanQualityAssessment {
  brightness: VisionConfidence;
  blur: VisionConfidence;
  angle: VisionConfidence;
  framing: VisionConfidence;
  warnings: ScanFailureReason[];
  guidance: string[];
}

export interface FishDetectionResult {
  detected: boolean;
  confidence: VisionConfidence;
  boundingBox?: BoundingBox;
  warnings: ScanFailureReason[];
  guidance: string[];
}

export interface ClassificationResult {
  candidates: SpeciesCandidate[];
  selectedSpeciesId?: string;
  confidence: VisionConfidence;
  warnings: ScanFailureReason[];
}

export interface VisionScanAnalysis {
  scanId: string;
  detectorName: string;
  classifierName: string;
  capturedAt: string;
  photo: ScanPhotoAsset;
  readiness: ScanReadiness;
  quality: ScanQualityAssessment;
  detection: FishDetectionResult;
  classification: ClassificationResult;
  failures: ScanFailureReason[];
  summary: string[];
}

export interface ScanSession {
  id?: string;
  photoUri?: string;
  capturedAt?: string;
  deviceLocation?: DeviceLocation;
  photoAsset?: ScanPhotoAsset;
  scanAnalysis?: VisionScanAnalysis;
  speciesCandidates: SpeciesCandidate[];
  selectedSpeciesId?: string;
  speciesConfirmed: boolean;
  measurement?: MeasurementResult;
  context: CatchContext;
  evaluation?: EvaluationSummary;
}

export interface SavedCatchRecord {
  id: string;
  createdAt: string;
  speciesId: string;
  speciesName: string;
  confidence: number;
  photoUri?: string;
  topCandidates: SpeciesCandidate[];
  measurementIn: number;
  uncertaintyIn: number;
  measurementConfidence: number;
  calibrationMode?: CalibrationMode;
  decision: DecisionStatus;
  zoneName?: string;
  location?: DeviceLocation;
  retainedDisposition: RetainedDisposition;
  decisionTrace: EvaluationTrace[];
  why: string[];
}
