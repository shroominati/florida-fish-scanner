import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../theme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
}

export function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false
}: PrimaryButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        variant === 'danger' && styles.danger,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === 'primary' && styles.primaryLabel,
          variant === 'ghost' && styles.ghostLabel
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function ButtonRow({ children }: { children: ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    borderWidth: 1
  },
  primary: {
    backgroundColor: colors.accent,
    borderColor: colors.accentDark
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.navy
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: colors.border
  },
  danger: {
    backgroundColor: '#F8DDD8',
    borderColor: colors.danger
  },
  pressed: {
    opacity: 0.86
  },
  disabled: {
    opacity: 0.5
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text
  },
  primaryLabel: {
    color: '#FFFDF8'
  },
  ghostLabel: {
    color: colors.textMuted
  },
  row: {
    gap: spacing.sm
  }
});
