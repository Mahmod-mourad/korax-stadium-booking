export const BOOKING_FEE = 20;

export function formatPrice(amount: number): string {
  return `${amount} جنيه`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(time: string): string {
  const [hour] = time.split(':').map(Number);
  const period = hour >= 12 ? 'م' : 'ص';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:00 ${period}`;
}

export function calculateBookingTotal(
  stadiumPrice: number,
  durationHours: number
): { stadiumCost: number; bookingFee: number; total: number } {
  const stadiumCost = stadiumPrice * durationHours;
  const bookingFee = BOOKING_FEE;
  return { stadiumCost, bookingFee, total: stadiumCost + bookingFee };
}

export function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    small: 'صغير',
    medium: 'متوسط',
    large: 'كبير',
  };
  return map[category] || category;
}

export function getSurfaceLabel(surface: string): string {
  const map: Record<string, string> = {
    grass: 'عشب طبيعي',
    artificial: 'عشب صناعي',
    dirt: 'أرضية ترابية',
  };
  return map[surface] || surface;
}

export function getLevelLabel(level: string): string {
  const map: Record<string, string> = {
    beginner: 'مبتدئ',
    intermediate: 'متوسط',
    advanced: 'محترف',
    any: 'جميع المستويات',
  };
  return map[level] || level;
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: 'في الانتظار',
    confirmed: 'مؤكد',
    completed: 'مكتمل',
    cancelled: 'ملغى',
  };
  return map[status] || status;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    pending: '#FF9800',
    confirmed: '#00C853',
    completed: '#2196F3',
    cancelled: '#F44336',
  };
  return map[status] || '#757575';
}

export function renderStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half);
}

export function getTimeEndSlot(startTime: string, hours: number = 1): string {
  const [h, m] = startTime.split(':').map(Number);
  const end = new Date();
  end.setHours(h + hours, m, 0);
  return `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;
}
