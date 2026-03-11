/**
 * StarsRating — عرض أو إدخال تقييم بالنجوم
 *
 * mode:
 *   display   → عرض فقط (لا تفاعل)
 *   input     → الضغط يغيّر التقييم
 *
 * size: sm | md | lg
 */
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme';

interface StarsRatingProps {
  value: number;           // 0-5 (يدعم الكسور للعرض)
  onChange?: (v: number) => void;
  mode?: 'display' | 'input';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;     // يعرض الرقم بجانب النجوم
  count?: number;          // عدد الإجمالي للعرض
}

const SIZES = { sm: 16, md: 22, lg: 30 };

export function StarsRating({
  value,
  onChange,
  mode = 'display',
  size = 'md',
  showValue = false,
  count,
}: StarsRatingProps) {
  const starSize = SIZES[size];

  const renderStar = (index: number) => {
    // 1 = ممتلئ، 0.5 = نصف، 0 = فارغ
    const diff = value - index;
    const filled = diff >= 1 ? '★' : diff >= 0.5 ? '⯨' : '☆';
    const color  = diff >= 0.5 ? Colors.star : Colors.border;

    if (mode === 'input') {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => onChange?.(index + 1)}
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        >
          <Text style={[styles.star, { fontSize: starSize, color }]}>{filled}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <Text key={index} style={[styles.star, { fontSize: starSize, color }]}>{filled}</Text>
    );
  };

  return (
    <View style={styles.row}>
      {[0, 1, 2, 3, 4].map(renderStar)}
      {showValue && (
        <Text style={[styles.valueText, { fontSize: starSize * 0.7 }]}>
          {' '}{value.toFixed(1)}{count ? ` (${count})` : ''}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  star: { fontWeight: '400' },
  valueText: { color: Colors.textSecondary, fontWeight: '600', marginLeft: 4 },
});
