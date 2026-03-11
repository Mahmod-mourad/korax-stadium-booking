import { Stadium, Booking, MatchRequest, Notification, Rating, Transaction } from '../types';

// ─────────────────────────────────────────────
// STADIUMS
// ─────────────────────────────────────────────

export const MOCK_STADIUMS: Stadium[] = [
  {
    id: '1',
    name: 'ملعب النصر',
    location: 'المعادي، القاهرة',
    latitude: 29.9592,
    longitude: 31.2609,
    pricePerHour: 150,
    photos: [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800',
    ],
    rating: 4.5,
    totalRatings: 128,
    ownerId: 'owner1',
    ownerContact: '01012345678',
    discount: 20,
    category: 'medium',
    surface: 'artificial',
    status: 'active',
    openingHour: 8,
    closingHour: 24,
    description: 'ملعب مجهز بالكامل بإضاءة ليلية وأرضية عشبية صناعية عالية الجودة',
    amenities: ['إضاءة ليلية', 'غرف تغيير ملابس', 'كافيتيريا', 'مواقف سيارات'],
    availability: [],
    createdAt: '2025-01-01',
  },
  {
    id: '2',
    name: 'ملعب الأهلي',
    location: 'مدينة نصر، القاهرة',
    latitude: 30.0626,
    longitude: 31.3219,
    pricePerHour: 200,
    photos: [
      'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800',
      'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800',
    ],
    rating: 4.8,
    totalRatings: 256,
    ownerId: 'owner2',
    ownerContact: '01098765432',
    category: 'large',
    surface: 'grass',
    status: 'active',
    openingHour: 7,
    closingHour: 23,
    description: 'أفضل ملعب في المنطقة بأرضية عشبية طبيعية',
    amenities: ['إضاءة ليلية', 'غرف تغيير ملابس', 'دش', 'مدرج'],
    availability: [],
    createdAt: '2025-01-15',
  },
  {
    id: '3',
    name: 'ملعب الزمالك',
    location: 'الهرم، الجيزة',
    latitude: 29.9734,
    longitude: 31.1304,
    pricePerHour: 100,
    photos: [
      'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800',
    ],
    rating: 4.2,
    totalRatings: 89,
    ownerId: 'owner3',
    ownerContact: '01011112222',
    discount: 30,
    category: 'small',
    surface: 'artificial',
    status: 'active',
    openingHour: 9,
    closingHour: 23,
    description: 'ملعب صغير مناسب للمباريات السريعة',
    amenities: ['إضاءة ليلية', 'كافيتيريا'],
    availability: [],
    createdAt: '2025-02-01',
  },
  {
    id: '4',
    name: 'ملعب النيل',
    location: 'شبرا، القاهرة',
    latitude: 30.1127,
    longitude: 31.2442,
    pricePerHour: 120,
    photos: [
      'https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=800',
    ],
    rating: 3.9,
    totalRatings: 64,
    ownerId: 'owner4',
    ownerContact: '01033334444',
    category: 'medium',
    surface: 'artificial',
    status: 'active',
    openingHour: 8,
    closingHour: 22,
    description: 'ملعب حديث في قلب شبرا',
    amenities: ['إضاءة ليلية', 'مواقف سيارات'],
    availability: [],
    createdAt: '2025-02-10',
  },
  {
    id: '5',
    name: 'ملعب الفتح',
    location: 'عين شمس، القاهرة',
    latitude: 30.1326,
    longitude: 31.3264,
    pricePerHour: 80,
    photos: [
      'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800',
    ],
    rating: 4.0,
    totalRatings: 42,
    ownerId: 'owner5',
    ownerContact: '01055556666',
    discount: 15,
    category: 'small',
    surface: 'dirt',
    status: 'active',
    openingHour: 10,
    closingHour: 22,
    description: 'ملعب اقتصادي بسعر مناسب',
    amenities: ['إضاءة ليلية'],
    availability: [],
    createdAt: '2025-03-01',
  },
];

