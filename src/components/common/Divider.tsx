/**
 * Divider — فاصل أفقي أو رأسي
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../../theme';

interface DividerProps {
  direction?: 'horizontal' | 'vertical';
  marginV?: number;
  marginH?: number;
  color?: string;
}

export function Divider({
  direction = 'horizontal',
  marginV = Spacing.sm,
  marginH = 0,
  color = Colors.border,
}: DividerProps) {
  if (direction === 'vertical') {
    return (
      <View style={[
        styles.vertical,
        { marginHorizontal: marginH, backgroundColor: color },
      ]} />
    );
  }
  return (
    <View style={[
      styles.horizontal,
      { marginVertical: marginV, marginHorizontal: marginH, backgroundColor: color },
    ]} />
  );
}

const styles = StyleSheet.create({
  horizontal: { height: 1, width: '100%' },
  vertical:   { width: 1, height: '100%' },
});
