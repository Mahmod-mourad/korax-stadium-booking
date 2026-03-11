/**
 * FeeBreakdown — تفصيل تكلفة الحجز
 *
 * يعرض:
 *  - سعر الملعب × عدد الساعات
 *  - رسوم KoraX (20 جنيه ثابتة)
 *  - المجموع الكلي
 *  - ملاحظة "الحجز غير قابل للإلغاء"
 *
 * يُستخدم في: BookingScreen
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '../../theme';
import { formatPrice } from '../../utils/helpers';

interface FeeBreakdownProps {
  stadiumPrice: number;   // سعر الملعب / ساعة
  durationHours: number;
  bookingFee: number;     // رسوم KoraX الثابتة = 20
  /** يظهر الـ disclaimer في الأسفل */
  showDisclaimer?: boolean;
}

export function FeeBreakdown({
  stadiumPrice,
  durationHours,
  bookingFee,
  showDisclaimer = true,
}: FeeBreakdownProps) {
  const stadiumCost = stadiumPrice * durationHours;
  const total = stadiumCost + bookingFee;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>💳 تفاصيل الحجز</Text>

      {/* سعر الملعب */}
      <View style={styles.row}>
        <Text style={styles.value}>{formatPrice(stadiumCost)}</Text>
        <Text style={styles.label}>
          سعر الملعب ({durationHours} ساعة × {formatPrice(stadiumPrice)})
        </Text>
      </View>

      {/* رسوم التطبيق */}
      <View style={styles.row}>
        <Text style={[styles.value, styles.feeValue]}>{formatPrice(bookingFee)}</Text>
        <Text style={styles.label}>رسوم التطبيق (KoraX)</Text>
      </View>

      {/* فاصل */}
      <View style={styles.divider} />

      {/* المجموع */}
      <View style={styles.row}>
        <Text style={styles.total}>{formatPrice(total)}</Text>
        <Text style={styles.totalLabel}>المجموع الكلي</Text>
      </View>

      {/* تحذير */}
      {showDisclaimer && (
        <Text style={styles.disclaimer}>⚠️ الحجز غير قابل للإلغاء بعد الدفع</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    gap: 10,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'right',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: { fontSize: FontSize.sm, color: Colors.textSecondary },
  value: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  feeValue: { color: Colors.bookingFee },
  divider: { height: 1, backgroundColor: Colors.border },
  total: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.primary },
  totalLabel: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  disclaimer: {
    fontSize: FontSize.xs,
    color: Colors.error,
    textAlign: 'right',
    marginTop: 4,
  },
});
