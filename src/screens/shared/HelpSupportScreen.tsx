/**
 * HelpSupportScreen
 * ─────────────────────────────────────────────
 * شاشة المساعدة والدعم – متاحة للاعب وصاحب الملعب
 *
 * الأقسام:
 *  1. الأسئلة الشائعة (FAQ) – accordion قابل للفتح والإغلاق
 *  2. تواصل معنا – واتساب، هاتف، إيميل
 *  3. معلومات التطبيق – الإصدار، سياسة الخصوصية، الشروط
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Linking, Alert,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../theme';
import { useHeaderTop } from '../../utils/responsive';

// ── بيانات الأسئلة الشائعة ───────────────────

const FAQ_ITEMS = [
  {
    id: '1',
    question: 'كيف أحجز ملعباً؟',
    answer:
      'من الشاشة الرئيسية، اختر الملعب الذي يناسبك ← اضغط "احجز الآن" ← اختر التاريخ والوقت ← ادفع رسوم الحجز (20 جنيه) ← وصلك تأكيد الحجز.',
  },
  {
    id: '2',
    question: 'هل يمكنني إلغاء الحجز؟',
    answer:
      'الحجوزات المؤكدة (بعد الدفع) غير قابلة للإلغاء. يمكن إلغاء الحجوزات "قيد الانتظار" فقط قبل إتمام الدفع.',
  },
  {
    id: '3',
    question: 'ما هي رسوم التطبيق؟',
    answer:
      'رسوم KoraX ثابتة 20 جنيه لكل ساعة حجز. هذه الرسوم منفصلة عن سعر الملعب وتُدفع عبر التطبيق.',
  },
  {
    id: '4',
    question: 'كيف تعمل ميزة "ناقص لاعب"؟',
    answer:
      'إذا عندك ماتش وناقصك لاعبين، افتح تبويب الماتشات ← اضغط "طلب لاعب" ← حدد عدد اللاعبين المطلوبين وتفاصيل الماتش. سيظهر طلبك للاعبين القريبين.',
  },
  {
    id: '5',
    question: 'كيف أقيّم ملعباً؟',
    answer:
      'بعد اكتمال الحجز، يظهر في "حجوزاتي" زر "قيّم الملعب". التقييم يساعد اللاعبين الآخرين في اختيار أفضل الملاعب.',
  },
  {
    id: '6',
    question: 'هل التطبيق يدعم دفع أونلاين؟',
    answer:
      'حالياً الدفع يشمل فودافون كاش وفوري. قريباً سيتم إضافة بطاقات بنكية والدفع الكاش في الملعب.',
  },
  {
    id: '7',
    question: 'أنا صاحب ملعب، كيف أضيف ملعبي؟',
    answer:
      'سجّل دخول كـ "صاحب ملعب" ← من لوحة التحكم اضغط "إضافة ملعب" ← أدخل بيانات الملعب والصور والأسعار ← سيتم مراجعته وتفعيله خلال 24 ساعة.',
  },
];

// ── بيانات التواصل ───────────────────────────

const CONTACT_ITEMS = [
  {
    id: 'whatsapp',
    icon: '💬',
    label: 'واتساب',
    subtitle: 'رد خلال ساعة',
    color: '#25D366',
    onPress: () => Linking.openURL('https://wa.me/201000000000?text=مرحباً، أحتاج مساعدة في KoraX'),
  },
  {
    id: 'phone',
    icon: '📞',
    label: 'اتصل بنا',
    subtitle: '9 صباحاً – 6 مساءً',
    color: Colors.primary,
    onPress: () => Linking.openURL('tel:+201000000000'),
  },
  {
    id: 'email',
    icon: '📧',
    label: 'البريد الإلكتروني',
    subtitle: 'support@korax.app',
    color: Colors.warning,
    onPress: () =>
      Linking.openURL('mailto:support@korax.app?subject=طلب دعم KoraX'),
  },
];

// ── Component: FAQ Item ───────────────────────

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <TouchableOpacity
      style={styles.faqItem}
      onPress={() => setOpen((v) => !v)}
      activeOpacity={0.8}
    >
      <View style={styles.faqQuestion}>
        <Text style={[styles.faqArrow, open && styles.faqArrowOpen]}>›</Text>
        <Text style={styles.faqQuestionText}>{question}</Text>
      </View>
      {open && (
        <Text style={styles.faqAnswer}>{answer}</Text>
      )}
    </TouchableOpacity>
  );
}

// ── Component: Contact Item ───────────────────

function ContactItem({ icon, label, subtitle, color, onPress }: any) {
  return (
    <TouchableOpacity style={styles.contactItem} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.contactRight}>
        <Text style={styles.contactLabel}>{label}</Text>
        <Text style={styles.contactSubtitle}>{subtitle}</Text>
      </View>
      <View style={[styles.contactIconWrap, { backgroundColor: color + '18' }]}>
        <Text style={styles.contactIcon}>{icon}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ── Main Screen ───────────────────────────────

export default function HelpSupportScreen({ navigation }: any) {
  const headerTop = useHeaderTop();

  const handlePolicyPress = () =>
    Alert.alert('سياسة الخصوصية', 'سياسة الخصوصية ستكون متاحة قريباً على موقعنا الرسمي.');

  const handleTermsPress = () =>
    Alert.alert('الشروط والأحكام', 'الشروط والأحكام ستكون متاحة قريباً على موقعنا الرسمي.');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: headerTop }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.headerBack}>← رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>المساعدة والدعم</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* ── Hero ── */}
        <View style={styles.hero}>
          <Text style={styles.heroIcon}>🏟️</Text>
          <Text style={styles.heroTitle}>كيف نقدر نساعدك؟</Text>
          <Text style={styles.heroSubtitle}>
            فريق KoraX موجود دايماً لمساعدتك
          </Text>
        </View>

        {/* ── FAQ ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>❓ الأسئلة الشائعة</Text>
          <View style={styles.faqCard}>
            {FAQ_ITEMS.map((item, index) => (
              <View key={item.id}>
                <FAQItem question={item.question} answer={item.answer} />
                {index < FAQ_ITEMS.length - 1 && <View style={styles.faqDivider} />}
              </View>
            ))}
          </View>
        </View>

        {/* ── Contact ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📞 تواصل معنا</Text>
          <View style={styles.contactCard}>
            {CONTACT_ITEMS.map((item, index) => (
              <View key={item.id}>
                <ContactItem {...item} />
                {index < CONTACT_ITEMS.length - 1 && <View style={styles.faqDivider} />}
              </View>
            ))}
          </View>
        </View>

        {/* ── App Info ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ معلومات التطبيق</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoValue}>KoraX v1.0.0</Text>
              <Text style={styles.infoLabel}>الإصدار</Text>
            </View>
            <View style={styles.infoDivider} />
            <TouchableOpacity style={styles.infoRow} onPress={handlePolicyPress}>
              <Text style={[styles.infoValue, styles.infoLink]}>عرض ›</Text>
              <Text style={styles.infoLabel}>سياسة الخصوصية</Text>
            </TouchableOpacity>
            <View style={styles.infoDivider} />
            <TouchableOpacity style={styles.infoRow} onPress={handleTermsPress}>
              <Text style={[styles.infoValue, styles.infoLink]}>عرض ›</Text>
              <Text style={styles.infoLabel}>الشروط والأحكام</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Footer ── */}
        <Text style={styles.footer}>صُنع بـ ❤️ لكل عشاق الكورة في مصر</Text>
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({

  // ── Layout
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.lg,
  },

  // ── Header
  header: {
    backgroundColor: Colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    ...Shadow.header,
  },
  headerBack: {
    color: Colors.primary,
    fontSize: FontSize.md,
    fontWeight: '600',
    minWidth: 60,
  },
  headerTitle: {
    color: Colors.textLight,
    fontSize: FontSize.lg,
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
  },

  // ── Hero
  hero: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: 6,
  },
  heroIcon: { fontSize: 48 },
  heroTitle: {
    fontSize: FontSize.xl,
    fontWeight: '900',
    color: Colors.text,
  },
  heroSubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },

  // ── Section
  section: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'right',
  },

  // ── FAQ
  faqCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadow.card,
  },
  faqItem: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    gap: 8,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'right',
  },
  faqArrow: {
    fontSize: 20,
    color: Colors.textSecondary,
    transform: [{ rotate: '0deg' }],
  },
  faqArrowOpen: {
    color: Colors.primary,
    transform: [{ rotate: '90deg' }],
  },
  faqAnswer: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 22,
    textAlign: 'right',
    paddingRight: 28,
  },
  faqDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.lg,
  },

  // ── Contact
  contactCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadow.card,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
  },
  contactIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactIcon: { fontSize: 22 },
  contactRight: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 2,
  },
  contactLabel: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
  },
  contactSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },

  // ── Info
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadow.card,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
  },
  infoLabel: {
    fontSize: FontSize.md,
    color: Colors.text,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  infoLink: {
    color: Colors.primary,
    fontWeight: '700',
  },
  infoDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.lg,
  },

  // ── Footer
  footer: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
});
