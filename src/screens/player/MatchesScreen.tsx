import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  StatusBar, Alert, Modal,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../theme';
import { useStore } from '../../store';
import { MatchRequest } from '../../types';
import { formatDate, formatTime, getLevelLabel } from '../../utils/helpers';

const LEVEL_COLORS: Record<string, string> = {
  beginner: '#4CAF50',
  intermediate: '#FF9800',
  advanced: '#F44336',
  any: '#2196F3',
};

function MatchCard({ match, onJoin }: { match: MatchRequest; onJoin: () => void }) {
  // إجمالي اللاعبين = totalPlayers إذا موجود، وإلا currentPlayers + playersNeeded
  const totalPlayers = match.totalPlayers ?? (match.currentPlayers + match.playersNeeded);
  // نسبة الاكتمال (0 → 1)
  const progress = totalPlayers > 0 ? match.currentPlayers / totalPlayers : 0;

  // ── لون المستوى محسوب هنا (لا function داخل StyleSheet) ──
  const levelColor = LEVEL_COLORS[match.level] ?? '#757575';
  const levelBadgeStyle = {
    backgroundColor: levelColor + '22',
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: levelColor,
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={levelBadgeStyle}>
          <Text style={[styles.levelText, { color: levelColor }]}>{getLevelLabel(match.level)}</Text>
        </View>
        <Text style={styles.cardDate}>{formatDate(match.date)}</Text>
      </View>

      <Text style={styles.stadiumName}>{match.stadiumName}</Text>
      <Text style={styles.location}>📍 {match.stadiumLocation}</Text>

      <View style={styles.timeRow}>
        <Text style={styles.time}>⏰ {formatTime(match.startTime)} – {formatTime(match.endTime)}</Text>
      </View>

      {match.description && (
        <Text style={styles.description}>{match.description}</Text>
      )}

      {/* Players Progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            ناقص <Text style={styles.progressHighlight}>{match.playersNeeded} لاعبين</Text>
          </Text>
          <Text style={styles.progressCount}>
            {match.currentPlayers}/{totalPlayers} لاعب
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
        </View>
        <View style={styles.playerDots}>
          {Array.from({ length: totalPlayers }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.playerDot,
                i < match.currentPlayers && styles.playerDotFilled,
              ]}
            >
              <Text style={styles.playerDotText}>{i < match.currentPlayers ? '⚽' : '👤'}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.joinBtn, match.status === 'full' && styles.joinBtnDisabled]}
        onPress={onJoin}
        disabled={match.status === 'full'}
      >
        <Text style={styles.joinBtnText}>
          {match.status === 'full' ? 'المباراة ممتلئة' : '⚽ انضم للمباراة'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function MatchesScreen({ navigation }: any) {
  const { matches, user, joinMatch } = useStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleJoin = (match: MatchRequest) => {
    if (match.participants.includes(user?.id ?? '')) {
      Alert.alert('تنبيه', 'أنت بالفعل مشترك في هذه المباراة');
      return;
    }
    Alert.alert(
      'انضم للمباراة',
      `هل تريد الانضمام لمباراة ${match.stadiumName}؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'انضم ✓',
          onPress: () => {
            joinMatch(match.id, user?.id ?? '');
            Alert.alert('تم! 🎉', 'تم انضمامك للمباراة بنجاح');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الماتشات المفتوحة ⚽</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowCreateModal(true)}>
          <Text style={styles.addBtnText}>+ إنشاء ماتش</Text>
        </TouchableOpacity>
      </View>

      {/* Subtitle */}
      <View style={styles.subtitleBar}>
        <Text style={styles.subtitle}>ابحث عن لاعبين للانضمام لمباراتك</Text>
      </View>

      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MatchCard match={item} onJoin={() => handleJoin(item)} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>⚽</Text>
            <Text style={styles.emptyText}>مافيش ماتشات متاحة الآن</Text>
            <TouchableOpacity style={styles.createBtn} onPress={() => setShowCreateModal(true)}>
              <Text style={styles.createBtnText}>أنشئ ماتش جديد</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Create Match Modal */}
      <Modal visible={showCreateModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>إنشاء ماتش جديد</Text>
            <Text style={styles.modalSubtitle}>
              احجز ملعب أولاً ثم أنشئ طلب ماتش لجذب لاعبين
            </Text>
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => {
                setShowCreateModal(false);
                navigation.navigate('Home');
              }}
            >
              <Text style={styles.modalBtnText}>احجز ملعب 🏟️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowCreateModal(false)}
            >
              <Text style={styles.modalCloseBtnText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  addBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  addBtnText: { color: '#fff', fontSize: FontSize.sm, fontWeight: '700' },
  subtitleBar: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  subtitle: { color: 'rgba(255,255,255,0.6)', fontSize: FontSize.sm },
  list: { padding: Spacing.lg, gap: Spacing.md },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadow.card,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  // levelBadge أُزيل من هنا — الآن يُحسب ديناميكياً داخل MatchCard
  levelText: { fontSize: FontSize.xs, fontWeight: '700' },
  cardDate: { fontSize: FontSize.xs, color: Colors.textSecondary },
  stadiumName: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text, textAlign: 'right', marginBottom: 2 },
  location: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'right', marginBottom: 6 },
  timeRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8 },
  time: { fontSize: FontSize.sm, color: Colors.text, fontWeight: '600' },
  description: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'right',
    lineHeight: 22,
    marginBottom: 12,
    backgroundColor: Colors.inputBg,
    padding: Spacing.sm,
    borderRadius: Radius.md,
  },
  progressSection: { marginBottom: Spacing.md },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressText: { fontSize: FontSize.sm, color: Colors.text, fontWeight: '600' },
  progressHighlight: { color: Colors.primary, fontWeight: '800' },
  progressCount: { fontSize: FontSize.sm, color: Colors.textSecondary },
  progressBar: { height: 6, backgroundColor: Colors.inputBg, borderRadius: 3, overflow: 'hidden', marginBottom: 10 },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 3 },
  playerDots: { flexDirection: 'row', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' },
  playerDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerDotFilled: { backgroundColor: Colors.primary + '22' },
  playerDotText: { fontSize: 14 },
  joinBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 12,
    alignItems: 'center',
  },
  joinBtnDisabled: { backgroundColor: Colors.textSecondary },
  joinBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: '800' },
  empty: { alignItems: 'center', paddingVertical: 64 },
  emptyIcon: { fontSize: 56, marginBottom: 12 },
  emptyText: { fontSize: FontSize.md, color: Colors.textSecondary, marginBottom: 16 },
  createBtn: { backgroundColor: Colors.primary, borderRadius: Radius.full, paddingVertical: 12, paddingHorizontal: 28 },
  createBtnText: { color: '#fff', fontWeight: '700', fontSize: FontSize.md },
  modalOverlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.xl,
    paddingBottom: 48,
    gap: Spacing.md,
  },
  modalTitle: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.text, textAlign: 'center' },
  modalSubtitle: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center' },
  modalBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: '800' },
  modalCloseBtn: { paddingVertical: 14, alignItems: 'center' },
  modalCloseBtnText: { color: Colors.textSecondary, fontSize: FontSize.md },
});
