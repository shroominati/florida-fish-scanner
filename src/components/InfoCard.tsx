import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../theme';

interface InfoCardProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function InfoCard({ title, subtitle, children }: InfoCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted
  }
});
