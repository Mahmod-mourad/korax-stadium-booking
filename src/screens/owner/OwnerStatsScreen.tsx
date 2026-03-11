import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../theme';
import { formatPrice } from '../../utils/helpers';
import { MOCK_BOOKINGS } from '../../utils/mockData';

const MONTHLY_DATA = [
  { month: 'أكتوبر', bookings: 24, revenue: 480 },
  { month: 'نوفمبر', bookings: 31, revenue: 620 },
  { month: 'ديسمبر', bookings: 28, revenue: 560 },
  { month: 'يناير', bookings: 35, revenue: 700 },
  { month: 'فبراير', bookings: 42, revenue: 840 },
  { month: 'مارس', bookings: 18, revenue: 360 },
];

const maxBookings = Math.max(...MONTHLY_DATA.map((m) => m.bookings));

export default function OwnerStatsScreen() {
  const totalRevenue = MONTHLY_DATA.reduce((sum, m) => sum + m.revenue, 0);
  const totalBookings = MONTHLY_DATA.reduce((sum, m) => sum + m.bookings, 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الإحصائيات 📊</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: Colors.primary }]}>
            <Text style={styles.summaryIcon}>💰</Text>
            <Text style={styles.summaryValue}>{formatPrice(totalRevenue)}</Text>
            <Text style={styles.summaryLabel}>إجمالي الأرباح</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: Colors.secondary }]}>
            <Text style={styles.summaryIcon}>📅</Text>
            <Text style={styles.summaryValue}>{totalBookings}</Text>
            <Text style={styles.summaryLabel}>إجمالي الحجوزات</Text>
          </View>
        </View>

        {/* Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الحجوزات الشهرية</Text>
          <View style={styles.chart}>
            {MONTHLY_DATA.map((item) => (
              <View key={item.month} style={styles.chartBar}>
                <Text style={styles.chartValue}>{item.bookings}</Text>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      { height: (item.bookings / maxBookings) * 120 },
                    ]}
                  />
                </View>
                <Text style={styles.chartLabel}>{item.month.slice(0, 3)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Monthly Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>تفاصيل الشهور</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>الأرباح</Text>
              <Text style={styles.tableHeaderCell}>الحجوزات</Text>
              <Text style={styles.tableHeaderCell}>الشهر</Text>
            </View>
            {[...MONTHLY_DATA].reverse().map((item) => (
              <View key={item.month} style={styles.tableRow}>
                <Text style={[styles.tableCell, { color: Colors.primary }]}>{formatPrice(item.revenue)}</Text>
                <Text style={styles.tableCell}>{item.bookings} حجز</Text>
                <Text style={[styles.tableCell, { fontWeight: '700' }]}>{item.month}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Rating */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>التقييمات</Text>
          <View style={styles.ratingCard}>
            <Text style={styles.ratingBig}>⭐ 4.5</Text>
            <Text style={styles.ratingDesc}>متوسط تقييم لاعبيك</Text>
            <View style={styles.ratingBars}>
              {[5, 4, 3, 2, 1].map((star) => {
                const widths = [60, 25, 10, 3, 2];
                return (
                  <View key={star} style={styles.ratingBarRow}>
                    <View style={styles.ratingBarBg}>
                      <View style={[styles.ratingBarFill, { width: `${widths[5 - star]}%` }]} />
                    </View>
                    <Text style={styles.ratingBarLabel}>{star} ⭐</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.lg,
    paddingTop: 52,
    paddingBottom: Spacing.md,
  },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.textLight, textAlign: 'right' },
  summaryRow: { flexDirection: 'row', padding: Spacing.lg, gap: Spacing.md },
  summaryCard: {
    flex: 1, borderRadius: Radius.xl, padding: Spacing.lg, alignItems: 'center', ...Shadow.card,
  },
  summaryIcon: { fontSize: 32, marginBottom: 8 },
  summaryValue: { fontSize: FontSize.xl, fontWeight: '900', color: '#fff' },
  summaryLabel: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)', marginTop: 4, textAlign: 'center' },
  section: { backgroundColor: Colors.surface, padding: Spacing.lg, marginBottom: Spacing.sm },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text, textAlign: 'right', marginBottom: Spacing.md },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 160, justifyContent: 'space-around' },
  chartBar: { alignItems: 'center', flex: 1, gap: 4 },
  chartValue: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.text },
  barWrapper: { width: '100%', alignItems: 'center', justifyContent: 'flex-end', height: 120 },
  bar: { width: '70%', backgroundColor: Colors.primary, borderRadius: 4, minHeight: 4 },
  chartLabel: { fontSize: FontSize.xs, color: Colors.textSecondary },
  table: { borderRadius: Radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  tableHeader: { flexDirection: 'row', backgroundColor: Colors.inputBg, padding: Spacing.sm },
  tableHeaderCell: { flex: 1, fontSize: FontSize.sm, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  tableRow: { flexDirection: 'row', padding: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border },
  tableCell: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center' },
  ratingCard: { alignItems: 'center' },
  ratingBig: { fontSize: 48, fontWeight: '900', marginBottom: 4 },
  ratingDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.lg },
  ratingBars: { width: '100%', gap: 8 },
  ratingBarRow: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'flex-end' },
  ratingBarBg: { flex: 1, height: 8, backgroundColor: Colors.inputBg, borderRadius: 4, overflow: 'hidden' },
  ratingBarFill: { height: '100%', backgroundColor: Colors.star, borderRadius: 4 },
  ratingBarLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, width: 32, textAlign: 'right' },
});
