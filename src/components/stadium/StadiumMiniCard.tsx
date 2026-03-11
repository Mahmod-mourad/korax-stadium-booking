/**
 * StadiumMiniCard — كارد مضغوط للملعب
 *
 * يُستخدم في: BookingScreen (بيين اسم الملعب في الأعلى)
 * أو كـ list item في شاشات المالك
 */
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Stadium } from '../../types';
import { Colors, FontSize, Radius, Shadow, Spacing } from '../../theme';
import { formatPrice } from '../../utils/helpers';

interface StadiumMiniCardProps {
  stadium: Stadium;
  onPress?: () => void;
  /** يُخفي السعر إذا كان false */
  showPrice?: boolean;
  rightElement?: React.ReactNode;
}

export function StadiumMiniCard({
  stadium,
  onPress,
  showPrice = true,
  rightElement,
}: StadiumMiniCardProps) {
  const Wrapper: any = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: stadium.photos[0] }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{stadium.name}</Text>
        <Text style={styles.location} numberOfLines={1}>📍 {stadium.location}</Text>
        {showPrice && (
          <Text style={styles.price}>
            {formatPrice(stadium.pricePerHour)}<Text style={styles.perHour}>/ساعة</Text>
          </Text>
        )}
      </View>
      {rightElement && <View style={styles.right}>{rightElement}</View>}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    alignItems: 'center',
    ...Shadow.card,
  },
  image: { width: 80, height: 80 },
  info: { flex: 1, padding: Spacing.md, alignItems: 'flex-end' },
  name: { fontSize: FontSize.md, fontWeight: '800', color: Colors.text },
  location: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  price: { fontSize: FontSize.md, fontWeight: '800', color: Colors.primary, marginTop: 4 },
  perHour: { fontSize: FontSize.xs, fontWeight: '400', color: Colors.textSecondary },
  right: { paddingRight: Spacing.md },
});
