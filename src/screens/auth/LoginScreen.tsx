import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  StatusBar, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius } from '../../theme';

export default function LoginScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = () => {
    if (!name.trim() || phone.length < 11) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('OTP', { phone, name });
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoMini}>
            <Text style={styles.logoEmoji}>⚽</Text>
          </View>
          <Text style={styles.appName}>KoraX</Text>
          <Text style={styles.tagline}>احجز ملعبك بسهولة</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>مرحباً بك! 👋</Text>
          <Text style={styles.cardSubtitle}>أدخل بياناتك للبدء</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>الاسم</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="اسمك الكامل"
                placeholderTextColor={Colors.textSecondary}
                value={name}
                onChangeText={setName}
                textAlign="right"
              />
              <Text style={styles.inputIcon}>👤</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>رقم الهاتف</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="01xxxxxxxxx"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                maxLength={11}
                textAlign="right"
              />
              <Text style={styles.inputIcon}>📱</Text>
            </View>
            <Text style={styles.hint}>سنرسل لك كود تحقق عبر SMS</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.btn,
              (!name.trim() || phone.length < 11 || loading) && styles.btnDisabled,
            ]}
            onPress={handleSendOTP}
            disabled={!name.trim() || phone.length < 11 || loading}
          >
            <Text style={styles.btnText}>
              {loading ? 'جاري الإرسال...' : 'إرسال كود التحقق →'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.terms}>
          بتسجيلك أنت موافق على{' '}
          <Text style={styles.termsLink}>شروط الاستخدام</Text>{' '}
          و{' '}
          <Text style={styles.termsLink}>سياسة الخصوصية</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.secondary },
  content: { flexGrow: 1, padding: Spacing.lg },
  header: { alignItems: 'center', paddingVertical: Spacing.xxl },
  logoMini: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoEmoji: { fontSize: 40 },
  appName: {
    fontSize: FontSize.xxxl,
    fontWeight: '900',
    color: Colors.textLight,
    letterSpacing: 3,
  },
  tagline: { fontSize: FontSize.sm, color: Colors.primary, marginTop: 4 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'right',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginBottom: Spacing.lg,
  },
  inputGroup: { marginBottom: Spacing.md },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'right',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  inputIcon: { fontSize: 18, marginLeft: 8 },
  hint: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: 4,
  },
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontSize: FontSize.lg, fontWeight: '800' },
  terms: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  termsLink: { color: Colors.primary },
});
