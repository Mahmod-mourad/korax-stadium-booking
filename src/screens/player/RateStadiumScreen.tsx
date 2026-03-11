/**
 * RateStadiumScreen
 * ─────────────────────────────────────────────
 * شاشة تقييم الملعب بعد اكتمال الحجز
 *
 * التقييم يشمل أربعة محاور:
 *  • الأرضية   • الإضاءة   • النظافة   • المرافق
 *
 * عند الإرسال:
 *  • يُحفَظ التقييم في الـ store عبر addRating()
 *  • يُعاد حساب متوسط تقييم الملعب تلقائياً (في الـ store)
 *  • يُمنع التقييم المكرر لنفس الحجز (hasRated)
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  StatusBar, Alert, ScrollView,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../theme';
import { useStore } from '../../store';
import { useHeaderTop } from '../../utils/responsive';

const CATEGORIES = [
  { id: 'surface',     label: 'الأرضية',  icon: '⚽' },
  { id: 'lighting',   label: 'الإضاءة',   icon: '💡' },
  { id: 'cleanliness',label: 'النظافة',   icon: '🧹' },
  { id: 'facilities', label: 'المرافق',   icon: '🚿' },
];

export default function RateStadiumScreen({ navigation, route }: any) {
  const { bookingId, stadiumId } = route.params;
  const { stadiums, user, addRating, hasRated } = useStore();

  const stadium  = stadiums.find((s) => s.id === stadiumId);
  const alreadyRated = hasRated(bookingId);

  const [ratings, setRatings]   = useState<Record<string, number>>({});
  const [comment, setComment]   = useState('');
  const [loading, setLoading]   = useState(false);

  const headerTop = useHeaderTop();

  // ── الحساب ──────────────────────────────────
  const ratedCount   = Object.values(ratings).length;
  const overallScore =
    ratedCount > 0
      ? Object.values(ratings).reduce((a, b) => a + b, 0) / ratedCount
      : 0;

  const allRated = ratedCount === CATEGORIES.length;

  // ── الإرسال ──────────────────────────────────
  const handleSubmit = () => {
    if (alreadyRated) {
      Alert.alert('تم التقييم مسبقاً', 'لقد قيّمت هذا الملعب من قبل.');
      return;
    }
    if (!allRated) {
      Alert.alert('تنبيه', 'من فضلك قيّم جميع العناصر الأربعة');
      return;
    }

    setLoading(true);

    // محاكاة تأخير الشبكة (في الإنتاج: API call)
    setTimeout(() => {
      addRating({
        id: `rating_${Date.now()}`,
        stadiumId,
        bookingId,
        playerId:    user?.id ?? 'unknown',
        playerName:  user?.name ?? 'لاعب',
        score:       Math.round(overallScore * 10) / 10,
        surfaceScore:      ratings['surface'],
        lightingScore:     ratings['lighting'],
        organizationScore: ratings['cleanliness'],
        comment: comment.trim() || undefined,
        createdAt: new Date().toISOString(),
      });

      setLoading(false);
      Alert.alert('شكراً! ⭐', 'تم إرسال تقييمك بنجاح وسيساعد اللاعبين الآخرين', [
        { text: 'حسناً', onPress: () => navigation.goBack() },
      ]);
    }, 700);
  };

  // ── Already Rated Banner ──────────────────────
  if (alreadyRated) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={[styles.header, { paddingTop: headerTop }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.back}>← رجوع</Text>
          </TouchableOpacity>
          <Text style={styles.title}>قيّم الملعب</Text>
          <View style={{ width: 60 }} />
        </View>
        <View style={styles.alreadyRatedContainer}>
          <Text style={styles.alreadyRatedIcon}>✅</Text>
          <Text style={styles.alreadyRatedTitle}>تم التقييم مسبقاً</Text>
          <Text style={styles.alreadyRatedText}>
            شكراً! لقد قيّمت هذا الملعب من قبل.{'\n'}تقييمك يساعد اللاعبين الآخرين.
          </Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>رجوع</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: headerTop }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.title}>قيّم الملعب</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Stadium Info ── */}
        <View style={styles.stadiumInfo}>
          <Text style={styles.stadiumIcon}>🏟️</Text>
          <Text style={styles.stadiumName}>{stadium?.name ?? 'الملعب'}</Text>
          <Text style={styles.overall}>
            {overallScore > 0 ? `⭐ ${overallScore.toFixed(1)}` : '⭐ --'}
          </Text>
          <Text style={styles.overallHint}>
            {allRated ? 'تقييمك الإجمالي' : `قيّم ${CATEGORIES.length - ratedCount} عناصر متبقية`}
          </Text>
        </View>

        {/* ── Rating Categories ── */}
        {CATEGORIES.map((cat) => (
          <View key={cat.id} style={styles.ratingRow}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRatings((r) => ({ ...r, [cat.id]: star }))}
                  hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                >
                  <Text style={[styles.star, (ratings[cat.id] ?? 0) >= star && styles.starActive]}>
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.catInfo}>
              <Text style={styles.catLabel}>{cat.label}</Text>
              <Text style={styles.catIcon}>{cat.icon}</Text>
            </View>
          </View>
        ))}

        {/* ── Comment ── */}
        <View style={styles.commentSection}>
          <Text style={styles.commentLabel}>تعليقك (اختياري)</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="شاركنا رأيك في الملعب..."
            placeholderTextColor={Colors.textSecondary}
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={setComment}
            textAlign="right"
            textAlignVertical="top"
            maxLength={300}
          />
          <Text style={styles.charCount}>{comment.length}/300</Text>
        </View>

        {/* ── Submit ── */}
        <TouchableOpacity
          style={[styles.submitBtn, (!allRated || loading) && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!allRated || loading}
          activeOpacity={0.85}
        >
          <Text style={styles.submitBtnText}>
            {loading ? 'جاري الإرسال...' : 'إرسال التقييم ⭐'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // ── Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
    ...Shadow.header,
  },
  back:  { color: Colors.primary, fontSize: FontSize.md, fontWeight: '600', minWidth: 60 },
  title: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text },

  // ── Content
  content: { padding: Spacing.lg, gap: Spacing.md },

  // ── Stadium Info
  stadiumInfo: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: 4,
    ...Shadow.card,
  },
  stadiumIcon: { fontSize: 48, marginBottom: 4 },
  stadiumName: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text, textAlign: 'center' },
  overall:     { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.star, marginTop: 4 },
  overallHint: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },

  // ── Rating Row
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.card,
  },
  catInfo:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  catIcon:  { fontSize: 22 },
  catLabel: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  stars:    { flexDirection: 'row', gap: 4 },
  star:     { fontSize: 30, color: Colors.border },
  starActive: { color: Colors.star },

  // ── Comment
  commentSection: { gap: 6 },
  commentLabel: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'right',
  },
  commentInput: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text,
    borderWidth: 1.5,
    borderColor: Colors.border,
    minHeight: 110,
  },
  charCount: {
    textAlign: 'left',
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },

  // ── Submit
  submitBtn: {
    backgroundColor: Colors.star,
    borderRadius: Radius.full,
    paddingVertical: 16,
    alignItems: 'center',
    ...Shadow.card,
  },
  submitBtnDisabled: { opacity: 0.45 },
  submitBtnText: { color: '#fff', fontSize: FontSize.lg, fontWeight: '800' },

  // ── Already Rated
  alreadyRatedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    padding: Spacing.xl,
  },
  alreadyRatedIcon:  { fontSize: 64 },
  alreadyRatedTitle: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.text },
  alreadyRatedText:  {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  backBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 14,
    paddingHorizontal: Spacing.xxl,
    marginTop: Spacing.sm,
  },
  backBtnText: { color: '#fff', fontSize: FontSize.lg, fontWeight: '800' },
});