// ─────────────────────────────────────────────
// BOOKINGS
// ─────────────────────────────────────────────

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    stadiumId: '1',
    stadiumName: 'ملعب النصر',
    stadiumPhoto: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    playerId: 'player1',
    playerName: 'أحمد محمد',
    date: '2026-03-15',
    startTime: '18:00',
    endTime: '20:00',
    durationHours: 2,
    stadiumPrice: 150,
    bookingFee: 20,
    totalAmount: 320,  // (150 × 2) + 20
    status: 'confirmed',
    paymentMethod: 'vodafone_cash',
    paymentStatus: 'paid',
    createdAt: '2026-03-10T10:00:00Z',
  },
  {
    id: 'b2',
    stadiumId: '2',
    stadiumName: 'ملعب الأهلي',
    stadiumPhoto: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800',
    playerId: 'player1',
    playerName: 'أحمد محمد',
    date: '2026-03-08',
    startTime: '20:00',
    endTime: '22:00',
    durationHours: 2,
    stadiumPrice: 200,
    bookingFee: 20,
    totalAmount: 420,  // (200 × 2) + 20
    status: 'completed',
    paymentMethod: 'fawry',
    paymentStatus: 'paid',
    createdAt: '2026-03-05T14:00:00Z',
  },
  {
    id: 'b3',
    stadiumId: '3',
    stadiumName: 'ملعب الزمالك',
    stadiumPhoto: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800',
    playerId: 'player1',
    playerName: 'أحمد محمد',
    date: '2026-02-20',
    startTime: '17:00',
    endTime: '18:00',
    durationHours: 1,
    stadiumPrice: 100,
    bookingFee: 20,
    totalAmount: 120,
    status: 'completed',
    paymentMethod: 'vodafone_cash',
    paymentStatus: 'paid',
    createdAt: '2026-02-18T09:00:00Z',
  },
];

// ─────────────────────────────────────────────
// MATCHES
// ─────────────────────────────────────────────

export const MOCK_MATCHES: MatchRequest[] = [
  {
    id: 'm1',
    stadiumId: '1',
    stadiumName: 'ملعب النصر',
    stadiumLocation: 'المعادي، القاهرة',
    organizerId: 'player2',
    organizerName: 'محمود علي',
    date: '2026-03-12',
    startTime: '19:00',
    endTime: '21:00',
    playersNeeded: 5,
    currentPlayers: 7,
    totalPlayers: 12,
    level: 'intermediate',
    description: 'ماتش ودي، مستوى متوسط، مطلوب لاعبين محترمين',
    participants: ['player2', 'player3', 'player4', 'player5', 'player6', 'player7', 'player8'],
    status: 'open',
    createdAt: '2026-03-10T08:00:00Z',
  },
  {
    id: 'm2',
    stadiumId: '3',
    stadiumName: 'ملعب الزمالك',
    stadiumLocation: 'الهرم، الجيزة',
    organizerId: 'player9',
    organizerName: 'عمر خالد',
    date: '2026-03-13',
    startTime: '17:00',
    endTime: '19:00',
    playersNeeded: 3,
    currentPlayers: 9,
    totalPlayers: 12,
    level: 'beginner',
    description: 'ماتش للمبتدئين، جو خفيف ومرح',
    participants: ['player9', 'player10', 'player11', 'player12', 'player13', 'player14', 'player15', 'player16', 'player17'],
    status: 'open',
    createdAt: '2026-03-10T11:00:00Z',
  },
  {
    id: 'm3',
    stadiumId: '2',
    stadiumName: 'ملعب الأهلي',
    stadiumLocation: 'مدينة نصر، القاهرة',
    organizerId: 'player18',
    organizerName: 'كريم سامي',
    date: '2026-03-14',
    startTime: '21:00',
    endTime: '23:00',
    playersNeeded: 2,
    currentPlayers: 10,
    totalPlayers: 12,
    level: 'advanced',
    description: 'ماتش جدي، مستوى متقدم',
    participants: ['player18', 'player19', 'player20', 'player21', 'player22', 'player23', 'player24', 'player25', 'player26', 'player27'],
    status: 'open',
    createdAt: '2026-03-09T20:00:00Z',
  },
];

