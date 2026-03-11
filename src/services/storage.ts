/**
 * StorageService — wrapper نظيف على AsyncStorage
 *
 * ليش؟
 *  1. AsyncStorage الأصلي يتعامل مع strings فقط — هنا بنعمل
 *     serialize/deserialize تلقائياً
 *  2. error handling مركزي بدل try/catch في كل مكان
 *  3. سهل الاستبدال بـ SecureStore أو SQLite في المستقبل
 *
 * الاستخدام:
 *   await Storage.set('user', userObject);
 *   const user = await Storage.get<User>('user');
 *   await Storage.remove('user');
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── مفاتيح ثابتة — لا magic strings في الكود ──────────────
export const STORAGE_KEYS = {
  USER:         '@korax/user',
  FIRST_LAUNCH: '@korax/first_launch',
  BOOKINGS:     '@korax/bookings',
  NOTIFICATIONS:'@korax/notifications',
  RATINGS:      '@korax/ratings',
  TRANSACTIONS: '@korax/transactions',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

// ─────────────────────────────────────────────
// STORAGE SERVICE
// ─────────────────────────────────────────────

export const Storage = {

  /**
   * يحفظ قيمة بعد تحويلها لـ JSON
   * يرجع true إذا نجح، false إذا فشل
   */
  async set<T>(key: StorageKey, value: T): Promise<boolean> {
    try {
      const json = JSON.stringify(value);
      await AsyncStorage.setItem(key, json);
      return true;
    } catch (e) {
      console.warn(`[Storage] set "${key}" failed:`, e);
      return false;
    }
  },

  /**
   * يقرأ قيمة ويحوّلها من JSON
   * يرجع null إذا مش موجودة أو فشل التحليل
   */
  async get<T>(key: StorageKey): Promise<T | null> {
    try {
      const json = await AsyncStorage.getItem(key);
      if (json == null) return null;
      return JSON.parse(json) as T;
    } catch (e) {
      console.warn(`[Storage] get "${key}" failed:`, e);
      return null;
    }
  },

  /**
   * يحذف قيمة
   */
  async remove(key: StorageKey): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn(`[Storage] remove "${key}" failed:`, e);
      return false;
    }
  },

  /**
   * يتحقق إذا كانت المفتاح موجوداً
   */
  async has(key: StorageKey): Promise<boolean> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys.includes(key);
    } catch {
      return false;
    }
  },

  /**
   * يمسح كل البيانات (logout / reset)
   */
  async clearAll(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (e) {
      console.warn('[Storage] clearAll failed:', e);
      return false;
    }
  },

  /**
   * Helper: يرجع قيمة أو الـ fallback إذا مش موجودة
   */
  async getOrDefault<T>(key: StorageKey, fallback: T): Promise<T> {
    const value = await Storage.get<T>(key);
    return value ?? fallback;
  },
};
