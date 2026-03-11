import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  StatusBar, Image,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../theme';
import { useStore } from '../../store';
import { formatPrice, getCategoryLabel } from '../../utils/helpers';
import { Stadium } from '../../types';

export default function MyStadiumsScreen({ navigation }: any) {
  const { stadiums, user } = useStore();
  const myStadiums = stadiums.slice(0, 2); // Mock: show first 2 as owner's

  const renderItem = ({ item }: { item: Stadium }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.photos[0] }} style={styles.image} resizeMode="cover" />
      <View style={styles.body}>
        <View style={styles.nameRow}>
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>نشط ✓</Text>
          </View>
          <Text style={styles.name}>{item.name}</Text>
        </View>
        <Text style={styles.location}>📍 {item.location}</Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>⭐ {item.rating}</Text>
            <Text style={styles.statLabel}>التقييم</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatPrice(item.pricePerHour)}</Text>
            <Text style={styles.statLabel}>/ ساعة</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{getCategoryLabel(item.category)}</Text>
            <Text style={styles.statLabel}>الحجم</Text>
          </View>
        </View>

        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditStadium', { stadiumId: item.id })}
          >
            <Text style={styles.editBtnText}>✏️ تعديل</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookingsBtn}>
            <Text style={styles.bookingsBtnText}>📅 الحجوزات</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddStadium')}
        >
          <Text style={styles.addBtnText}>+ إضافة ملعب</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ملاعبي</Text>
      </View>

      <FlatList
        data={myStadiums}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🏟️</Text>
            <Text style={styles.emptyText}>ما أضفت أي ملعب بعد</Text>
            <TouchableOpacity style={styles.addEmptyBtn} onPress={() => navigation.navigate('AddStadium')}>
              <Text style={styles.addEmptyBtnText}>أضف أول ملعبك</Text>
            </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 52,
    paddingBottom: Spacing.md,
  },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.textLight },
  addBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  addBtnText: { color: '#fff', fontSize: FontSize.sm, fontWeight: '700' },
  list: { padding: Spacing.lg, gap: Spacing.md },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadow.card,
  },
  image: { width: '100%', height: 180 },
  body: { padding: Spacing.md },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  name: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text },
  activeBadge: { backgroundColor: Colors.primary + '22', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.primary },
  activeBadgeText: { color: Colors.primary, fontSize: FontSize.xs, fontWeight: '700' },
  location: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'right', marginBottom: 12 },
  statsRow: { flexDirection: 'row', marginBottom: 12 },
  stat: { flex: 1, alignItems: 'center', backgroundColor: Colors.inputBg, padding: 8, borderRadius: Radius.md, marginHorizontal: 2 },
  statValue: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text },
  statLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  btnRow: { flexDirection: 'row', gap: Spacing.sm },
  editBtn: { flex: 1, backgroundColor: Colors.secondary, borderRadius: Radius.full, paddingVertical: 10, alignItems: 'center' },
  editBtnText: { color: '#fff', fontSize: FontSize.sm, fontWeight: '700' },
  bookingsBtn: { flex: 1, borderWidth: 1.5, borderColor: Colors.primary, borderRadius: Radius.full, paddingVertical: 10, alignItems: 'center' },
  bookingsBtnText: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: '700' },
  empty: { alignItems: 'center', paddingVertical: 64 },
  emptyIcon: { fontSize: 56, marginBottom: 12 },
  emptyText: { fontSize: FontSize.md, color: Colors.textSecondary, marginBottom: 16 },
  addEmptyBtn: { backgroundColor: Colors.primary, borderRadius: Radius.full, paddingVertical: 12, paddingHorizontal: 28 },
  addEmptyBtnText: { color: '#fff', fontWeight: '700', fontSize: FontSize.md },
});
