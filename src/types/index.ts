// ─────────────────────────────────────────────
// ENUMS & UNION TYPES
// ─────────────────────────────────────────────

export type UserRole = 'player' | 'owner';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export type MatchLevel = 'beginner' | 'intermediate' | 'advanced' | 'any';

export type MatchStatus = 'open' | 'full' | 'cancelled';

export type NotificationType =
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'match_open'
  | 'match_full'
  | 'reminder'
  | 'discount'
  | 'general';

export type StadiumCategory = 'small' | 'medium' | 'large';

export type StadiumSurface = 'grass' | 'artificial' | 'dirt';

/** طريقة الدفع */
export type PaymentMethod = 'vodafone_cash' | 'fawry' | 'cash_on_site' | 'card';

/** حالة الملعب في النظام */
export type StadiumStatus = 'pending_review' | 'active' | 'suspended';

// ─────────────────────────────────────────────
// CORE MODELS
// ─────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  profilePhoto?: string;
  role: UserRole;
  createdAt: string;
  /** عدد الحجوزات الكاملة – يُحسب من قائمة الحجوزات */
  totalBookings?: number;
}

export interface Stadium {
  id: string;
  name: string;
  location: string;
  latitude?: number;
  longitude?: number;
  pricePerHour: number;
  photos: string[];
  rating: number;          // متوسط مُحسوب
  totalRatings: number;
  ownerId: string;
  ownerContact: string;
  discount?: number;       // نسبة مئوية 0-100
  category: StadiumCategory;
  surface: StadiumSurface;
  /** المواعيد المتاحة – تُملأ ديناميكياً عند طلب يوم معين */
  availability: TimeSlot[];
  description?: string;
  amenities?: string[];
  status: StadiumStatus;   // ← جديد: حالة الملعب
  openingHour: number;     // ← جديد: ساعة الفتح (0-23)
  closingHour: number;     // ← جديد: ساعة الإغلاق (0-23)
  createdAt: string;       // ← جديد
}

export interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  bookingId?: string;
}

export interface Booking {
  id: string;
  stadiumId: string;
  stadiumName: string;
  stadiumPhoto?: string;
  playerId: string;
  playerName: string;
  date: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  stadiumPrice: number;    // سعر الملعب لكل ساعة
  bookingFee: number;      // رسوم KoraX الثابتة = 20 جنيه
  totalAmount: number;     // (stadiumPrice × durationHours) + bookingFee
  status: BookingStatus;
  paymentMethod?: PaymentMethod;  // ← جديد
  paymentStatus: 'paid' | 'unpaid'; // ← جديد: حالة الدفع
  createdAt: string;
}

export interface MatchRequest {
  id: string;
  stadiumId: string;
  stadiumName: string;
  stadiumLocation: string;
  organizerId: string;
  organizerName: string;
  date: string;
  startTime: string;
  endTime: string;
  playersNeeded: number;   // العدد المطلوب من اللاعبين الإضافيين
  currentPlayers: number;  // اللاعبون الموجودون حالياً
  totalPlayers: number;    // ← جديد: العدد الكلي للمباراة (11 vs 11 مثلاً)
  level: MatchLevel;
  description?: string;
  participants: string[];  // IDs المشاركين
  status: MatchStatus;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  isRead: boolean;
  /** رابط للشاشة المرتبطة بالإشعار – اختياري */
  relatedId?: string;      // ← جديد: stadiumId أو bookingId
  createdAt: string;
}

/**
 * تقييم مُفصَّل للملعب
 * الأبعاد: جودة الأرضية، الإضاءة، التنظيم
 */
export interface Rating {
  id: string;
  stadiumId: string;
  bookingId: string;       // ← جديد: مرتبط بحجز معين (يمنع التقييم بدون حجز)
  playerId: string;
  playerName: string;
  score: number;           // 1-5 إجمالي
  surfaceScore?: number;   // ← جديد: تقييم الأرضية
  lightingScore?: number;  // ← جديد: تقييم الإضاءة
  organizationScore?: number; // ← جديد: تقييم التنظيم
  comment?: string;
  createdAt: string;
}

/**
 * سجل معاملة مالية
 * كل دفع أو استرداد يُسجَّل هنا
 */
export interface Transaction {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  type: 'payment' | 'refund';
  method: PaymentMethod;
  status: 'success' | 'failed' | 'pending';
  description: string;     // نص قصير مثل "حجز ملعب النصر"
  createdAt: string;
}

// ─────────────────────────────────────────────
// NAVIGATION TYPES
// ─────────────────────────────────────────────

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  PlayerTabs: undefined;
  OwnerTabs: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  OTP: { phone: string };
  SelectRole: { phone: string; name: string };
};

export type PlayerTabParamList = {
  Home: undefined;
  Matches: undefined;
  Notifications: undefined;
  Profile: undefined;
};

export type PlayerStackParamList = {
  PlayerTabs: undefined;
  StadiumDetails: { stadiumId: string };
  Booking: { stadiumId: string };
  BookingConfirmation: { bookingId: string };
  BookingHistory: undefined;
  RateStadium: { bookingId: string; stadiumId: string };
  AllStadiums: undefined;
  EditProfile: undefined;
  HelpSupport: undefined;
};

export type OwnerTabParamList = {
  OwnerDashboard: undefined;
  MyStadiums: undefined;
  OwnerBookings: undefined;
  OwnerStats: undefined;
};

export type OwnerStackParamList = {
  OwnerTabs: undefined;
  AddStadium: undefined;
  EditStadium: { stadiumId: string };
  StadiumBookings: { stadiumId: string };
  HelpSupport: undefined;
};

// ─────────────────────────────────────────────
// UI / FILTER HELPERS
// ─────────────────────────────────────────────

/** فلتر البحث المتقدم في شاشة الملاعب */
export interface StadiumFilter {
  category?: StadiumCategory | 'all';
  surface?: StadiumSurface | 'all';
  maxPrice?: number;
  minRating?: number;
  hasDiscount?: boolean;
  searchQuery?: string;
}
