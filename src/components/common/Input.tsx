/**
 * Input — حقل إدخال نص
 *
 * يدعم:
 *  - label + error message
 *  - prefix/suffix (أيقونة أو نص)
 *  - multiline (textarea)
 *  - كل خصائص TextInput الأصلية
 */
import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  prefix?: string;    // أيقونة أو نص على اليسار (في RTL = اليمين)
  suffix?: string;    // أيقونة أو نص على اليمين
  onSuffixPress?: () => void;
}

export function Input({
  label,
  error,
  hint,
  prefix,
  suffix,
  onSuffixPress,
  multiline,
  style,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[
        styles.inputContainer,
        focused && styles.focused,
        !!error && styles.errorBorder,
      ]}>
        {prefix && <Text style={styles.prefix}>{prefix}</Text>}

        <TextInput
          style={[
            styles.input,
            multiline && styles.multiline,
            style,
          ]}
          textAlign="right"
          placeholderTextColor={Colors.textSecondary}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          multiline={multiline}
          {...rest}
        />

        {suffix && (
          <TouchableOpacity
            onPress={onSuffixPress}
            disabled={!onSuffixPress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.suffix}>{suffix}</Text>
          </TouchableOpacity>
        )}
      </View>

      {error
        ? <Text style={styles.error}>{error}</Text>
        : hint ? <Text style={styles.hint}>{hint}</Text> : null
      }
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    gap: 8,
  },
  focused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  errorBorder: { borderColor: Colors.error },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  prefix: { fontSize: 18, color: Colors.textSecondary },
  suffix: { fontSize: 18, color: Colors.textSecondary },
  error: {
    fontSize: FontSize.xs,
    color: Colors.error,
    textAlign: 'right',
    fontWeight: '600',
  },
  hint: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
});
