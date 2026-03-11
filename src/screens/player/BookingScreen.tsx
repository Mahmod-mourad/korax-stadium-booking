import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../theme';
import { useStore } from '../../store';
import { formatPrice, formatDate, formatTime, calculateBookingTotal, getTimeEndSlot, BOOKING_FEE } from '../../utils/helpers';
import { TIME_SLOTS, BOOKED_SLOTS } from '../../utils/mockData';
import { Booking } from '../../types';

function getDates(count = 14): string[] {
  const dates: string[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

function formatShortDate(dateStr: string): { day: string; weekday: string } {
  const d = new Date(dateStr);
  return {
    day: String(d.getDate()),
    weekday: d.toLocaleDateString('ar-EG', { weekday: 'short' }),
  };
}

export default function BookingScreen({ navigation, route }: any) {
  const { stadiumId } = route.params;
  const { stadiums, user, addBooking } = useStore();
  const stadium = stadiums.find((s) => s.id === stadiumId);

  const [selectedDate, setSelectedDate] = useState(getDates()[0]);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const dates = getDates();
  const bookedForDay = BOOKED_SLOTS[selectedDate] || [];

  const toggleSlot = (slot: string) => {
    if (bookedForDay.includes(slot)) return;
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot].sort()
    );
  };

  const durationHours = selectedSlots.length;
  const { stadiumCost, bookingFee, total } = calculateBookingTotal(
    stadium?.pricePerHour ?? 0,
    durationHours
  );

  const handleBook = () => {
    if (selectedSlots.length === 0) {
      Alert.alert('تنبيه', 'اختار ساعة حجز واحدة على الأقل');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const booking: Booking = {
        id: 'b_' + Date.now(),
        stadiumId: stadiumId,
        stadiumName: stadium!.name,
        stadiumPhoto: stadium!.photos[0],
        playerId: user!.id,
        playerName: user!.name,
        date: selectedDate,
        startTime: selectedSlots[0],
        endTime: getTimeEndSlot(selectedSlots[selectedSlots.length - 1], 1),
        durationHours,
        stadiumPrice: stadium!.pricePerHour,
        bookingFee: BOOKING_FEE,
        totalAmount: total,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };
      addBooking(booking);
      setLoading(false);
      navigation.replace('BookingConfirmation', { bookingId: booking.id });
    }, 1500);
  };

  if (!stadium) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>احجز ملعبك</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Stadium Mini Card */}
        <View style={styles.stadiumMini}>
          <Text style={styles.stadiumMiniName}>{stadium.name}</Text>
          <Text style={styles.stadiumMiniLocation}>📍 {stadium.location}</Text>
          <Text style={styles.stadiumMiniPrice}>{formatPrice(stadium.pricePerHour)}/ساعة</Text>
        </View>

        {/* Date Picker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>اختار يوم 📅</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datesRow}>
            {dates.map((date) => {
              const { day, weekday } = formatShortDate(date);
              const isSelected = date === selectedDate;
              return (
                <TouchableOpacity
                  key={date}
                  style={[styles.dateChip, isSelected && styles.dateChipActive]}
                  onPress={() => {
                    setSelectedDate(date);
                    setSelectedSlots([]);
                  }}
                >
                  <Text style={[styles.dateWeekday, isSelected && styles.dateTextActive]}>{weekday}</Text>
                  <Text style={[styles.dateDay, isSelected && styles.dateTextActive]}>{day}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Time Slots */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>اختار وقت ⏰</Text>
          <Text style={styles.sectionHint}>يمكنك اختيار أكثر من ساعة</Text>
          <View style={styles.slotsGrid}>
            {TIME_SLOTS.map((slot) => {
              const isBooked = bookedForDay.includes(slot);
              const isSelected = selectedSlots.includes(slot);
              return (
                <TouchableOpacity
                  key={slot}
                  style={[
                    styles.slotChip,
                    isBooked && styles.slotBooked,
                    isSelected && styles.slotSelected,
                  ]}
                  onPress={() => toggleSlot(slot)}
                  disabled={isBooked}
                >
                  <Text style={[
                    styles.slotText,
                    isBooked && styles.slotTextBooked,
                    isSelected && styles.slotTextSelected,
                  ]}>
                    {formatTime(slot)}
                  </Text>
                  {isBooked && <Text style={styles.slotBadge}>محجوز</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Fee Breakdown */}
        {durationHours > 0 && (
          <View style={styles.feeCard}>
            <Text style={styles.feeTitle}>تفاصيل الحجز 💳</Text>
            <View style={styles.feeRow}>
              <Text style={styles.feeValue}>{formatPrice(stadiumCost)}</Text>
              <Text style={styles.feeLabel}>سعر الملعب ({durationHours} ساعة × {formatPrice(stadium.pricePerHour)})</Text>
            </View>
            <View style={styles.feeRow}>
              <Text style={[styles.feeValue, { color: Colors.bookingFee }]}>{formatPrice(bookingFee)}</Text>
              <Text style={styles.feeLabel}>رسوم التطبيق (KoraX)</Text>
            </View>
            <View style={styles.feeDivider} />
            <View style={styles.feeRow}>
              <Text style={styles.feeTotal}>{formatPrice(total)}</Text>
              <Text style={styles.feeTotalLabel}>المجموع</Text>
            </View>
            <Text style={styles.feeNote}>⚠️ الحجز غير قابل للإلغاء بعد الدفع</Text>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.bottomBar}>
        {durationHours > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>
              {formatDate(selectedDate)} • {selectedSlots.length} ساعة
            </Text>
            <Text style={styles.summaryTotal}>{formatPrice(total)}</Text>
          </View>
        )}
        <TouchableOpacity
          style={[styles.confirmBtn, (loading || durationHours === 0) && styles.confirmBtnDisabled]}
          onPress={handleBook}
          disabled={loading || durationHours === 0}
        >
          <Text style={styles.confirmBtnText}>
            {loading ? 'جاري الحجز...' : durationHours === 0 ? 'اختار وقت الحجز' : `تأكيد الحجز ✓`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: 52,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
    ...Shadow.header,
  },
  back: { color: Colors.primary, fontSize: FontSize.md, fontWeight: '600' },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text },
  stadiumMini: {
    backgroundColor: Colors.secondary,
    padding: Spacing.lg,
    alignItems: 'flex-end',
  },
  stadiumMiniName: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.textLight },
  stadiumMiniLocation: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  stadiumMiniPrice: { fontSize: FontSize.md, color: Colors.primary, fontWeight: '700', marginTop: 4 },
  section: { backgroundColor: Colors.surface, padding: Spacing.lg, marginTop: Spacing.sm },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text, textAlign: 'right', marginBottom: 4 },
  sectionHint: { fontSize: FontSize.xs, color: Colors.textSecondary, textAlign: 'right', marginBottom: Spacing.md },
  datesRow: { gap: 10, paddingVertical: 4 },
  dateChip: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: Radius.md,
    backgroundColor: Colors.inputBg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    minWidth: 56,
  },
  dateChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dateWeekday: { fontSize: FontSize.xs, color: Colors.textSecondary, marginBottom: 2 },
  dateDay: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text },
  dateTextActive: { color: '#fff' },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-end',
  },
  slotChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: Radius.md,
    backgroundColor: Colors.inputBg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  slotBooked: { backgroundColor: '#f5f5f5', borderColor: Colors.border, opacity: 0.5 },
  slotSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  slotText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text },
  slotTextBooked: { color: Colors.textSecondary, textDecorationLine: 'line-through' },
  slotTextSelected: { color: '#fff' },
  slotBadge: { fontSize: 9, color: Colors.textSecondary, marginTop: 2 },
  feeCard: {
    backgroundColor: Colors.surface,
    margin: Spacing.lg,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadow.card,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  feeTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text, textAlign: 'right', marginBottom: Spacing.md },
  feeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  feeLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  feeValue: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  feeDivider: { height: 1, backgroundColor: Colors.border, marginVertical: 10 },
  feeTotal: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.primary },
  feeTotalLabel: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  feeNote: { fontSize: FontSize.xs, color: Colors.error, textAlign: 'right', marginTop: 8 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 10,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  summaryTotal: { fontSize: FontSize.md, fontWeight: '800', color: Colors.primary },
  confirmBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmBtnDisabled: { opacity: 0.5 },
  confirmBtnText: { color: '#fff', fontSize: FontSize.lg, fontWeight: '800' },
});
