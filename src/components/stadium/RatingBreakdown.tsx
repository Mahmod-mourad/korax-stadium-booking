/**
 * RatingBreakdown — تفصيل التقييم بالأبعاد الثلاثة
 * (أرضية / إضاءة / تنظيم)
 *
 * يُستخدم في: StadiumDetailsScreen
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Rating } from '../../types';
import { Colors, FontSize, Radius, Spacing } from '../../theme';

interface RatingBreakdownProps {
  ratings: Rating[];
}

function avg(values: (number | undefined)[]): number {
  const valid = values.filter((v): v is number => v != null);
  if (!valid.length) return 0;
  return valid.reduce((s, v) => s + v, 0) / valid.length;
}

function BarRow({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.barRow}>
      <Text style={styles.barLabel}>{label}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${(value / 5) * 100}%` as any }]} />
      </View>
      <Text style={styles.barValue}>{value.toFixed(1)}</Text>
    </View>
  );
}

export function RatingBreakdown({ ratings }: RatingBreakdownProps) {
  if (!ratings.length) return null;

  const overall      = avg(ratings.map((r) => r.score));
  const surface      = avg(ratings.map((r) => r.surfaceScore));
  const lighting     = avg(ratings.map((r) => r.lightingScore));
  const organization = avg(ratings.map((r) => r.organizationScore));

  return (
    <View style={styles.container}>
      <View style={styles.overallRow}>
        <Text style={styles.overallScore}>{overall.toFixed(1)}</Text>
        <View>
          <Text style={styles.overallLabel}>متوسط التقييم</Text>
          <Text style={styles.overallCount}>بناءً على {ratings.length} تقييم</Text>
        </View>
      </View>

      <BarRow label="جودة الأرضية" value={surface} />
      <BarRow label="الإضاءة"      value={lighting} />
      <BarRow label="التنظيم"      value={organization} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.sm },
  overallRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
    justifyContent: 'flex-end',
  },
  overallScore: {
    fontSize: 48,
    fontWeight: '900',
    color: Colors.primary,
  },
  overallLabel: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'right',
  },
  overallCount: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    justifyContent: 'flex-end',
  },
  barLabel: { fontSize: FontSize.sm, color: Colors.textSecondary, width: 100, textAlign: 'right' },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
  },
  barValue: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text, width: 28, textAlign: 'right' },
});
