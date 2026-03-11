/**
 * Header — هيدر شاشة موحّد
 *
 * يدعم:
 *  - زر رجوع (اختياري)
 *  - عنوان
 *  - زر إجراء على اليسار (أيقونة أو نص)
 *  - variant: light (خلفية بيضاء) | dark (خلفية navy)
 */
import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar,
} from 'react-native';
import { Colors, FontSize, Shadow, Spacing } from '../../theme';

type HeaderVariant = 'light' | 'dark';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightLabel?: string;
  onRight?: () => void;
  variant?: HeaderVariant;
  /** أيقونة بجانب الرجوع — اختياري */
  subtitle?: string;
}

export function Header({
  title,
  onBack,
  rightLabel,
  onRight,
  variant = 'light',
  subtitle,
}: HeaderProps) {
  const isDark = variant === 'dark';

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? Colors.secondary : Colors.surface}
      />
      <View style={[styles.header, isDark ? styles.headerDark : styles.headerLight]}>
        {/* يسار: زر الرجوع */}
        <View style={styles.side}>
          {onBack && (
            <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={[styles.backText, isDark && styles.backTextDark]}>← رجوع</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* وسط: العنوان */}
        <View style={styles.center}>
          <Text
            style={[styles.title, isDark && styles.titleDark]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>{subtitle}</Text>
          )}
        </View>

        {/* يمين: زر الإجراء */}
        <View style={styles.side}>
          {rightLabel && onRight && (
            <TouchableOpacity onPress={onRight} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.rightText}>{rightLabel}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 52,
    paddingBottom: Spacing.md,
    ...Shadow.header,
  },
  headerLight: { backgroundColor: Colors.surface },
  headerDark:  { backgroundColor: Colors.secondary },

  side:   { width: 70 },
  center: { flex: 1, alignItems: 'center' },

  title: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
  },
  titleDark: { color: Colors.textLight },

  subtitle: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  subtitleDark: { color: 'rgba(255,255,255,0.6)' },

  backText: { color: Colors.primary, fontSize: FontSize.md, fontWeight: '600' },
  backTextDark: { color: Colors.primaryLight },

  rightText: { color: Colors.primary, fontSize: FontSize.md, fontWeight: '700' },
});
