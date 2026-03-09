import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme';

interface ConfidenceBadgeProps {
  label: string;
  tone: 'high' | 'medium' | 'low';
}

export function ConfidenceBadge({ label, tone }: ConfidenceBadgeProps) {
  return (
    <View
      style={[
        styles.badge,
        tone === 'high' && styles.high,
        tone === 'medium' && styles.medium,
        tone === 'low' && styles.low
      ]}
    >
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999
  },
  high: {
    backgroundColor: '#DCEEDF'
  },
  medium: {
    backgroundColor: '#F9E8C1'
  },
  low: {
    backgroundColor: '#F8DDD8'
  },
  text: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text
  }
});
