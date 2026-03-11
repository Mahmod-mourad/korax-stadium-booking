/**
 * BookingCard — كارد الحجز
 *
 * يُستخدم في:
 *  - BookingHistoryScreen (اللاعب)
 *  - OwnerBookingsScreen (المالك)
 *  - ProfileScreen (آخر الحجوزات)
 *
 * يعرض: صورة الملعب، الاسم، التاريخ، الوقت، الحالة، المبلغ
 * + زر تقييم إذا كان الحجز مكتملاً وغير مُقيَّم
 */
import React from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
} from 'react-native';
import { Booking } from '../../types';
import { Colors, FontSize, Radius, Shadow, Spacing } from '../../theme';
import { formatDate, formatTime, formatPrice, getStatusColor, getStatusLabel } from '../../utils/helpers';

interface BookingCardProps {
  booking: Booking;
  onPress?: () => void;
  onRate?: () => void;     // ظاهر فقط إذا status = 'completed' وغير مُقيَّم
  hasRated?: boolean;
  /** إخفاء السعر (مثلاً في لوحة المالك) */
  showPrice?: boolean;
}

export function BookingCard({
  booking,
  onPress,
  onRate,
  hasRated = false,
  showPrice = true,
}: BookingCardProps) {
  const statusColor = getStatusColor(booking.status);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.88}
    >
      {/* ── صورة + معلومات ─────────────── */}
      <View style={styles.top}>
        {booking.stadiumPhoto ? (
          <Image source={{ uri: booking.stadiumPhoto }} style={styles.photo} />
        ) : (
          <View style={[styles.photo, styles.photoPlaceholder]}>
            <Text style={styles.photoPlaceholderText}>🏟️</Text>
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.stadiumName} numberOfLines={1}>{booking.stadiumName}</Text>
          <Text style={styles.date}>{formatDate(booking.date)}</Text>
          <Text style={styles.time}>
            {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
            {'  '}·{'  '}{booking.durationHours} ساعة
          </Text>
        </View>

        {/* الحالة */}
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '22' }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {getStatusLabel(booking.status)}
          </Text>
        </View>
      </View>

      {/* ── footer: السعر + تقييم ─────── */}
      <View style={styles.footer}>
        {showPrice
          ? <Text style={styles.total}>{formatPrice(booking.totalAmount)}</Text>
          : <View />
        }

        {booking.status === 'completed' && onRate && !hasRated && (
          <TouchableOpacity style={styles.rateBtn} onPress={onRate}>
            <Text style={styles.rateBtnText}>⭐ قيّم الملعب</Text>
          </TouchableOpacity>
        )}
        {booking.status === 'completed' && hasRated && (
          <Text style={styles.ratedText}>✓ تم التقييم</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadow.card,
  },
  top: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.sm,
    alignItems: 'center',
  },
  photo: { width: 72, height: 72, borderRadius: Radius.md },
  photoPlaceholder: {
    backgroundColor: Colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderText: { fontSize: 30 },

  info: { flex: 1, alignItems: 'flex-end' },
  stadiumName: { fontSize: FontSize.md, fontWeight: '800', color: Colors.text, textAlign: 'right' },
  date: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 4, textAlign: 'right' },
  time: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2, textAlign: 'right' },

  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  statusText: { fontSize: FontSize.xs, fontWeight: '700' },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.inputBg,
  },
  total: { fontSize: FontSize.md, fontWeight: '900', color: Colors.primary },
  rateBtn: {
    backgroundColor: Colors.star + '22',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.star,
  },
  rateBtnText: { color: Colors.star, fontSize: FontSize.sm, fontWeight: '700' },
  ratedText: { fontSize: FontSize.xs, color: Colors.success, fontWeight: '700' },
});
