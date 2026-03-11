/**
 * useAuth — hook لإدارة المصادقة
 *
 * يجمع:
 *  - حالة تسجيل الدخول
 *  - بيانات المستخدم الحالي
 *  - تسجيل الدخول (mock: OTP)
 *  - تسجيل الخروج مع تنظيف الـ storage
 *
 * ملاحظة: الـ OTP الحقيقي يحتاج SMS provider
 * حالياً الـ OTP ثابت = '1234' للتطوير
 */
import { useStore } from '../store';
import { User, UserRole } from '../types';
import { Storage, STORAGE_KEYS } from '../services/storage';

const DEV_OTP = '1234'; // ← يُستبدل بـ SMS provider في الإنتاج

export function useAuth() {
  const { user, isAuthenticated, setUser, logout: storeLogout, setFirstLaunch } = useStore();

  /**
   * الخطوة 1: إرسال OTP (mock)
   * في الإنتاج: استدعاء SMS API
   */
  function sendOTP(phone: string): Promise<boolean> {
    console.log(`[Auth] OTP for ${phone}: ${DEV_OTP}`);
    return Promise.resolve(true);
  }

  /**
   * الخطوة 2: التحقق من OTP
   * returns: true = صحيح، false = خطأ
   */
  function verifyOTP(otp: string): boolean {
    return otp === DEV_OTP;
  }

  /**
   * الخطوة 3: إنهاء التسجيل — تحديد الاسم والدور
   */
  async function completeRegistration(params: {
    phone: string;
    name: string;
    role: UserRole;
  }): Promise<User> {
    const newUser: User = {
      id: `user_${Date.now()}`,
      phone: params.phone,
      name: params.name,
      role: params.role,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    await Storage.set(STORAGE_KEYS.USER, newUser);
    await Storage.set(STORAGE_KEYS.FIRST_LAUNCH, false);
    return newUser;
  }

  /**
   * تسجيل الخروج مع تنظيف بيانات المستخدم من الـ storage
   */
  async function logout() {
    await Storage.remove(STORAGE_KEYS.USER);
    storeLogout();
  }

  /**
   * استعادة الجلسة من AsyncStorage عند فتح التطبيق
   * يُستدعى في App.tsx
   */
  async function restoreSession(): Promise<boolean> {
    const savedUser = await Storage.get<User>(STORAGE_KEYS.USER);
    if (savedUser) {
      setUser(savedUser);
      return true;
    }
    const isFirst = await Storage.get<boolean>(STORAGE_KEYS.FIRST_LAUNCH);
    setFirstLaunch(isFirst === null); // null = أول مرة
    return false;
  }

  return {
    user,
    isAuthenticated,
    isOwner: user?.role === 'owner',
    isPlayer: user?.role === 'player',
    sendOTP,
    verifyOTP,
    completeRegistration,
    logout,
    restoreSession,
  };
}
