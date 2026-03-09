import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { ConfidenceBadge } from '../components/ConfidenceBadge';
import { InfoCard } from '../components/InfoCard';
import { ButtonRow, PrimaryButton } from '../components/PrimaryButton';
import { ScreenShell } from '../components/ScreenShell';
import { colors, spacing } from '../theme';
import type { DeviceLocation, ScanPhotoAsset, VisionScanAnalysis } from '../types/domain';

interface ScanScreenProps {
  deviceLocation?: DeviceLocation;
  analysis?: VisionScanAnalysis;
  isAnalyzing: boolean;
  onBack: () => void;
  onCapture: (photo: ScanPhotoAsset, location?: DeviceLocation) => void;
  onRefreshLocation: () => Promise<DeviceLocation | undefined>;
  onRetake: () => void;
  onContinue: () => void;
}

async function getWebImageDimensions(uri: string): Promise<{ width: number; height: number }> {
  return await new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => {
      resolve({
        width: image.naturalWidth || image.width || 1280,
        height: image.naturalHeight || image.height || 720
      });
    };
    image.onerror = () => reject(new Error('Unable to read image dimensions.'));
    image.src = uri;
  });
}

async function pickWebPhoto(captureHint?: 'environment'): Promise<ScanPhotoAsset | undefined> {
  if (Platform.OS !== 'web' || typeof document === 'undefined') {
    return undefined;
  }

  return await new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    if (captureHint) {
      input.setAttribute('capture', captureHint);
    }

    input.onchange = async () => {
      const file = input.files?.[0];

      if (!file) {
        resolve(undefined);
        return;
      }

      const uri = URL.createObjectURL(file);

      try {
        const dimensions = await getWebImageDimensions(uri);
        resolve({
          uri,
          width: dimensions.width,
          height: dimensions.height,
          fileSizeBytes: file.size
        });
      } catch {
        resolve({
          uri,
          width: 1280,
          height: 720,
          fileSizeBytes: file.size
        });
      }
    };

    input.click();
  });
}