// ─────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    userId: 'player1',
    title: 'تأكيد الحجز',
    body: 'تم تأكيد حجزك في ملعب النصر يوم 15 مارس الساعة 6 مساءً',
    type: 'booking_confirmed',
    isRead: false,
    relatedId: 'b1',
    createdAt: '2026-03-10T10:05:00Z',
  },
  {
    id: 'n2',
    userId: 'player1',
    title: 'ماتش جديد قريب منك!',
    body: 'في ملعب الزمالك بالهرم، ناقصين 3 لاعبين - يوم الجمعة 5 مساءً',
    type: 'match_open',
    isRead: false,
    relatedId: 'm2',
    createdAt: '2026-03-10T11:30:00Z',
  },
  {
    id: 'n3',
    userId: 'player1',
    title: 'خصم 30% على ملعب الفتح',
    body: 'احجز الآن واستمتع بخصم 30% على الحجوزات الصباحية',
    type: 'discount',
    isRead: true,
    relatedId: '5',
    createdAt: '2026-03-09T09:00:00Z',
  },
  {
    id: 'n4',
    userId: 'player1',
    title: 'تذكير بموعد مباراتك',
    body: 'مباراتك في ملعب النصر بعد ساعتين — الساعة 6 مساءً',
    type: 'reminder',
    isRead: true,
    relatedId: 'b1',
    createdAt: '2026-03-15T16:00:00Z',
  },
];

// ─────────────────────────────────────────────
// RATINGS  ← جديد
// ─────────────────────────────────────────────

export const MOCK_RATINGS: Rating[] = [
  {
    id: 'r1',
    stadiumId: '2',
    bookingId: 'b2',
    playerId: 'player1',
    playerName: 'أحمد محمد',
    score: 5,
    surfaceScore: 5,
    lightingScore: 4,
    organizationScore: 5,
    comment: 'ملعب رائع، الأرضية ممتازة والإضاءة كويسة جداً',
    createdAt: '2026-03-09T10:00:00Z',
  },
  {
    id: 'r2',
    stadiumId: '3',
    bookingId: 'b3',
    playerId: 'player1',
    playerName: 'أحمد محمد',
    score: 4,
    surfaceScore: 4,
    lightingScore: 3,
    organizationScore: 4,
    comment: 'ملعب كويس بسعر مناسب، بس الإضاءة ممكن تتحسن',
    createdAt: '2026-02-21T09:00:00Z',
  },
  {
    id: 'r3',
    stadiumId: '1',
    bookingId: 'b_prev1',
    playerId: 'player2',
    playerName: 'محمود علي',
    score: 4,
    surfaceScore: 4,
    lightingScore: 5,
    organizationScore: 4,
    comment: 'ملعب منظم ونظيف',
    createdAt: '2026-03-01T15:00:00Z',
  },
];

// ─────────────────────────────────────────────
// TRANSACTIONS  ← جديد
// ─────────────────────────────────────────────

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    bookingId: 'b1',
    userId: 'player1',
    amount: 320,
    type: 'payment',
    method: 'vodafone_cash',
    status: 'success',
    description: 'حجز ملعب النصر – 15 مارس 2026',
    createdAt: '2026-03-10T10:02:00Z',
  },
  {
    id: 't2',
    bookingId: 'b2',
    userId: 'player1',
    amount: 420,
    type: 'payment',
    method: 'fawry',
    status: 'success',
    description: 'حجز ملعب الأهلي – 8 مارس 2026',
    createdAt: '2026-03-05T14:05:00Z',
  },
  {
    id: 't3',
    bookingId: 'b3',
    userId: 'player1',
    amount: 120,
    type: 'payment',
    method: 'vodafone_cash',
    status: 'success',
    description: 'حجز ملعب الزمالك – 20 فبراير 2026',
    createdAt: '2026-02-18T09:10:00Z',
  },
];

// ─────────────────────────────────────────────
// TIME SLOTS CONFIG
// ─────────────────────────────────────────────

/** كل الـ slots المتاحة نظرياً (6 صباحاً → 11 مساءً) */
export const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00',
  '11:00', '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00', '19:00', '20:00',
  '21:00', '22:00', '23:00',
];

/**
 * Slots المحجوزة لكل يوم – مفتاح = "stadiumId_date"
 * مثال: '1_2026-03-12' → ['18:00', '19:00']
 */
export const BOOKED_SLOTS: Record<string, string[]> = {
  '1_2026-03-12': ['18:00', '19:00', '20:00'],
  '1_2026-03-13': ['10:00', '11:00', '17:00', '18:00'],
  '2_2026-03-14': ['20:00', '21:00', '22:00'],
  '3_2026-03-15': ['15:00', '16:00'],
};
