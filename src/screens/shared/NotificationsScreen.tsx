import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../theme';
import { useStore } from '../../store';
import { Notification } from '../../types';

const TYPE_ICONS: Record<string, string> = {
  booking_confirmed: '✅',
  match_open: '⚽',
  reminder: '⏰',
  discount: '💰',
  general: '📢',
};

const TYPE_COLORS: Record<string, string> = {
  booking_confirmed: Colors.success,
  match_open: '#2196F3',
  reminder: Colors.warning,
  discount: Colors.primary,
  general: Colors.textSecondary,
};

export default function NotificationsScreen({ navigation }: any) {
  const { notifications, markAsRead, markAllAsRead } = useStore();

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.card, !item.isRead && styles.cardUnread]}
      onPress={() => markAsRead(item.id)}
      activeOpacity={0.8}
    >
      <View style={[styles.iconCircle, { backgroundColor: TYPE_COLORS[item.type] + '22' }]}>
        <Text style={styles.icon}>{TYPE_ICONS[item.type]}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString('ar-EG')}</Text>
          <Text style={styles.notifTitle}>{item.title}</Text>
        </View>
        <Text style={styles.body} numberOfLines={2}>{item.body}</Text>
      </View>
      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />

      <View style={styles.header}>
        <TouchableOpacity onPress={markAllAsRead} disabled={unread === 0}>
          <Text style={[styles.markAll, unread === 0 && styles.markAllDisabled]}>
            قراءة الكل
          </Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          الإشعارات {unread > 0 && `(${unread})`}
        </Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyText}>مافيش إشعارات</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.secondary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 52,
    paddingBottom: Spacing.md,
  },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.textLight },
  markAll: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: '600' },
  markAllDisabled: { opacity: 0.4 },
  list: { padding: Spacing.lg, gap: Spacing.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadow.card,
    position: 'relative',
  },
  cardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 22 },
  content: { flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  notifTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text, textAlign: 'right' },
  date: { fontSize: FontSize.xs, color: Colors.textSecondary },
  body: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20, textAlign: 'right' },
  unreadDot: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  empty: { alignItems: 'center', paddingVertical: 64 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: FontSize.md, color: Colors.textSecondary },
});
