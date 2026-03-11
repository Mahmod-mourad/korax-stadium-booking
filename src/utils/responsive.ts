/**
 * responsive.ts
 * ─────────────────────────────────────────────
 * أدوات الـ responsive للتأكد أن التطبيق يشتغل
 * صح على كل الأجهزة (صغيرة وكبيرة، iOS وAndroid)
 *
 * Base design reference: iPhone 14 → 390 × 844
 */

import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: W, height: H } = Dimensions.get('window');

const BASE_W = 390;
const BASE_H = 844;

/** تكبير/تصغير بناءً على عرض الشاشة */
export const scale = (size: number) => Math.round((W / BASE_W) * size);

/** تكبير/تصغير بناءً على ارتفاع الشاشة */
export const vscale = (size: number) => Math.round((H / BASE_H) * size);

/**
 * Moderate scale – ينمو بشكل أبطأ من scale العادي
 * مثالي للخطوط حتى لا تصبح كبيرة جداً على الأجهزة الكبيرة
 */
export const mscale = (size: number, factor = 0.5) =>
  Math.round(size + (scale(size) - size) * factor);

/** نسبة مئوية من عرض الشاشة */
export const wp = (pct: number) => (pct / 100) * W;

/** نسبة مئوية من ارتفاع الشاشة */
export const hp = (pct: number) => (pct / 100) * H;

export const SCREEN_W = W;
export const SCREEN_H = H;

/**
 * Hook: الـ top padding الصحيح للـ header
 * بيحسب ارتفاع الـ status bar تلقائياً على كل جهاز
 * – على iPhone X وما فوق: الـ notch يُحسب
 * – على Android: الـ status bar يُحسب
 */
export function useHeaderTop() {
  const insets = useSafeAreaInsets();
  return insets.top + 10;
}

/**
 * Hook: الـ padding السفلي الآمن
 * مفيد لـ bottom buttons وTab bars
 */
export function useBottomSafe(extra = 0) {
  const insets = useSafeAreaInsets();
  return insets.bottom + extra;
}
