import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, StatusBar,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../theme';
import { useStore } from '../../store';
import { formatPrice, formatDate, formatTime } from '../../utils/helpers';

export default function BookingConfirmationScreen({ navigation, route }: any) {
  const { bookingId } = route.params;
  const { bookings } = useStore();
  const booking = bookings.find((b) => b.id === bookingId);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 6, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  if (!booking) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />

      <Animated.View style={[styles.content, { opacity: opacityAnim }]}>

        {/* Success Icon */}
        <Animated.View style={[styles.successCircle, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.successIcon}>✅</Text>
        </Animated.View>

        <Text style={styles.title}>تم الحجز بنجاح! 🎉</Text>
        <Text style={styles.subtitle}>استمتع بوقتك في الملعب</Text>

        {/* Booking Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>تفاصيل الحجز</Text>
            <View style={styles.confirmedBadge}>
              <Text style={styles.confirmedBadgeText}>مؤكد ✓</Text>
            </View>
          </View>

          <View style={styles.detail}>
            <Text style={styles.detailValue}>{booking.stadiumName}</Text>
            <Text style={styles.detailLabel}>🏟️ الملعب</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detail}>
            <Text style={styles.detailValue}>{formatDate(booking.date)}</Text>
            <Text style={styles.detailLabel}>📅 التاريخ</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detail}>
            <Text style={styles.detailValue}>
              {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
            </Text>
            <Text style={styles.detailLabel}>⏰ الوقت</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detail}>
            <Text style={styles.detailValue}>{booking.durationHours} ساعة</Text>
            <Text style={styles.detailLabel}>⌛ المدة</Text>
          </View>

          <View style={styles.divider} />

          {/* Payment */}
          <View style={styles.paymentSection}>
            <Text style={styles.paymentTitle}>💳 الدفع</Text>
            <View style={styles.payRow}>
              <Text style={styles.payValue}>{formatPrice(booking.stadiumPrice * booking.durationHours)}</Text>
              <Text style={styles.payLabel}>سعر الملعب</Text>
            </View>
            <View style={styles.payRow}>
              <Text style={[styles.payValue, { color: Colors.bookingFee }]}>{formatPrice(booking.bookingFee)}</Text>
              <Text style={styles.payLabel}>رسوم KoraX</Text>
            </View>
            <View style={styles.payDivider} />
            <View style={styles.payRow}>
              <Text style={styles.totalValue}>{formatPrice(booking.totalAmount)}</Text>
              <Text style={styles.totalLabel}>المجموع الكلي</Text>
            </View>
          </View>
        </View>

        {/* Booking ID */}
        <Text style={styles.bookingId}>رقم الحجز: #{booking.id.slice(-6).toUpperCase()}</Text>

        {/* Buttons */}
        <View style={styles.btns}>
          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => navigation.navigate('PlayerTabs')}
          >
            <Text style={styles.homeBtnText}>العودة للرئيسية 🏠</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.historyBtn}
            onPress={() => navigation.navigate('BookingHistory')}
          >
            <Text style={styles.historyBtnText}>حجوزاتي</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.secondary },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.lg,
    paddingTop: 60,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0,200,83,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  successIcon: { fontSize: 60 },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '900',
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    width: '100%',
    ...Shadow.card,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardHeaderText: { fontSize: FontSize.md, fontWeight: '800', color: Colors.text },
  confirmedBadge: {
    backgroundColor: Colors.primary + '22',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  confirmedBadgeText: { color: Colors.primary, fontSize: FontSize.xs, fontWeight: '700' },
  detail: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  detailLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  detailValue: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text, textAlign: 'right', flex: 1, marginLeft: 10 },
  divider: { height: 1, backgroundColor: Colors.border },
  paymentSection: {
    marginTop: Spacing.md,
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  paymentTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text, textAlign: 'right', marginBottom: 10 },
  payRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  payLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  payValue: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text },
  payDivider: { height: 1, backgroundColor: Colors.border, marginVertical: 8 },
  totalLabel: { fontSize: FontSize.md, fontWeight: '800', color: Colors.text },
  totalValue: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.primary },
  bookingId: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: Spacing.lg,
  },
  btns: { width: '100%', gap: Spacing.sm },
  homeBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 16,
    alignItems: 'center',
  },
  homeBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: '800' },
  historyBtn: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.full,
    paddingVertical: 14,
    alignItems: 'center',
  },
  historyBtnText: { color: 'rgba(255,255,255,0.7)', fontSize: FontSize.md, fontWeight: '600' },
});
