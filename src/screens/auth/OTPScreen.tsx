import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius } from '../../theme';

export default function OTPScreen({ navigation, route }: any) {
  const { phone, name } = route.params;
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<TextInput[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (val: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    if (val && index < 3) inputs.current[index + 1]?.focus();
  };

  const handleBackspace = (val: string, index: number) => {
    if (!val && index > 0) inputs.current[index - 1]?.focus();
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length < 4) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('SelectRole', { phone, name });
    }, 1000);
  };

  const handleResend = () => {
    setTimer(60);
    setOtp(['', '', '', '']);
    inputs.current[0]?.focus();
  };

  const isComplete = otp.every((d) => d !== '');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />

      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← رجوع</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.bigIcon}>📱</Text>
        <Text style={styles.title}>أدخل كود التحقق</Text>
        <Text style={styles.subtitle}>
          أرسلنا كود مكون من 4 أرقام إلى{'\n'}
          <Text style={styles.phone}>{phone}</Text>
        </Text>

        {/* OTP Inputs */}
        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(r) => { if (r) inputs.current[index] = r; }}
              style={[styles.otpInput, digit && styles.otpInputFilled]}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(v) => handleChange(v, index)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace') handleBackspace(digit, index);
              }}
              selectTextOnFocus
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.btn, (!isComplete || loading) && styles.btnDisabled]}
          onPress={handleVerify}
          disabled={!isComplete || loading}
        >
          <Text style={styles.btnText}>
            {loading ? 'جاري التحقق...' : 'تأكيد ✓'}
          </Text>
        </TouchableOpacity>

        <View style={styles.resendRow}>
          {timer > 0 ? (
            <Text style={styles.timerText}>
              إعادة إرسال الكود بعد{' '}
              <Text style={styles.timer}>{timer}s</Text>
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendBtn}>إعادة إرسال الكود</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.hint}>💡 للتجربة: أدخل أي 4 أرقام</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.secondary },
  back: { padding: Spacing.lg, paddingTop: 56 },
  backText: { color: Colors.textLight, fontSize: FontSize.md },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    marginTop: -60,
  },
  bigIcon: { fontSize: 64, marginBottom: Spacing.lg },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '900',
    color: Colors.textLight,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.md,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: Spacing.xl,
  },
  phone: { color: Colors.primary, fontWeight: '700' },
  otpRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: Spacing.xl,
  },
  otpInput: {
    width: 64,
    height: 72,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textLight,
    textAlign: 'center',
  },
  otpInputFilled: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(0,200,83,0.1)',
  },
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 16,
    paddingHorizontal: 64,
    marginBottom: Spacing.lg,
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontSize: FontSize.lg, fontWeight: '800' },
  resendRow: { marginBottom: Spacing.md },
  timerText: { color: 'rgba(255,255,255,0.5)', fontSize: FontSize.sm },
  timer: { color: Colors.primary, fontWeight: '700' },
  resendBtn: { color: Colors.primary, fontSize: FontSize.md, fontWeight: '700' },
  hint: { color: 'rgba(255,255,255,0.3)', fontSize: FontSize.xs, marginTop: 8 },
});
