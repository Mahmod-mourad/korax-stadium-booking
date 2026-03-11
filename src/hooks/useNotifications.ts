/**
 * useNotifications — hook لإدارة الإشعارات
 *
 * يجمع:
 *  - عدد الإشعارات غير المقروءة
 *  - إشعارات المستخدم الحالي
 *  - تعليم إشعار كمقروء
 *  - تعليم الكل كمقروء
 */
import { useMemo } from 'react';
import { useStore } from '../store';

export function useNotifications() {
  const {
    notifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    user,
  } = useStore();

  /** إشعارات المستخدم الحالي مرتبة من الأحدث */
  const myNotifications = useMemo(
    () => notifications
      .filter((n) => n.userId === user?.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [notifications, user?.id]
  );

  const unreadCount = getUnreadCount();

  return {
    notifications: myNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    hasUnread: unreadCount > 0,
  };
}
