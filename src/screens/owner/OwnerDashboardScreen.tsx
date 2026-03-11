import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../theme';
import { useStore } from '../../store';
import { formatPrice, formatDate, getStatusColor, getStatusLabel } from '../../utils/helpers';
import { MOCK_BOOKINGS } from '../../utils/mockData';

const ownerBookings = MOCK_BOOKINGS;

export default function OwnerDashboardScreen({ navigation }: any) {
  const { user } = useStore();
  const todayBookings = ownerBookings.filter((b) => b.status !== 'cancelled').length;
  const totalRevenue = ownerBookings.reduce((sum, b) => sum + b.bookingFee, 0);
  const avgRating = 4.5;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>أهلاً، {user?.name?.split(' ')[0]} 👋</Text>
          <Text style={styles.subtitle}>لوحة تحكم صاحب الملعب</Text>
        </View>
        <View style={styles.ownerBadge}>
          <Text style={styles.ownerBadgeText}>🏟️ مالك</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: Colors.primary }]}>
            <Text style={styles.statIcon}>📅</Text>
            <Text style={styles.statValue}>{todayBookings}</Text>
            <Text style={styles.statLabel}>حجوزات اليوم</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FF6B35' }]}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={styles.statValue}>{formatPrice(totalRevenue)}</Text>
            <Text style={styles.statLabel}>رسوم التطبيق</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#2196F3' }]}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statValue}>{avgRating}</Text>
            <Text style={styles.statLabel}>متوسط التقييم</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#9C27B0' }]}>
            <Text style={styles.statIcon}>🏟️</Text>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>ملاعبي</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>إجراءات سريعة</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('AddStadium')}>
              <Text style={styles.actionIcon}>➕</Text>
              <Text style={styles.actionLabel}>إضافة ملعب</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('OwnerBookings')}>
              <Text style={styles.actionIcon}>📋</Text>
              <Text style={styles.actionLabel}>الحجوزات</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('OwnerStats')}>
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionLabel}>الإحصائيات</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('MyStadiums')}>
              <Text style={styles.actionIcon}>🏟️</Text>
              <Text style={styles.actionLabel}>ملاعبي</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Bookings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TouchableOpacity onPress={() => navigation.navigate('OwnerBookings')}>
              <Text style={styles.seeAll}>عرض الكل</Text>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>حجوزات اليوم</Text>
          </View>

          {ownerBookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(booking.status) }]} />
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingPlayer}>{booking.playerName}</Text>
                <Text style={styles.bookingTime}>
                  {booking.startTime} – {booking.endTime} | {formatDate(booking.date)}
                </Text>
              </View>
              <View>
                <Text style={[styles.bookingStatus, { color: getStatusColor(booking.status) }]}>
                  {getStatusLabel(booking.status)}
                </Text>
                <Text style={styles.bookingFee}>{formatPrice(booking.bookingFee)}</Text>
              </View>
            </View>
          ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 52,
    paddingBottom: Spacing.lg,
  },
  greeting: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.textLight },
  subtitle: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  ownerBadge: {
    backgroundColor: Colors.primary + '33',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  ownerBadgeText: { color: Colors.primary, fontWeight: '700', fontSize: FontSize.sm },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  statCard: {
    width: '47%',
    borderRadius: Radius.xl,
    padding: Spacing.md,
    alignItems: 'flex-end',
    ...Shadow.card,
  },
  statIcon: { fontSize: 28, marginBottom: 8 },
  statValue: { fontSize: FontSize.xl, fontWeight: '900', color: '#fff', textAlign: 'right' },
  statLabel: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.8)', marginTop: 2, textAlign: 'right' },
  section: { padding: Spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text },
  seeAll: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: '600' },
  actionsRow: { flexDirection: 'row', gap: Spacing.sm },
  actionBtn: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadow.card,
  },
  actionIcon: { fontSize: 24, marginBottom: 6 },
  actionLabel: { fontSize: FontSize.xs, color: Colors.text, fontWeight: '600', textAlign: 'center' },
  bookingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.card,
    gap: Spacing.sm,
  },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  bookingInfo: { flex: 1, alignItems: 'flex-end' },
  bookingPlayer: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  bookingTime: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  bookingStatus: { fontSize: FontSize.sm, fontWeight: '700', textAlign: 'right' },
  bookingFee: { fontSize: FontSize.xs, color: Colors.bookingFee, fontWeight: '600', textAlign: 'right' },
});
