import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  StatusBar, Image,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../theme';
import { useStore } from '../../store';
import { Booking } from '../../types';
import { formatDate, formatTime, formatPrice, getStatusColor, getStatusLabel } from '../../utils/helpers';

const FILTERS = ['الكل', 'مؤكد', 'مكتمل', 'ملغى'];
const FILTER_MAP: Record<string, string> = {
  'الكل': 'all', 'مؤكد': 'confirmed', 'مكتمل': 'completed', 'ملغى': 'cancelled',
};

export default function BookingHistoryScreen({ navigation }: any) {
  const { bookings, user } = useStore();
  const [activeFilter, setActiveFilter] = useState('الكل');

  const filtered = bookings
    .filter((b) => b.playerId === user?.id)
    .filter((b) => activeFilter === 'الكل' || b.status === FILTER_MAP[activeFilter]);

  const renderItem = ({ item }: { item: Booking }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        {item.stadiumPhoto && (
          <Image source={{ uri: item.stadiumPhoto }} style={styles.photo} />
        )}
        <View style={styles.cardInfo}>
          <Text style={styles.stadiumName}>{item.stadiumName}</Text>
          <Text style={styles.date}>{formatDate(item.date)}</Text>
          <Text style={styles.time}>
            {formatTime(item.startTime)} – {formatTime(item.endTime)} • {item.durationHours} ساعة
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '22' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.total}>{formatPrice(item.totalAmount)}</Text>
        {item.status === 'completed' && (
          <TouchableOpacity
            style={styles.rateBtn}
            onPress={() => navigation.navigate('RateStadium', { bookingId: item.id, stadiumId: item.stadiumId })}
          >
            <Text style={styles.rateBtnText}>⭐ قيّم الملعب</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.title}>حجوزاتي</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Filters */}
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
  title: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text },
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
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  list: { padding: Spacing.lg, gap: Spacing.md },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadow.card,
  },
  cardTop: { flexDirection: 'row', padding: Spacing.md, gap: Spacing.sm },
  photo: { width: 70, height: 70, borderRadius: Radius.md },
  cardInfo: { flex: 1, alignItems: 'flex-end' },
  stadiumName: { fontSize: FontSize.md, fontWeight: '800', color: Colors.text, textAlign: 'right' },
  date: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 4, textAlign: 'right' },
  time: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2, textAlign: 'right' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, alignSelf: 'flex-start' },
  statusText: { fontSize: FontSize.xs, fontWeight: '700' },
  cardFooter: {
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
  empty: { alignItems: 'center', paddingVertical: 64 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: FontSize.md, color: Colors.textSecondary },
});
