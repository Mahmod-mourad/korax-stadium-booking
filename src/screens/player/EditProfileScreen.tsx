/**
 * EditProfileScreen
 * ─────────────────────────────────────────────
 * شاشة تعديل الملف الشخصي للاعب
 *
 * الحقول:
 *  • الاسم   – قابل للتعديل
 *  • البريد الإلكتروني – قابل للتعديل (اختياري)
 *  • رقم الهاتف – للعرض فقط (لا يتغير)
 *
 * عند الحفظ:
 *  • يُحدَّث الـ user في الـ store فوراً
 *  • يظهر تأكيد للمستخدم ثم يرجع للخلف
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, StatusBar, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../theme';
import { useStore } from '../../store';
import { useHeaderTop } from '../../utils/responsive';

export default function EditProfileScreen({ navigation }: any) {
  const { user, setUser } = useStore();

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [saving, setSaving] = useState(false);

  const headerTop = useHeaderTop();

  // ── Validation ───────────────────────────────
  const isNameValid = name.trim().length >= 2;
  const isEmailValid = email.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSave = isNameValid && isEmailValid;

  const hasChanged =
    name.trim() !== (user?.name ?? '') ||
    email.trim() !== (user?.email ?? '');

  // ── Save ─────────────────────────────────────
  const handleSave = () => {
    if (!canSave) {
      if (!isNameValid) Alert.alert('تنبيه', 'الاسم يجب أن يكون حرفين على الأقل');
      else if (!isEmailValid) Alert.alert('تنبيه', 'البريد الإلكتروني غير صحيح');
      return;
    }
    if (!hasChanged) {
      navigation.goBack();
      return;
    }

    setSaving(true);
    // تحديث الـ store – في الإنتاج يُرسل API request أولاً
    setTimeout(() => {
      if (user) {
        setUser({ ...user, name: name.trim(), email: email.trim() || undefined });
      }
      setSaving(false);
      Alert.alert('تم الحفظ ✅', 'تم تحديث ملفك الشخصي بنجاح', [
        { text: 'حسناً', onPress: () => navigation.goBack() },
      ]);
    }, 600);
  };

  const handleBack = () => {
    if (hasChanged) {
      Alert.alert('تجاهل التعديلات؟', 'هل تريد الخروج بدون حفظ التغييرات؟', [
        { text: 'إكمال التعديل', style: 'cancel' },
        { text: 'خروج', style: 'destructive', onPress: () => navigation.goBack() },
      ]);
    } else {
      navigation.goBack();
    }
  };

  // ── Initial for Avatar ────────────────────────
  const initial = (name.trim() || user?.name || '؟').charAt(0).toUpperCase();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: headerTop }]}>
        <TouchableOpacity onPress={handleBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.headerBack}>← رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>تعديل الملف الشخصي</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving || !canSave}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.headerSave, (!canSave || saving) && styles.headerSaveDisabled]}>
            {saving ? 'جاري...' : 'حفظ'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* ── Avatar ── */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <TouchableOpacity
            style={styles.changePhotoBtn}
            onPress={() => Alert.alert('قريباً 📷', 'ميزة رفع الصورة ستكون متاحة في التحديث القادم')}
          >
            <Text style={styles.changePhotoText}>تغيير الصورة الشخصية</Text>
          </TouchableOpacity>
        </View>

        {/* ── Fields ── */}
        <View style={styles.card}>

          {/* Name */}
          <View style={styles.field}>
            <Text style={styles.label}>
              <Text style={styles.required}>* </Text>
              الاسم
            </Text>
            <TextInput
              style={[styles.input, !isNameValid && name.length > 0 && styles.inputError]}
              value={name}
              onChangeText={setName}
              placeholder="اسمك الكامل"
              placeholderTextColor={Colors.textSecondary}
              textAlign="right"
              returnKeyType="next"
              maxLength={50}
            />
            {!isNameValid && name.length > 0 && (
              <Text style={styles.errorText}>الاسم يجب أن يكون حرفين على الأقل</Text>
            )}
          </View>

          <View style={styles.divider} />

          {/* Email */}
          <View style={styles.field}>
            <Text style={styles.label}>البريد الإلكتروني (اختياري)</Text>
            <TextInput
              style={[styles.input, !isEmailValid && styles.inputError]}
              value={email}
              onChangeText={setEmail}
              placeholder="example@gmail.com"
              placeholderTextColor={Colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              textAlign="right"
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />
            {!isEmailValid && (
              <Text style={styles.errorText}>صيغة البريد الإلكتروني غير صحيحة</Text>
            )}
          </View>

          <View style={styles.divider} />

          {/* Phone – read only */}
          <View style={styles.field}>
            <Text style={styles.label}>رقم الهاتف 🔒</Text>
            <View style={styles.phoneRow}>
              <Text style={styles.phoneLockNote}>لا يمكن تغيير رقم الهاتف</Text>
              <Text style={styles.phoneValue}>{user?.phone}</Text>
            </View>
          </View>
        </View>

        {/* ── Save Button ── */}
        <TouchableOpacity
          style={[styles.saveBtn, (!canSave || saving) && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={!canSave || saving}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>
            {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
          </Text>
        </TouchableOpacity>

        {/* مساحة إضافية للكيبورد */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

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
  headerSave: {
    color: Colors.primary,
    fontSize: FontSize.md,
    fontWeight: '800',
    minWidth: 60,
    textAlign: 'right',
  },
  headerSaveDisabled: {
    opacity: 0.35,
  },

  // ── Layout
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },

  // ── Avatar
  avatarSection: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.surface,
    ...Shadow.card,
  },
  avatarText: {
    fontSize: 44,
    fontWeight: '900',
    color: '#fff',
  },
  changePhotoBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
  },
  changePhotoText: {
    color: Colors.primary,
    fontSize: FontSize.md,
    fontWeight: '700',
  },

  // ── Form Card
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadow.card,
    gap: Spacing.sm,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
    textAlign: 'right',
  },
  required: {
    color: Colors.error,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: FontSize.md,
    color: Colors.text,
    borderWidth: 1.5,
    borderColor: 'transparent',
    fontWeight: '500',
  },
  inputError: {
    borderColor: Colors.error,
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSize.xs,
    textAlign: 'right',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.xs,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    opacity: 0.7,
  },
  phoneValue: {
    fontSize: FontSize.md,
    color: Colors.text,
    fontWeight: '600',
    letterSpacing: 1,
  },
  phoneLockNote: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },

  // ── Save Button
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 16,
    alignItems: 'center',
    ...Shadow.card,
  },
  saveBtnDisabled: {
    opacity: 0.45,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: FontSize.lg,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
