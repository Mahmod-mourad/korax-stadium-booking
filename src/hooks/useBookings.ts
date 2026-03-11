/**
 * useBookings — hook لإدارة الحجوزات
 *
 * يجمع:
 *  - حجوزات المستخدم الحالي
 *  - إنشاء حجز جديد مع حساب الرسوم تلقائياً
 *  - إلغاء حجز (مع التحقق من القابلية)
 *  - إنشاء transaction للحجز
 *  - إضافة إشعار تأكيد
 */
import { useStore } from '../store';
import { Booking, Transaction } from '../types';
import { BOOKING_FEE, calculateBookingTotal, getTimeEndSlot } from '../utils/helpers';

export function useBookings() {
  const {
    bookings,
    addBooking,
    cancelBooking,
    getMyBookings,
    getOwnerBookings,
    addTransaction,
    addNotification,
    user,
    hasRated,
  } = useStore();

  const myBookings = getMyBookings();

  /**
   * إنشاء حجز جديد وإرسال إشعار التأكيد
   *
   * @param stadiumId
   * @param stadiumName
   * @param stadiumPhoto
   * @param stadiumPrice - سعر الملعب / ساعة
   * @param date         - 'YYYY-MM-DD'
   * @param selectedSlots - مصفوفة الـ slots المختارة ['18:00','19:00']
   * @returns bookingId
   */
  function createBooking(params: {
    stadiumId: string;
    stadiumName: string;
    stadiumPhoto?: string;
    stadiumPrice: number;
    date: string;
    selectedSlots: string[];
  }): string {
    if (!user) throw new Error('يجب تسجيل الدخول أولاً');

    const { stadiumId, stadiumName, stadiumPhoto, stadiumPrice, date, selectedSlots } = params;
    const durationHours = selectedSlots.length;
    const { total } = calculateBookingTotal(stadiumPrice, durationHours);

    const bookingId = `b_${Date.now()}`;
    const now = new Date().toISOString();

    // ── الحجز ───────────────────────────────
    const booking: Booking = {
      id: bookingId,
      stadiumId,
      stadiumName,
      stadiumPhoto,
      playerId: user.id,
      playerName: user.name,
      date,
      startTime: selectedSlots[0],
      endTime: getTimeEndSlot(selectedSlots[selectedSlots.length - 1], 1),
      durationHours,
      stadiumPrice,
      bookingFee: BOOKING_FEE,
      totalAmount: total,
      status: 'confirmed',
      paymentMethod: 'vodafone_cash', // default — يُغيَّر عند ربط payment gateway
      paymentStatus: 'paid',
      createdAt: now,
    };
    addBooking(booking);

    // ── Transaction ──────────────────────────
    const tx: Transaction = {
      id: `t_${Date.now()}`,
      bookingId,
      userId: user.id,
      amount: total,
      type: 'payment',
      method: 'vodafone_cash',
      status: 'success',
      description: `حجز ${stadiumName} – ${date}`,
      createdAt: now,
    };
    addTransaction(tx);

    // ── إشعار التأكيد ──────────────────────
    addNotification({
      id: `n_${Date.now()}`,
      userId: user.id,
      title: 'تأكيد الحجز ✅',
      body: `تم تأكيد حجزك في ${stadiumName} يوم ${date}`,
      type: 'booking_confirmed',
      isRead: false,
      relatedId: bookingId,
      createdAt: now,
    });

    return bookingId;
  }

  /** إحصائيات سريعة للمستخدم */
  const stats = {
    total: myBookings.length,
    confirmed: myBookings.filter((b) => b.status === 'confirmed').length,
    completed: myBookings.filter((b) => b.status === 'completed').length,
    cancelled: myBookings.filter((b) => b.status === 'cancelled').length,
    totalSpent: myBookings
      .filter((b) => b.status === 'completed' || b.status === 'confirmed')
      .reduce((sum, b) => sum + b.totalAmount, 0),
  };

  return {
    bookings,
    myBookings,
    createBooking,
    cancelBooking,
    getOwnerBookings,
    hasRated,
    stats,
  };
}
