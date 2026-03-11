import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  StatusBar, Alert,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../theme';
import { useStore } from '../../store';
import { formatPrice } from '../../utils/helpers';

export default function EditStadiumScreen({ navigation, route }: any) {
  const { stadiumId } = route.params;
  const { stadiums } = useStore();
  const stadium = stadiums.find((s) => s.id === stadiumId);

  const [price, setPrice] = useState(String(stadium?.pricePerHour ?? ''));
  const [discount, setDiscount] = useState(String(stadium?.discount ?? ''));
  const [description, setDescription] = useState(stadium?.description ?? '');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('تم! ✓', 'تم تحديث بيانات الملعب', [
        { text: 'حسناً', onPress: () => navigation.goBack() },
      ]);
    }, 1000);
  };

  if (!stadium) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.title}>تعديل الملعب</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.stadiumHeader}>
          <Text style={styles.stadiumName}>{stadium.name}</Text>
          <Text style={styles.stadiumLocation}>📍 {stadium.location}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>السعر والخصم</Text>

          <View style={styles.field}>
            <Text style={styles.label}>السعر لكل ساعة (جنيه)</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              textAlign="right"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>نسبة الخصم % (اتركها فاضية لو مافيش خصم)</Text>
            <TextInput
              style={styles.input}
              placeholder="مثال: 20"
              value={discount}
              onChangeText={setDiscount}
              keyboardType="numeric"
              textAlign="right"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          {discount !== '' && price !== '' && (
            <View style={styles.discountPreview}>
              <Text style={styles.discountPreviewText}>
                السعر بعد الخصم:{' '}
                <Text style={styles.discountPreviewPrice}>
                  {formatPrice(Math.round(Number(price) * (1 - Number(discount) / 100)))}
                </Text>
                /ساعة
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>وصف الملعب</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlign="right"
            textAlignVertical="top"
            placeholderTextColor={Colors.textSecondary}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveBtnText}>
            {loading ? 'جاري الحفظ...' : 'حفظ التعديلات ✓'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: 52, paddingBottom: Spacing.md,
    backgroundColor: Colors.surface, ...Shadow.header,
  },
  back: { color: Colors.primary, fontSize: FontSize.md, fontWeight: '600' },
  title: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text },
  content: { padding: Spacing.lg, gap: Spacing.md },
  stadiumHeader: {
    backgroundColor: Colors.secondary,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    alignItems: 'flex-end',
  },
  stadiumName: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.textLight },
  stadiumLocation: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
  section: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.lg, gap: Spacing.md },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text, textAlign: 'right' },
  field: { gap: 6 },
  label: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text, textAlign: 'right' },
  input: {
    backgroundColor: Colors.inputBg, borderRadius: Radius.md,
    paddingHorizontal: Spacing.md, paddingVertical: 12,
    fontSize: FontSize.md, color: Colors.text,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  textArea: { minHeight: 100 },
  discountPreview: {
    backgroundColor: Colors.primary + '11',
    padding: Spacing.sm, borderRadius: Radius.md, alignItems: 'flex-end',
  },
  discountPreviewText: { fontSize: FontSize.sm, color: Colors.text },
  discountPreviewPrice: { color: Colors.primary, fontWeight: '800' },
  saveBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.full,
    paddingVertical: 16, alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { color: '#fff', fontSize: FontSize.lg, fontWeight: '800' },
});
