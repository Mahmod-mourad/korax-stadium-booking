/**
 * LoadingOverlay — شاشة تحميل
 *
 * variants:
 *   fullscreen → يغطي الشاشة كلها (modal)
 *   inline     → داخل container بحجم محدد
 *   overlay    → طبقة شفافة فوق المحتوى
 */
import React from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, Modal,
} from 'react-native';
import { Colors, FontSize, Spacing } from '../../theme';

type LoadingVariant = 'fullscreen' | 'inline' | 'overlay';

interface LoadingOverlayProps {
  visible: boolean;
  variant?: LoadingVariant;
  message?: string;
}

export function LoadingOverlay({
  visible,
  variant = 'inline',
  message,
}: LoadingOverlayProps) {
  if (!visible) return null;

  const content = (
    <View style={[styles.content, variant === 'overlay' && styles.overlayContent]}>
      <ActivityIndicator size="large" color={Colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );

  if (variant === 'fullscreen') {
    return (
      <Modal transparent visible={visible} animationType="fade">
        <View style={styles.modal}>{content}</View>
      </Modal>
    );
  }

  if (variant === 'overlay') {
    return <View style={styles.overlayWrapper}>{content}</View>;
  }

  // inline
  return content;
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  overlayContent: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  message: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
