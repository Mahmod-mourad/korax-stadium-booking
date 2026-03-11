import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, FlatList, StatusBar, Image,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../theme';
import { useStore } from '../../store';
import { Stadium } from '../../types';
import { formatPrice, getCategoryLabel, getSurfaceLabel } from '../../utils/helpers';

const CATEGORIES = [
  { id: 'all', label: 'الكل', icon: '🏆' },
  { id: 'small', label: 'صغير', icon: '⚽' },
  { id: 'medium', label: 'متوسط', icon: '🏟️' },
  { id: 'large', label: 'كبير', icon: '🌟' },
];

function StadiumCard({ stadium, onPress }: { stadium: Stadium; onPress: () => void }) {
  const discountedPrice = stadium.discount
    ? Math.round(stadium.pricePerHour * (1 - stadium.discount / 100))
    : null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.cardImageWrapper}>
        <Image
          source={{ uri: stadium.photos[0] }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        {stadium.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountBadgeText}>خصم {stadium.discount}%</Text>
          </View>
        )}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingBadgeText}>⭐ {stadium.rating}</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardName} numberOfLines={1}>{stadium.name}</Text>
        <Text style={styles.cardLocation}>📍 {stadium.location}</Text>
        <View style={styles.cardRow}>
          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{getCategoryLabel(stadium.category)}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{getSurfaceLabel(stadium.surface)}</Text>
            </View>
          </View>
          <View style={styles.priceBox}>
            {discountedPrice ? (
              <View style={styles.priceRow}>
                <Text style={styles.priceOld}>{formatPrice(stadium.pricePerHour)}</Text>
                <Text style={styles.priceNew}>{formatPrice(discountedPrice)}</Text>
              </View>
            ) : (
              <Text style={styles.price}>{formatPrice(stadium.pricePerHour)}</Text>
            )}
            <Text style={styles.perHour}>/ساعة</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.bookBtn} onPress={onPress}>
          <Text style={styles.bookBtnText}>احجز الآن</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }: any) {
  const { user, searchQuery, selectedCategory, setSearchQuery, setSelectedCategory, getFilteredStadiums } = useStore();
  const stadiums = getFilteredStadiums();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>أهلاً، {user?.name?.split(' ')[0]} 👋</Text>
          <Text style={styles.headerSub}>ابحث عن ملعبك المفضل</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn} onPress={() => navigation.navigate('Notifications')}>
          <Text style={styles.notifIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>

        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="ابحث عن ملعب أو منطقة..."
              placeholderTextColor={Colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              textAlign="right"
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearBtn}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catChip, selectedCategory === cat.id && styles.catChipActive]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text style={styles.catIcon}>{cat.icon}</Text>
              <Text style={[styles.catLabel, selectedCategory === cat.id && styles.catLabelActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ملاعب مميزة 🔥</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AllStadiums')}>
            <Text style={styles.seeAll}>عرض الكل</Text>
          </TouchableOpacity>
        </View>

        {/* Stadium List */}
        {stadiums.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>مافيش ملاعب بهذا البحث</Text>
          </View>
        ) : (
          stadiums.map((stadium) => (
            <StadiumCard
              key={stadium.id}
              stadium={stadium}
              onPress={() => navigation.navigate('StadiumDetails', { stadiumId: stadium.id })}
            />
          ))
        )}

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
  headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifIcon: { fontSize: 20 },
  searchWrapper: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    gap: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: FontSize.md, color: Colors.text },
  clearBtn: { fontSize: 16, color: Colors.textSecondary, padding: 4 },
  categoriesRow: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: 8,
    flexDirection: 'row',
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  catChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catIcon: { fontSize: 14 },
  catLabel: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text },
  catLabelActive: { color: '#fff' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text },
  seeAll: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadow.card,
  },
  cardImageWrapper: { position: 'relative', height: 180 },
  cardImage: { width: '100%', height: '100%' },
  discountBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.bookingFee,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  discountBadgeText: { color: '#fff', fontSize: FontSize.xs, fontWeight: '800' },
  ratingBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  ratingBadgeText: { color: '#fff', fontSize: FontSize.sm, fontWeight: '700' },
  cardBody: { padding: Spacing.md },
  cardName: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text, textAlign: 'right', marginBottom: 4 },
  cardLocation: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'right', marginBottom: 8 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 },
  tagRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  tag: {
    backgroundColor: Colors.inputBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  tagText: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: '600' },
  priceBox: { alignItems: 'flex-end' },
  priceRow: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  priceOld: { fontSize: FontSize.xs, color: Colors.textSecondary, textDecorationLine: 'line-through' },
  priceNew: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary },
  price: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text },
  perHour: { fontSize: FontSize.xs, color: Colors.textSecondary },
  bookBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 10,
    alignItems: 'center',
  },
  bookBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: '800' },
  empty: { alignItems: 'center', paddingVertical: 64 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: FontSize.md, color: Colors.textSecondary },
});
