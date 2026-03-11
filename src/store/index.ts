import { create } from 'zustand';
import {
  User, Stadium, Booking, MatchRequest, Notification,
  Rating, Transaction, StadiumFilter,
} from '../types';
import {
  MOCK_STADIUMS, MOCK_BOOKINGS, MOCK_MATCHES,
  MOCK_NOTIFICATIONS, MOCK_RATINGS, MOCK_TRANSACTIONS,
} from '../utils/mockData';

// ─────────────────────────────────────────────
// STATE INTERFACE
// ─────────────────────────────────────────────

interface AppState {

  // ── Auth ────────────────────────────────────
  user: User | null;
  isAuthenticated: boolean;
  isFirstLaunch: boolean;
  setUser: (user: User | null) => void;
  setFirstLaunch: (value: boolean) => void;
  logout: () => void;

  // ── Stadiums ────────────────────────────────
  stadiums: Stadium[];
  /** فلتر البحث الحالي */
  filter: StadiumFilter;
  setFilter: (filter: Partial<StadiumFilter>) => void;
  resetFilter: () => void;
  /** إرجاع الملاعب بعد تطبيق الفلتر */
  getFilteredStadiums: () => Stadium[];
  /** إضافة ملعب جديد (صاحب الملعب) */
  addStadium: (stadium: Stadium) => void;
  /** تعديل ملعب موجود */
  updateStadium: (stadiumId: string, updates: Partial<Stadium>) => void;
  /** ملاعب صاحب الملعب المسجل */
  getOwnerStadiums: () => Stadium[];

  // ── Bookings ────────────────────────────────
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  /** إلغاء حجز – فقط الحجوزات 'pending' قابلة للإلغاء (الـ confirmed غير قابل بعد الدفع) */
  cancelBooking: (bookingId: string) => void;
  /** حجوزات اللاعب الحالي */
  getMyBookings: () => Booking[];
  /** حجوزات ملاعب صاحب الملعب */
  getOwnerBookings: () => Booking[];

  // ── Matches ────────────────────────────────
  matches: MatchRequest[];
  addMatch: (match: MatchRequest) => void;
  joinMatch: (matchId: string, userId: string) => void;

  // ── Notifications ───────────────────────────
  notifications: Notification[];
  /** عدد الإشعارات غير المقروءة – يُحسب دائماً من القائمة */
  getUnreadCount: () => number;
  markAsRead: (notifId: string) => void;
  markAllAsRead: () => void;
  addNotification: (notif: Notification) => void;

  // ── Ratings ────────────────────────────────
  ratings: Rating[];
  addRating: (rating: Rating) => void;
  /** تقييمات ملعب معين */
  getStadiumRatings: (stadiumId: string) => Rating[];
  /** هل قيّم هذا اللاعب هذا الحجز؟ */
  hasRated: (bookingId: string) => boolean;

  // ── Transactions ────────────────────────────
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  /** معاملات المستخدم الحالي */
  getMyTransactions: () => Transaction[];
}

// ─────────────────────────────────────────────
// DEFAULT FILTER
// ─────────────────────────────────────────────

const DEFAULT_FILTER: StadiumFilter = {
  category: 'all',
  surface: 'all',
  searchQuery: '',
  hasDiscount: false,
};

// ─────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────

