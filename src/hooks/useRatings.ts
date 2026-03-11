/**
 * useRatings — hook لإدارة التقييمات
 *
 * يجمع:
 *  - إضافة تقييم جديد
 *  - تقييمات ملعب معين
 *  - التحقق من تقييم حجز معين
 */
import { useStore } from '../store';
import { Rating } from '../types';

export function useRatings() {
  const { ratings, addRating, getStadiumRatings, hasRated, user } = useStore();

  /**
   * إضافة تقييم جديد
   * يُعيد false إذا كان قد قيّم هذا الحجز مسبقاً
   */
  function submitRating(params: {
    stadiumId: string;
    bookingId: string;
    score: number;
    surfaceScore?: number;
    lightingScore?: number;
    organizationScore?: number;
    comment?: string;
  }): boolean {
    if (!user) return false;
    if (hasRated(params.bookingId)) return false; // منع التقييم المتكرر

    const rating: Rating = {
      id: `r_${Date.now()}`,
      stadiumId: params.stadiumId,
      bookingId: params.bookingId,
      playerId: user.id,
      playerName: user.name,
      score: params.score,
      surfaceScore: params.surfaceScore,
      lightingScore: params.lightingScore,
      organizationScore: params.organizationScore,
      comment: params.comment,
      createdAt: new Date().toISOString(),
    };

    addRating(rating);
    return true;
  }

  return {
    ratings,
    submitRating,
    getStadiumRatings,
    hasRated,
  };
}
