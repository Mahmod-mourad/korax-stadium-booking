/**
 * Badge — شارة نصية صغيرة
 *
 * يُستخدم لعرض الحالة: مؤكد / مكتمل / ملغى / مفتوح ...
 * أو عدد الإشعارات على أيقونة.
 *
 * variant:
 *   success | warning | error | info | neutral
 *
 * أو يمكن تمرير لون مخصص.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Radius } from '../../theme';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  color?: string;     // لون مخصص — يُستخدم بدلاً من variant
  size?: 'sm' | 'md';
  dot?: boolean;      // نقطة ملوّنة بدلاً من نص (لعرض عدد مثلاً)
}

const VARIANT_COLORS: Record<BadgeVariant, { bg: string; text: string }> = {
  success: { bg: Colors.success + '22', text: Colors.success },
  warning: { bg: Colors.warning + '22', text: Colors.warning },
  error:   { bg: Colors.error   + '22', text: Colors.error   },
  info:    { bg: '#2196F3'      + '22', text: '#2196F3'      },
  neutral: { bg: Colors.border,         text: Colors.textSecondary },
};

export function Badge({ label, variant = 'neutral', color, size = 'md', dot }: BadgeProps) {
  const colors = color
    ? { bg: color + '22', text: color }
    : VARIANT_COLORS[variant];

  return (
    <View style={[
      styles.badge,
      size === 'sm' && styles.badgeSm,
      { backgroundColor: colors.bg },
    ]}>
      {dot && <View style={[styles.dot, { backgroundColor: colors.text }]} />}
      <Text style={[
        styles.text,
        size === 'sm' && styles.textSm,
        { color: colors.text },
      ]}>
        {label}
      </Text>
    </View>
  );
}

/**
 * NotifBadge — دائرة حمراء صغيرة فوق أيقونة (عدد الإشعارات)
 */
export function NotifBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <View style={styles.notifBadge}>
      <Text style={styles.notifText}>{count > 99 ? '99+' : String(count)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.full,
    gap: 4,
    alignSelf: 'flex-start',
  },
  badgeSm: { paddingHorizontal: 8, paddingVertical: 2 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontSize: FontSize.xs, fontWeight: '700' },
  textSm: { fontSize: 10 },
  notifBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.error,
    borderRadius: Radius.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  notifText: { color: '#fff', fontSize: 10, fontWeight: '900' },
});
