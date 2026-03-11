/**
 * StadiumCard — كارد الملعب الكامل
 *
 * يُستخدم في: HomeScreen, AllStadiumsScreen
 *
 * يعرض: صورة، اسم، موقع، تقييم، السعر، الخصم، زر حجز
 */
import React from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
} from 'react-native';
import { Stadium } from '../../types';
import { Colors, FontSize, Radius, Shadow, Spacing } from '../../theme';
import { formatPrice, getCategoryLabel, getSurfaceLabel } from '../../utils/helpers';
import { Badge } from '../common/Badge';
import { StarsRating } from '../common/StarsRating';

interface StadiumCardProps {
  stadium: Stadium;
  onPress: () => void;
  onBook?: () => void;
}

export function StadiumCard({ stadium, onPress, onBook }: StadiumCardProps) {
  const discountedPrice = stadium.discount
    ? Math.round(stadium.pricePerHour * (1 - stadium.discount / 100))
    : null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>

      {/* ── صورة الملعب ─────────────────── */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: stadium.photos[0] }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* شارة الخصم */}
        {stadium.discount != null && stadium.discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>خصم {stadium.discount}%</Text>
          </View>
        )}

        {/* التقييم */}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>⭐ {stadium.rating.toFixed(1)}</Text>
        </View>
      </View>

      {/* ── تفاصيل ──────────────────────── */}
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>{stadium.name}</Text>
        <Text style={styles.location} numberOfLines={1}>📍 {stadium.location}</Text>

        {/* التاجات + السعر */}
        <View style={styles.row}>
          <View style={styles.tags}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{getCategoryLabel(stadium.category)}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{getSurfaceLabel(stadium.surface)}</Text>
            </View>
          </View>

          <View style={styles.priceBox}>
            {discountedPrice != null ? (
              <>
                <Text style={styles.priceOld}>{formatPrice(stadium.pricePerHour)}</Text>
                <Text style={styles.priceNew}>{formatPrice(discountedPrice)}</Text>
              </>
            ) : (
              <Text style={styles.price}>{formatPrice(stadium.pricePerHour)}</Text>
            )}
            <Text style={styles.perHour}>/ساعة</Text>
          </View>
        </View>

        {/* زر الحجز */}
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={onBook ?? onPress}
          activeOpacity={0.85}
        >
          <Text style={styles.bookBtnText}>احجز الآن</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadow.card,
  },
  imageWrapper: { position: 'relative', height: 180 },
  image: { width: '100%', height: '100%' },

  discountBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.bookingFee,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  discountText: { color: '#fff', fontSize: FontSize.xs, fontWeight: '800' },

  ratingBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  ratingText: { color: '#fff', fontSize: FontSize.sm, fontWeight: '700' },

  body: { padding: Spacing.md },
  name: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'right',
    marginBottom: 4,
  },
  location: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  tags: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  tag: {
    backgroundColor: Colors.inputBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  tagText: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: '600' },

  priceBox: { alignItems: 'flex-end' },
  priceOld: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  priceNew: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary },
  price:    { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text },
  perHour:  { fontSize: FontSize.xs, color: Colors.textSecondary },

  bookBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 10,
    alignItems: 'center',
  },
  bookBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: '800' },
});
