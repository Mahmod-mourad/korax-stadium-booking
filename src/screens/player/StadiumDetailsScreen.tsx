import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
  StatusBar, Dimensions, FlatList,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../theme';
import { useStore } from '../../store';
import { formatPrice, getCategoryLabel, getSurfaceLabel } from '../../utils/helpers';

const { width } = Dimensions.get('window');

const AMENITY_ICONS: Record<string, string> = {
  'إضاءة ليلية': '💡',
  'غرف تغيير ملابس': '🚿',
  'كافيتيريا': '☕',
  'مواقف سيارات': '🚗',
  'دش': '🚿',
  'مدرج': '🏟️',
};

export default function StadiumDetailsScreen({ navigation, route }: any) {
  const { stadiumId } = route.params;
  const { stadiums } = useStore();
  const stadium = stadiums.find((s) => s.id === stadiumId);
  const [activePhoto, setActivePhoto] = useState(0);

  if (!stadium) return null;

  const discountedPrice = stadium.discount
    ? Math.round(stadium.pricePerHour * (1 - stadium.discount / 100))
    : null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Photo Gallery */}
      <View style={styles.gallery}>
        <FlatList
          data={stadium.photos}
          keyExtractor={(_, i) => String(i)}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            setActivePhoto(Math.round(e.nativeEvent.contentOffset.x / width));
          }}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.photo} resizeMode="cover" />
          )}
        />
        {/* Dots */}
        <View style={styles.photoDots}>
          {stadium.photos.map((_, i) => (
            <View key={i} style={[styles.dot, i === activePhoto && styles.dotActive]} />
          ))}
        </View>
        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Main Info */}
        <View style={styles.infoCard}>
          <Text style={styles.stadiumName}>{stadium.name}</Text>
          <Text style={styles.location}>📍 {stadium.location}</Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <Text style={styles.ratingText}>⭐ {stadium.rating}</Text>
            <Text style={styles.ratingCount}>({stadium.totalRatings} تقييم)</Text>
            <View style={styles.dot2} />
            <View style={styles.tag}>
              <Text style={styles.tagText}>{getCategoryLabel(stadium.category)}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{getSurfaceLabel(stadium.surface)}</Text>
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <View>
              {discountedPrice ? (
                <>
                  <Text style={styles.priceOld}>{formatPrice(stadium.pricePerHour)}/ساعة</Text>
                  <Text style={styles.priceNew}>{formatPrice(discountedPrice)}/ساعة</Text>
                  <View style={styles.discountTag}>
                    <Text style={styles.discountTagText}>وفر {stadium.discount}%</Text>
                  </View>
                </>
              ) : (
                <Text style={styles.price}>{formatPrice(stadium.pricePerHour)}/ساعة</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.callBtn}
              onPress={() => {}}
            >
              <Text style={styles.callBtnText}>📞 اتصال</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        {stadium.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>عن الملعب</Text>
            <Text style={styles.description}>{stadium.description}</Text>
          </View>
        )}

        {/* Amenities */}
        {stadium.amenities && stadium.amenities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>المميزات</Text>
            <View style={styles.amenitiesGrid}>
              {stadium.amenities.map((a, i) => (
                <View key={i} style={styles.amenityChip}>
                  <Text style={styles.amenityIcon}>{AMENITY_ICONS[a] || '✓'}</Text>
                  <Text style={styles.amenityText}>{a}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statValue}>{stadium.rating}</Text>
            <Text style={styles.statLabel}>تقييم</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>👥</Text>
            <Text style={styles.statValue}>{stadium.totalRatings}</Text>
            <Text style={styles.statLabel}>تقييم</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={styles.statValue}>{formatPrice(discountedPrice ?? stadium.pricePerHour)}</Text>
            <Text style={styles.statLabel}>/ ساعة</Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Book Button */}
      <View style={styles.bookingBar}>
        <View>
          <Text style={styles.bookingBarPrice}>
            {formatPrice(discountedPrice ?? stadium.pricePerHour)}
            <Text style={styles.bookingBarSuffix}> / ساعة</Text>
          </Text>
          <Text style={styles.bookingFeeNote}>+ 20 جنيه رسوم حجز</Text>
        </View>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => navigation.navigate('Booking', { stadiumId })}
        >
          <Text style={styles.bookBtnText}>احجز الآن 📅</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  gallery: { position: 'relative', height: 280 },
  photo: { width, height: 280 },
  photoDots: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.4)' },
  dotActive: { backgroundColor: '#fff', width: 20 },
  backBtn: {
    position: 'absolute',
    top: 48,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: { color: '#fff', fontSize: 20 },
  scroll: { flex: 1 },
  infoCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    ...Shadow.header,
  },
  stadiumName: {
    fontSize: FontSize.xxl,
    fontWeight: '900',
    color: Colors.text,
    textAlign: 'right',
    marginBottom: 4,
  },
  location: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'right', marginBottom: 10 },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  ratingText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.star },
  ratingCount: { fontSize: FontSize.xs, color: Colors.textSecondary },
  dot2: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.border },
  tag: { backgroundColor: Colors.inputBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.sm },
  tagText: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: '600' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  price: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.text },
  priceOld: { fontSize: FontSize.sm, color: Colors.textSecondary, textDecorationLine: 'line-through', textAlign: 'right' },
  priceNew: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.primary, textAlign: 'right' },
  discountTag: { backgroundColor: Colors.primaryLight + '33', paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.sm, alignSelf: 'flex-end', marginTop: 2 },
  discountTagText: { fontSize: FontSize.xs, color: Colors.primaryDark, fontWeight: '700' },
  callBtn: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  callBtnText: { color: Colors.primary, fontSize: FontSize.md, fontWeight: '700' },
  section: { padding: Spacing.lg, backgroundColor: Colors.surface, marginTop: Spacing.sm },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text, textAlign: 'right', marginBottom: 10 },
  description: { fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 26, textAlign: 'right' },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'flex-end' },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.inputBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  amenityIcon: { fontSize: 16 },
  amenityText: { fontSize: FontSize.sm, color: Colors.text, fontWeight: '600' },
  statsRow: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    marginTop: Spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  statIcon: { fontSize: 24, marginBottom: 4 },
  statValue: { fontSize: FontSize.md, fontWeight: '800', color: Colors.text },
  statLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  bookingBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadow.header,
  },
  bookingBarPrice: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.text },
  bookingBarSuffix: { fontSize: FontSize.sm, fontWeight: '400', color: Colors.textSecondary },
  bookingFeeNote: { fontSize: FontSize.xs, color: Colors.bookingFee, fontWeight: '600', textAlign: 'right' },
  bookBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  bookBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: '800' },
});