export function ScanScreen({
  deviceLocation,
  analysis,
  isAnalyzing,
  onBack,
  onCapture,
  onRefreshLocation,
  onRetake,
  onContinue
}: ScanScreenProps) {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [working, setWorking] = useState(false);

  const capture = async (fallback?: Partial<ScanPhotoAsset>, webCaptureHint?: 'environment') => {
    setWorking(true);
    const location = (await onRefreshLocation()) ?? deviceLocation;

    if (fallback?.uri) {
      onCapture(
        {
          uri: fallback.uri,
          width: fallback.width ?? 1280,
          height: fallback.height ?? 720,
          fileSizeBytes: fallback.fileSizeBytes,
          exifBrightnessValue: fallback.exifBrightnessValue
        },
        location
      );
      setWorking(false);
      return;
    }

    try {
      if (Platform.OS === 'web') {
        const webPhoto = await pickWebPhoto(webCaptureHint);

        if (webPhoto) {
          onCapture(webPhoto, location);
        }

        return;
      }

      const photo = await cameraRef.current?.takePictureAsync({
        quality: 0.7,
        exif: true,
        skipProcessing: true
      });

      onCapture(
        {
          uri: photo?.uri ?? `demo://capture-${Date.now()}`,
          width: photo?.width ?? 1280,
          height: photo?.height ?? 720,
          exifBrightnessValue:
            typeof photo?.exif?.BrightnessValue === 'number'
              ? photo.exif.BrightnessValue
              : undefined
        },
        location
      );
    } finally {
      setWorking(false);
    }
  };

  const ready = !working && !isAnalyzing;

  return (
    <ScreenShell
      title="Scan Fish"
      subtitle="Still-image analysis is live now. Frame the full fish with the reference card visible, capture once, then review the quality and detection result before species confirmation."
      footer={<PrimaryButton label="Back Home" onPress={onBack} variant="ghost" />}
    >
      <InfoCard
        title="Location Context"
        subtitle={
          deviceLocation
            ? `GPS ${deviceLocation.latitude.toFixed(4)}, ${deviceLocation.longitude.toFixed(4)}`
            : 'Location not captured yet. The result can still run with a manual zone.'
        }
      >
        <PrimaryButton
          label="Refresh GPS"
          onPress={() => {
            void onRefreshLocation();
          }}
          variant="secondary"
        />
      </InfoCard>

      <InfoCard
        title="Frame Quality Guide"
        subtitle="The scan assistant checks brightness, blur, angle, framing, and whether a fish is likely visible."
      >
        <Text style={styles.helpText}>• Shoot from above with the fish lying flatter across the frame.</Text>
        <Text style={styles.helpText}>• Keep the full nose, tail, and printed card or known reference visible.</Text>
        <Text style={styles.helpText}>• Avoid glare and let the camera focus before capture.</Text>
      </InfoCard>

      {Platform.OS === 'web' ? (
        <InfoCard
          title="Browser Photo Capture"
          subtitle="On the web build, use your device camera or photo library to pick a fish image, then the same scan review and measurement flow continues."
        >
          <Text style={styles.helpText}>• On a phone browser, `Use Phone Camera` should open the rear camera when supported.</Text>
          <Text style={styles.helpText}>• On desktop, `Upload Photo` lets you choose an existing fish image.</Text>
        </InfoCard>
      ) : permission?.granted ? (
        <View style={styles.cameraWrap}>
          <CameraView ref={cameraRef} style={styles.camera} facing="back" />
          <View style={styles.frameGuide} pointerEvents="none">
            <Text style={styles.guideLabel}>Fish body inside frame</Text>
            <Text style={styles.guideLabelBottom}>Reference card visible near belly line</Text>
          </View>
        </View>
      ) : (
        <InfoCard
          title="Camera Access"
          subtitle="On web or when camera permission is unavailable, use the demo scan buttons to exercise the flow."
        >
          <PrimaryButton
            label={permission?.granted ? 'Camera Ready' : 'Allow Camera'}
            onPress={() => {
              void requestPermission();
            }}
            variant="secondary"
          />
        </InfoCard>
      )}

      <ButtonRow>
        {Platform.OS === 'web' ? (
          <>
            <PrimaryButton
              label={working || isAnalyzing ? 'Analyzing...' : 'Use Phone Camera'}
              onPress={() => {
                void capture(undefined, 'environment');
              }}
              disabled={!ready}
            />
            <PrimaryButton
              label="Upload Photo"
              onPress={() => {
                void capture();
              }}
              variant="secondary"
              disabled={!ready}
            />
          </>
        ) : (
          <PrimaryButton
            label={working || isAnalyzing ? 'Analyzing...' : 'Capture Frame'}
            onPress={() => {
              void capture();
            }}
            disabled={!ready}
          />
        )}
        <PrimaryButton
          label="Demo Fish"
          onPress={() => {
            void capture({ uri: 'demo://red-drum-photo', width: 1280, height: 720, fileSizeBytes: 520000 });
          }}
          variant="secondary"
          disabled={!ready}
        />
        <PrimaryButton
          label="Demo No Fish"
          onPress={() => {
            void capture({ uri: 'demo://no-fish-photo', width: 900, height: 1200, fileSizeBytes: 140000, exifBrightnessValue: -2 });
          }}
          variant="secondary"
          disabled={!ready}
        />
      </ButtonRow>

      {(working || isAnalyzing) && (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={colors.accentDark} />
          <Text style={styles.loadingText}>Running detector, classifier, and frame-quality checks.</Text>
        </View>
      )}

      {analysis ? (
        <InfoCard
          title={analysis.detection.detected ? 'Fish Detected' : 'No Fish Detected'}
          subtitle={`Detector: ${analysis.detectorName} • Classifier: ${analysis.classifierName}`}
        >
          <Image source={{ uri: analysis.photo.uri }} style={styles.previewImage} resizeMode="cover" />

          <View style={styles.badgeRow}>
            <ConfidenceBadge
              label={analysis.detection.detected ? 'fish detected' : 'retry recommended'}
              tone={
                analysis.readiness === 'ready'
                  ? 'high'
                  : analysis.readiness === 'needs_review'
                    ? 'medium'
                    : 'low'
              }
            />
            <ConfidenceBadge
              label={`${Math.round(analysis.classification.confidence.score * 100)}% species`}
              tone={analysis.classification.confidence.label}
            />
          </View>

          <View style={styles.metricGrid}>
            <Metric label="Brightness" value={analysis.quality.brightness.label} />
            <Metric label="Blur" value={analysis.quality.blur.label} />
            <Metric label="Angle" value={analysis.quality.angle.label} />
            <Metric label="Framing" value={analysis.quality.framing.label} />
          </View>

          {analysis.summary.map((item) => (
            <Text key={item} style={styles.helpText}>
              • {item}
            </Text>
          ))}

          <ButtonRow>
            <PrimaryButton label="Retake" onPress={onRetake} variant="secondary" />
            <PrimaryButton
              label={analysis.detection.detected ? 'Continue to Species Review' : 'Continue with Manual Review'}
              onPress={onContinue}
              variant={analysis.detection.detected ? 'primary' : 'danger'}
            />
          </ButtonRow>
        </InfoCard>
      ) : null}
    </ScreenShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraWrap: {
    height: 340,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: '#0F2430'
  },
  camera: {
    flex: 1
  },
  frameGuide: {
    position: 'absolute',
    top: '12%',
    left: '7%',
    right: '7%',
    bottom: '18%',
    borderWidth: 3,
    borderColor: '#F5EFE2',
    borderRadius: 20,
    justifyContent: 'space-between',
    padding: spacing.sm
  },
  guideLabel: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(16,49,63,0.8)',
    color: '#FFF9EE',
    fontSize: 11,
    fontWeight: '800'
  },
  guideLabelBottom: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(16,49,63,0.8)',
    color: '#FFF9EE',
    fontSize: 11,
    fontWeight: '800'
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm
  },
  loadingText: {
    fontSize: 14,
    color: colors.textMuted
  },
  helpText: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textMuted
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 18
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm
  },
  metric: {
    minWidth: 90,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    color: colors.textMuted
  },
  metricValue: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '800',
    color: colors.text
  }
});
