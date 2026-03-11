/**
 * AmenityChip — شريحة ميزة الملعب
 * مثال: "إضاءة ليلية 💡"
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Radius } from '../../theme';

const AMENITY_ICONS: Record<string, string> = {
  'إضاءة ليلية':       '💡',
  'غرف تغيير ملابس':   '🚿',
  'كافيتيريا':         '☕',
  'مواقف سيارات':      '🚗',
  'دش':               '🚿',
  'مدرج':             '🏟️',
  'wifi':             '📶',
  'أمن':              '🔒',
};

interface AmenityChipProps {
  label: string;
}

export function AmenityChip({ label }: AmenityChipProps) {
  const icon = AMENITY_ICONS[label] ?? '✓';
  return (
    <View style={styles.chip}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.inputBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  icon: { fontSize: 14 },
  label: { fontSize: FontSize.sm, color: Colors.text, fontWeight: '600' },
});
