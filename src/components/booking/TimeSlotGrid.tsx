/**
 * TimeSlotGrid — شبكة اختيار الوقت
 *
 * يعرض كل الـ slots المتاحة للملعب في يوم معين
 * ويُلوّن المحجوزة بلون مختلف
 *
 * يُستخدم في: BookingScreen
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontSize, Radius } from '../../theme';
import { formatTime } from '../../utils/helpers';

interface TimeSlotGridProps {
  slots: string[];          // كل الـ slots (e.g. ['08:00','09:00',...])
  bookedSlots: string[];    // المحجوزة بالفعل
  selectedSlots: string[];  // المختارة من المستخدم الحالي
  onToggle: (slot: string) => void;
}

export function TimeSlotGrid({
  slots,
  bookedSlots,
  selectedSlots,
  onToggle,
}: TimeSlotGridProps) {
  return (
    <View style={styles.grid}>
      {slots.map((slot) => {
        const isBooked   = bookedSlots.includes(slot);
        const isSelected = selectedSlots.includes(slot);

        return (
          <TouchableOpacity
            key={slot}
            style={[
              styles.slot,
              isBooked   && styles.slotBooked,
              isSelected && styles.slotSelected,
            ]}
            onPress={() => onToggle(slot)}
            disabled={isBooked}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.slotText,
              isBooked   && styles.slotTextBooked,
              isSelected && styles.slotTextSelected,
            ]}>
              {formatTime(slot)}
            </Text>
            {isBooked && <Text style={styles.bookedLabel}>محجوز</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-end',
  },
  slot: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: Radius.md,
    backgroundColor: Colors.inputBg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    minWidth: 72,
  },
  slotBooked: {
    backgroundColor: '#f5f5f5',
    borderColor: Colors.border,
    opacity: 0.5,
  },
  slotSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  slotText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  slotTextBooked: {
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  slotTextSelected: { color: '#fff' },
  bookedLabel: {
    fontSize: 9,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