export const useStore = create<AppState>((set, get) => ({

  // ── Auth ────────────────────────────────────

  /**
   * في التطوير: مستخدم افتراضي معتمد
   * في الإنتاج: يُستبدل بـ null وتتحقق من AsyncStorage
   */
  user: {
    id: 'player1',
    name: 'أحمد محمد',
    phone: '01012345678',
    email: 'ahmed@example.com',
    role: 'player',
    createdAt: '2026-01-01',
  },
  isAuthenticated: true,
  isFirstLaunch: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setFirstLaunch: (value) => set({ isFirstLaunch: value }),
  logout: () => set({
    user: null,
    isAuthenticated: false,
    bookings: MOCK_BOOKINGS,  // إعادة ضبط البيانات عند الخروج
  }),

  // ── Stadiums ────────────────────────────────

  stadiums: MOCK_STADIUMS,
  filter: DEFAULT_FILTER,

  setFilter: (partial) =>
    set((state) => ({ filter: { ...state.filter, ...partial } })),

  resetFilter: () => set({ filter: DEFAULT_FILTER }),

  getFilteredStadiums: () => {
    const { stadiums, filter } = get();
    return stadiums
      .filter((s) => s.status === 'active')  // فقط الملاعب النشطة
      .filter((s) => {
        // ── نص البحث
        const q = filter.searchQuery?.toLowerCase() ?? '';
        if (q && !s.name.includes(q) && !s.location.includes(q)) return false;

        // ── الفئة
        if (filter.category && filter.category !== 'all' && s.category !== filter.category) return false;

        // ── نوع الأرضية
        if (filter.surface && filter.surface !== 'all' && s.surface !== filter.surface) return false;

        // ── الحد الأقصى للسعر
        if (filter.maxPrice && s.pricePerHour > filter.maxPrice) return false;

        // ── الحد الأدنى للتقييم
        if (filter.minRating && s.rating < filter.minRating) return false;

        // ── ملاعب بخصم فقط
        if (filter.hasDiscount && !s.discount) return false;

        return true;
      });
  },

  addStadium: (stadium) =>
    set((state) => ({ stadiums: [...state.stadiums, stadium] })),

  updateStadium: (stadiumId, updates) =>
    set((state) => ({
      stadiums: state.stadiums.map((s) =>
        s.id === stadiumId ? { ...s, ...updates } : s
      ),
    })),

  getOwnerStadiums: () => {
    const { stadiums, user } = get();
    return stadiums.filter((s) => s.ownerId === user?.id);
  },

  // ── Bookings ────────────────────────────────

  bookings: MOCK_BOOKINGS,

  addBooking: (booking) =>
    set((state) => ({ bookings: [booking, ...state.bookings] })),

  /**
   * الحجز غير قابل للإلغاء بعد الدفع (status = 'confirmed')
   * فقط الحجوزات 'pending' يمكن إلغاؤها
   */
  cancelBooking: (bookingId) =>
    set((state) => ({
      bookings: state.bookings.map((b) => {
        if (b.id !== bookingId) return b;
        if (b.status === 'confirmed' || b.status === 'completed') return b; // لا إلغاء بعد الدفع
        return { ...b, status: 'cancelled' };
      }),
    })),

  getMyBookings: () => {
    const { bookings, user } = get();
    return bookings.filter((b) => b.playerId === user?.id);
  },

  getOwnerBookings: () => {
    const { bookings, stadiums, user } = get();
    const ownerStadiumIds = stadiums
      .filter((s) => s.ownerId === user?.id)
      .map((s) => s.id);
    return bookings.filter((b) => ownerStadiumIds.includes(b.stadiumId));
  },

  // ── Matches ────────────────────────────────

  matches: MOCK_MATCHES,

  addMatch: (match) =>
    set((state) => ({ matches: [match, ...state.matches] })),

  joinMatch: (matchId, userId) =>
    set((state) => ({
      matches: state.matches.map((m) => {
        if (m.id !== matchId) return m;
        if (m.participants.includes(userId)) return m;  // لا تضاف مرتين

        const newCurrentPlayers = m.currentPlayers + 1;
        const spotsRemaining = m.playersNeeded - (newCurrentPlayers - (m.totalPlayers - m.playersNeeded));
        // اكتمال الماتش = currentPlayers وصل لـ totalPlayers
        const isFull = newCurrentPlayers >= m.totalPlayers;

        return {
          ...m,
          participants: [...m.participants, userId],
          currentPlayers: newCurrentPlayers,
          status: isFull ? 'full' : 'open',
        };
      }),
    })),

  // ── Notifications ───────────────────────────

  notifications: MOCK_NOTIFICATIONS,

  /** يُحسب دائماً من الـ state الحالية — لا getter قديم */
  getUnreadCount: () => get().notifications.filter((n) => !n.isRead).length,

  markAsRead: (notifId) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notifId ? { ...n, isRead: true } : n
      ),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    })),

  addNotification: (notif) =>
    set((state) => ({ notifications: [notif, ...state.notifications] })),

  // ── Ratings ────────────────────────────────

  ratings: MOCK_RATINGS,

  addRating: (rating) =>
    set((state) => {
      const newRatings = [rating, ...state.ratings];

      // إعادة حساب متوسط تقييم الملعب
      const stadiumRatings = newRatings.filter((r) => r.stadiumId === rating.stadiumId);
      const avgScore = stadiumRatings.reduce((sum, r) => sum + r.score, 0) / stadiumRatings.length;

      return {
        ratings: newRatings,
        stadiums: state.stadiums.map((s) =>
          s.id === rating.stadiumId
            ? { ...s, rating: Math.round(avgScore * 10) / 10, totalRatings: stadiumRatings.length }
            : s
        ),
      };
    }),

  getStadiumRatings: (stadiumId) =>
    get().ratings.filter((r) => r.stadiumId === stadiumId),

  hasRated: (bookingId) =>
    get().ratings.some((r) => r.bookingId === bookingId),

  // ── Transactions ────────────────────────────

  transactions: MOCK_TRANSACTIONS,

  addTransaction: (tx) =>
    set((state) => ({ transactions: [tx, ...state.transactions] })),

  getMyTransactions: () => {
    const { transactions, user } = get();
    return transactions.filter((t) => t.userId === user?.id);
  },
}));
