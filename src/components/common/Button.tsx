/**
 * Button — زر متعدد الأنواع
 *
 * variants:
 *   primary  → خلفية خضراء (الإجراء الأساسي)
 *   secondary → خلفية navy (إجراء ثانوي)
 *   outline   → بدون خلفية، حافة خضراء
 *   ghost     → بدون خلفية ولا حافة
 *   danger    → خلفية حمراء (الحذف / الإلغاء)
 *
 * sizes:
 *   sm | md | lg
 */
import React from 'react';
import {
  TouchableOpacity, Text, StyleSheet, ActivityIndicator,
  View, StyleProp, ViewStyle, TextStyle,
} from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '../../theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;           // emoji أو أي نص قبل الـ label
  iconRight?: string;      // emoji أو أي نص بعد الـ label
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconRight,
  fullWidth = true,
  style,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[`size_${size}`],
        styles[`variant_${variant}`],
        isDisabled && styles.disabled,
        fullWidth && styles.fullWidth,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? Colors.primary : '#fff'}
          size="small"
        />
      ) : (
        <View style={styles.row}>
          {icon && <Text style={[styles.icon, styles[`text_${variant}`]]}>{icon} </Text>}
          <Text style={[styles.text, styles[`text_${variant}`], styles[`textSize_${size}`], textStyle]}>
            {label}
          </Text>
          {iconRight && <Text style={[styles.icon, styles[`text_${variant}`]]}> {iconRight}</Text>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: { width: '100%' },
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 16 },

  // ── Sizes ──────────────────────────────────
  size_sm: { paddingVertical: 8,  paddingHorizontal: 16 },
  size_md: { paddingVertical: 13, paddingHorizontal: 24 },
  size_lg: { paddingVertical: 17, paddingHorizontal: 32 },

  // ── Variants (container) ──────────────────
  variant_primary:   { backgroundColor: Colors.primary },
  variant_secondary: { backgroundColor: Colors.secondary },
  variant_outline:   { backgroundColor: 'transparent', borderWidth: 2, borderColor: Colors.primary },
  variant_ghost:     { backgroundColor: 'transparent' },
  variant_danger:    { backgroundColor: Colors.error },

  // ── Variants (text) ───────────────────────
  text_primary:   { color: '#fff' },
  text_secondary: { color: '#fff' },
  text_outline:   { color: Colors.primary },
  text_ghost:     { color: Colors.primary },
  text_danger:    { color: '#fff' },

  // ── Text sizes ────────────────────────────
  text: { fontWeight: '800' },
  textSize_sm: { fontSize: FontSize.sm },
  textSize_md: { fontSize: FontSize.md },
  textSize_lg: { fontSize: FontSize.lg },

  disabled: { opacity: 0.45 },
} as any);
