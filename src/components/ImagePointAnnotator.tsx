import { useState } from 'react';
import {
  Image,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent
} from 'react-native';

import { colors, spacing } from '../theme';
import type { Point2D } from '../types/domain';

export type AnnotationKey = 'nose' | 'tail' | 'referenceStart' | 'referenceEnd';

interface ImagePointAnnotatorProps {
  photoUri?: string;
  activeKey: AnnotationKey;
  points: Partial<Record<AnnotationKey, Point2D>>;
  onPointSet: (key: AnnotationKey, point: Point2D) => void;
}

const markerMeta: Record<AnnotationKey, { label: string; color: string }> = {
  nose: { label: 'Nose', color: '#E0722C' },
  tail: { label: 'Tail', color: '#1C7C54' },
  referenceStart: { label: 'Ref A', color: '#143C5A' },
  referenceEnd: { label: 'Ref B', color: '#B8860B' }
};

export function ImagePointAnnotator({
  photoUri,
  activeKey,
  points,
  onPointSet
}: ImagePointAnnotatorProps) {
  const [layout, setLayout] = useState({ width: 1, height: 1 });

  const onLayout = (event: LayoutChangeEvent) => {
    setLayout({
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height
    });
  };

  const onPress = (event: GestureResponderEvent) => {
    const point = {
      x: Number((event.nativeEvent.locationX / layout.width).toFixed(4)),
      y: Number((event.nativeEvent.locationY / layout.height).toFixed(4))
    };

    onPointSet(activeKey, point);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.title}>Tap to place: {markerMeta[activeKey].label}</Text>
        <Text style={styles.subtitle}>
          Place nose and tail on the fish body, then two points on the visible card or known reference.
        </Text>
      </View>

      <Pressable style={styles.canvas} onPress={onPress} onLayout={onLayout}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>No captured image available for measurement.</Text>
          </View>
        )}

        {Object.entries(points).map(([key, point]) => {
          if (!point) {
            return null;
          }

          const meta = markerMeta[key as AnnotationKey];
          return (
            <View
              key={key}
              style={[
                styles.marker,
                {
                  left: point.x * layout.width - 12,
                  top: point.y * layout.height - 12,
                  backgroundColor: meta.color
                }
              ]}
            >
              <Text style={styles.markerLabel}>{meta.label}</Text>
            </View>
          );
        })}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm
  },
  header: {
    gap: spacing.xs
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted
  },
  canvas: {
    minHeight: 280,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#DCE6E8'
  },
  image: {
    width: '100%',
    height: 320
  },
  placeholder: {
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg
  },
  placeholderText: {
    color: colors.textMuted,
    textAlign: 'center'
  },
  marker: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  markerLabel: {
    position: 'absolute',
    top: 26,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: '#FFF9EE',
    color: colors.text,
    fontSize: 10,
    fontWeight: '800'
  }
});
