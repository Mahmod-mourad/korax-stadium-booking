import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../theme';
import { useStore } from '../../store';

export default function SelectRoleScreen({ route }: any) {
  const { phone, name } = route.params;
  const [selected, setSelected] = useState<'player' | 'owner' | null>(null);
  const { setUser } = useStore();

  const handleStart = () => {
    if (!selected) return;
    setUser({
      id: 'user_' + Date.now(),
      name,
      phone,
      role: selected,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />

      <View style={styles.header}>
        <Text style={styles.wave}>👋</Text>
        <Text style={styles.title}>أهلاً {name}!</Text>
        <Text style={styles.subtitle}>اختار دورك في KoraX</Text>
      </View>

      <View style={styles.cards}>
        <TouchableOpacity
          style={[styles.card, selected === 'player' && styles.cardSelected]}
          onPress={() => setSelected('player')}
          activeOpacity={0.9}
        >
          <Text style={styles.cardIcon}>⚽</Text>
          <Text style={styles.cardTitle}>لاعب</Text>
          <Text style={styles.cardDesc}>
            ابحث عن ملاعب، احجز أوقاتك، وانضم لماتشات مع أصحابك
          </Text>
          {selected === 'player' && (
            <View style={styles.checkBadge}>
              <Text style={styles.checkText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, selected === 'owner' && styles.cardSelected]}
          onPress={() => setSelected('owner')}
          activeOpacity={0.9}
        >
          <Text style={styles.cardIcon}>🏟️</Text>
          <Text style={styles.cardTitle}>صاحب ملعب</Text>
          <Text style={styles.cardDesc}>
            أضف ملعبك، نظم الحجوزات، وادير أرباحك بسهولة
          </Text>
          {selected === 'owner' && (
            <View style={styles.checkBadge}>
              <Text style={styles.checkText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.startBtn, !selected && styles.startBtnDisabled]}
        onPress={handleStart}
        disabled={!selected}
      >
        <Text style={styles.startBtnText}>ابدأ الآن 🚀</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  header: { alignItems: 'center', marginBottom: Spacing.xxl },
  wave: { fontSize: 56, marginBottom: 12 },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: '900',
    color: Colors.textLight,
    marginBottom: 4,
  },
  subtitle: { fontSize: FontSize.md, color: Colors.primary },
  cards: { gap: Spacing.md, marginBottom: Spacing.xl },
  card: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    position: 'relative',
  },
  cardSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(0,200,83,0.1)',
    ...Shadow.card,
  },
  cardIcon: { fontSize: 48, marginBottom: 8 },
  cardTitle: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.textLight,
    marginBottom: 6,
    textAlign: 'right',
  },
  cardDesc: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 22,
    textAlign: 'right',
  },
  checkBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: { color: '#fff', fontWeight: '900', fontSize: FontSize.md },
  startBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 18,
    alignItems: 'center',
  },
  startBtnDisabled: { opacity: 0.4 },
  startBtnText: { color: '#fff', fontSize: FontSize.lg, fontWeight: '900' },
});
