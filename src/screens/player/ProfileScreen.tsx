import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../theme';
import { useStore } from '../../store';
import { getStatusColor, getStatusLabel, formatDate, formatPrice } from '../../utils/helpers';
import { useHeaderTop } from '../../utils/responsive';

function MenuItem({ icon, label, onPress, color }: any) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuArrow}>›</Text>
      <Text style={[styles.menuLabel, color && { color }]}>{label}</Text>
      <Text style={styles.menuIcon}>{icon}</Text>
    </TouchableOpacity>
  );
}

export default function ProfileScreen({ navigation }: any) {
  const { user, bookings, logout } = useStore();
  const headerTop = useHeaderTop();
  const myBookings = bookings.filter((b) => b.playerId === user?.id).slice(0, 3);
  const totalSpent = bookings
    .filter((b) => b.playerId === user?.id && b.status === 'completed')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const handleLogout = () => {
    Alert.alert('تسجيل الخروج', 'هل أنت متأكد؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'خروج', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: headerTop }]}>
        <Text style={styles.headerTitle}>حسابي</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0) ?? '?'}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.phone}>📱 {user?.phone}</Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{bookings.length}</Text>
              <Text style={styles.statLabel}>حجز</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{formatPrice(totalSpent)}</Text>
              <Text style={styles.statLabel}>إجمالي الإنفاق</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>⭐ 4.8</Text>
              <Text style={styles.statLabel}>تقييمي</Text>
            </View>
          </View>
        </View>

        {/* Recent Bookings */}
        {myBookings.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TouchableOpacity onPress={() => navigation.navigate('BookingHistory')}>
                <Text style={styles.seeAll}>عرض الكل</Text>
              </TouchableOpacity>
              <Text style={styles.sectionTitle}>آخر الحجوزات</Text>
            </View>
            {myBookings.map((booking) => (
              <View key={booking.id} style={styles.bookingCard}>
                <View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '22' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                      {getStatusLabel(booking.status)}
                    </Text>
                  </View>
                </View>
                <View style={styles.bookingInfo}>
                  <Text style={styles.bookingName}>{booking.stadiumName}</Text>
                  <Text style={styles.bookingDate}>{formatDate(booking.date)}</Text>
                  <Text style={styles.bookingTotal}>{formatPrice(booking.totalAmount)}</Text>
                </View>
                <Text style={styles.bookingIcon}>🏟️</Text>
              </View>
            ))}
          </View>
        )}

        {/* Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الإعدادات</Text>
          <View style={styles.menuCard}>
            <MenuItem icon="📅" label="حجوزاتي" onPress={() => navigation.navigate('BookingHistory')} />
            <View style={styles.menuDivider} />
            <MenuItem icon="📝" label="تعديل الملف الشخصي" onPress={() => navigation.navigate('EditProfile')} />
            <View style={styles.menuDivider} />
            <MenuItem icon="🔔" label="الإشعارات" onPress={() => navigation.navigate('Notifications')} />
            <View style={styles.menuDivider} />
            <MenuItem icon="❓" label="المساعدة والدعم" onPress={() => navigation.navigate('HelpSupport')} />
            <View style={styles.menuDivider} />
            <MenuItem icon="🚪" label="تسجيل الخروج" onPress={handleLogout} color={Colors.error} />
          </View>
        </View>

        <Text style={styles.version}>KoraX v1.0.0</Text>
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
    // paddingTop يُحدَّد ديناميكياً من useHeaderTop()
    paddingBottom: Spacing.md,
  },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.textLight, textAlign: 'right' },
  profileCard: {
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatarText: { fontSize: 40, fontWeight: '900', color: '#fff' },
  name: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.textLight, marginBottom: 4 },
  phone: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.6)', marginBottom: Spacing.lg },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: Radius.xl,
    padding: Spacing.md,
    width: '100%',
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FontSize.md, fontWeight: '900', color: Colors.textLight, marginBottom: 2 },
  statLabel: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.5)' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
  section: { padding: Spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text },
  seeAll: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: '600' },
  bookingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.card,
  },
  bookingIcon: { fontSize: 28, marginLeft: 8 },
  bookingInfo: { flex: 1, marginRight: 8, alignItems: 'flex-end' },
  bookingName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text, textAlign: 'right' },
  bookingDate: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2, textAlign: 'right' },
  bookingTotal: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '700', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  statusText: { fontSize: FontSize.xs, fontWeight: '700' },
  menuCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadow.card,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 16,
  },
  menuIcon: { fontSize: 22, marginRight: 8 },
  menuLabel: { flex: 1, fontSize: FontSize.md, color: Colors.text, textAlign: 'right', fontWeight: '500' },
  menuArrow: { color: Colors.textSecondary, fontSize: 20 },
  menuDivider: { height: 1, backgroundColor: Colors.border, marginHorizontal: Spacing.lg },
  version: { textAlign: 'center', color: Colors.textSecondary, fontSize: FontSize.xs },
});
