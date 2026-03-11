/**
 * useStadiums — hook لإدارة الملاعب
 *
 * يجمع كل منطق الملاعب في مكان واحد:
 *  - الفلترة والبحث
 *  - إيجاد ملعب بالـ ID
 *  - إضافة / تعديل ملعب (للمالك)
 *  - حساب الـ booked slots لملعب + يوم معين
 */
import { useMemo } from 'react';
import { useStore } from '../store';
import { Stadium, StadiumFilter } from '../types';
import { BOOKED_SLOTS, TIME_SLOTS } from '../utils/mockData';

export function useStadiums() {
  const {
    stadiums,
    filter,
    setFilter,
    resetFilter,
    getFilteredStadiums,
    addStadium,
    updateStadium,
    getOwnerStadiums,
  } = useStore();

  /** إيجاد ملعب بالـ ID */
  const getStadium = (id: string): Stadium | undefined =>
    stadiums.find((s) => s.id === id);

  /**
   * الـ slots المتاحة لملعب + يوم معين
   * يأخذ من TIME_SLOTS ويُزيل المحجوزة
   *
   * المفتاح: '{stadiumId}_{date}'
   * مثال: '1_2026-03-12'
   */
  const getAvailableSlots = (stadiumId: string, date: string): string[] => {
    const booked = BOOKED_SLOTS[`${stadiumId}_${date}`] ?? [];
    return TIME_SLOTS.filter((slot) => !booked.includes(slot));
  };

  const getBookedSlots = (stadiumId: string, date: string): string[] =>
    BOOKED_SLOTS[`${stadiumId}_${date}`] ?? [];

  /** الملاعب المعروضة بعد الفلتر */
  const filteredStadiums = useMemo(
    () => getFilteredStadiums(),
    [stadiums, filter]
  );

  /** الملاعب ذات أعلى تقييم */
  const topRatedStadiums = useMemo(
    () => [...stadiums].sort((a, b) => b.rating - a.rating).slice(0, 5),
    [stadiums]
  );

  /** الملاعب ذات خصومات */
  const discountedStadiums = useMemo(
    () => stadiums.filter((s) => s.discount && s.discount > 0),
    [stadiums]
  );

  return {
    stadiums,
    filteredStadiums,
    topRatedStadiums,
    discountedStadiums,
    filter,
    setFilter,
    resetFilter,
    getStadium,
    getAvailableSlots,
    getBookedSlots,
    addStadium,
    updateStadium,
    getOwnerStadiums,
  };
}
