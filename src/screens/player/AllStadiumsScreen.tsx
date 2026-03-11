import React from 'react';
import {
  View, Text, StyleSheet, FlatList, Image,
  TouchableOpacity, StatusBar,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../theme';
import { useStore } from '../../store';
import { Stadium } from '../../types';
import { formatPrice } from '../../utils/helpers';

export default function AllStadiumsScreen({ navigation }: any) {
  const { stadiums } = useStore();

  const renderItem = ({ item }: { item: Stadium }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('StadiumDetails', { stadiumId: item.id })}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.photos[0] }} style={styles.image} resizeMode="cover" />
      <View style={styles.body}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.location}>📍 {item.location}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>{formatPrice(item.pricePerHour)}/ساعة</Text>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.title}>كل الملاعب</Text>
        <View style={{ width: 60 }} />
      </View>
      <FlatList
        data={stadiums}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: 52,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
    ...Shadow.header,
  },
  back: { color: Colors.primary, fontSize: FontSize.md, fontWeight: '600' },
  title: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text },
  list: { padding: Spacing.lg, gap: Spacing.md },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    flexDirection: 'row',
    ...Shadow.card,
  },
  image: { width: 100, height: 100 },
  body: { flex: 1, padding: Spacing.md, justifyContent: 'space-between' },
  name: { fontSize: FontSize.md, fontWeight: '800', color: Colors.text, textAlign: 'right' },
  location: { fontSize: FontSize.xs, color: Colors.textSecondary, textAlign: 'right' },
  footer: { flexDirection: 'row', justifyContent: 'space-between' },
  price: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary },
  rating: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.star },
});
