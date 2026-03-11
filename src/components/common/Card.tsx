/**
 * Card — حاوية بيضاء مع ظل
 *
 * الـ variant:
 *   default  → بيضاء عادية
 *   elevated → ظل أقوى
 *   outlined → بدون ظل، بحافة
 *   colored  → خلفية اللون المُمرَّر
 */
import React from 'react';
import {
  View, StyleSheet, TouchableOpacity, StyleProp, ViewStyle,
} from 'react-native';
import { Colors, Radius, Shadow, Spacing } from '../../theme';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'colored';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  color?: string;       // يُستخدم مع variant='colored'
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  padding?: number;
}

export function Card({
  children,
  variant = 'default',
  color,
  onPress,
  style,
  padding = Spacing.md,
}: CardProps) {
  const containerStyle = [
    styles.base,
    styles[variant],
    color && variant === 'colored' ? { backgroundColor: color } : null,
    { padding },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={onPress}
        activeOpacity={0.85}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
  },
  default: {
    ...Shadow.card,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 8,
  },
  outlined: {
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  colored: {
    ...Shadow.card,
  },
});
