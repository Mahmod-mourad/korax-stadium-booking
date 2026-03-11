import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../theme';
import { MOCK_BOOKINGS } from '../../utils/mockData';
import { formatDate, formatTime, formatPrice, getStatusColor, getStatusLabel } from '../../utils/helpers';
import { Booking } from '../../types';

const FILTERS = ['الكل', 'مؤكد', 'مكتمل', 'ملغى'];
const FILTER_MAP: Record<string, string> = {
  'الكل': 'all', 'مؤكد': 'confirmed', 'مكتمل': 'completed', 'ملغى': 'cancelled',
};

export default function OwnerBookingsScreen({ navigation }: any) {
  const [activeFilter, setActiveFilter] = useState('الكل');
  const allBookings = MOCK_BOOKINGS;
  const filtered = allBookings.filter(
    (b) => activeFilter === 'الكل' || b.status === FILTER_MAP[activeFilter]
  );

  const renderItem = ({ item }: { item: Booking }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.playerAvatar}>
          <Text style={styles.playerAvatarText}>{item.playerName.charAt(0)}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.playerName}>{item.playerName}</Text>
          <Text style={styles.phone}>📱 {item.playerId.slice(0, 11)}</Text>
          <Text style={styles.stadium}>🏟️ {item.stadiumName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '22' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.cardBottom}>
        <View style={styles.detailChip}>
          <Text style={styles.detailText}>📅 {item.date}</Text>
        </View>
        <View style={styles.detailChip}>
          <Text style={styles.detailText}>⏰ {item.startTime}–{item.endTime}</Text>
        </View>
        <View style={[styles.detailChip, { backgroundColor: Colors.bookingFee + '22' }]}>
          <Text style={[styles.detailText, { color: Colors.bookingFee, fontWeight: '700' }]}>
            رسوم: {formatPrice(item.bookingFee)}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الحجوزات</Text>
      </View>

      <View style={styles.filtersRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>مافيش حجوزات</Text>
          </View>
        }
      />
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
  filtersRow: {
    flexDirection: 'row',
    padding: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: 8,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterChip: {
    paddingVertical: 6, paddingHorizontal: 14,
    borderRadius: Radius.full, borderWidth: 1.5, borderColor: Colors.border,
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  list: { padding: Spacing.lg, gap: Spacing.md },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.xl, overflow: 'hidden', ...Shadow.card },
  cardTop: { flexDirection: 'row', padding: Spacing.md, gap: Spacing.sm, alignItems: 'flex-start' },
  playerAvatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  playerAvatarText: { fontSize: FontSize.xl, fontWeight: '900', color: '#fff' },
  info: { flex: 1, alignItems: 'flex-end' },
  playerName: { fontSize: FontSize.md, fontWeight: '800', color: Colors.text },
  phone: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  stadium: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, alignSelf: 'flex-start' },
  statusText: { fontSize: FontSize.xs, fontWeight: '700' },
  cardBottom: {
    flexDirection: 'row',
    padding: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.inputBg,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  detailChip: { backgroundColor: Colors.border + '66', paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.sm },
  detailText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  empty: { alignItems: 'center', paddingVertical: 64 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: FontSize.md, color: Colors.textSecondary },
});
