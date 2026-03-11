import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  StatusBar, Alert,
} from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '../../theme';

const CATEGORIES = ['small', 'medium', 'large'];
const CATEGORY_LABELS = ['صغير', 'متوسط', 'كبير'];
const SURFACES = ['grass', 'artificial', 'dirt'];
const SURFACE_LABELS = ['عشب طبيعي', 'عشب صناعي', 'ترابية'];
const AMENITIES_LIST = ['إضاءة ليلية', 'غرف تغيير ملابس', 'كافيتيريا', 'مواقف سيارات', 'دش', 'مدرج'];

export default function AddStadiumScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [contact, setContact] = useState('');
  const [category, setCategory] = useState('medium');
  const [surface, setSurface] = useState('artificial');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleAmenity = (a: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  const handleSave = () => {
    if (!name.trim() || !location.trim() || !price.trim()) {
      Alert.alert('تنبيه', 'من فضلك أكمل البيانات الأساسية');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('تم! 🎉', 'تم إضافة الملعب بنجاح', [
        { text: 'حسناً', onPress: () => navigation.goBack() },
      ]);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.title}>إضافة ملعب جديد</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Photos */}
        <TouchableOpacity style={styles.photoUpload}>
          <Text style={styles.photoIcon}>📸</Text>
          <Text style={styles.photoText}>اضغط لإضافة صور الملعب</Text>
          <Text style={styles.photoHint}>أضف من 3 إلى 10 صور</Text>
        </TouchableOpacity>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>معلومات أساسية</Text>

          <View style={styles.field}>
            <Text style={styles.label}>اسم الملعب *</Text>
            <TextInput
              style={styles.input}
              placeholder="مثال: ملعب النصر"
              value={name}
              onChangeText={setName}
              textAlign="right"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>العنوان *</Text>
            <TextInput
              style={styles.input}
              placeholder="مثال: المعادي، القاهرة"
              value={location}
              onChangeText={setLocation}
              textAlign="right"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>السعر لكل ساعة (جنيه) *</Text>
            <TextInput
              style={styles.input}
              placeholder="مثال: 150"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              textAlign="right"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>رقم التواصل</Text>
            <TextInput
              style={styles.input}
              placeholder="01xxxxxxxxx"
              value={contact}
              onChangeText={setContact}
              keyboardType="phone-pad"
              textAlign="right"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>حجم الملعب</Text>
          <View style={styles.chipRow}>
            {CATEGORIES.map((cat, i) => (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, category === cat && styles.chipActive]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>
                  {CATEGORY_LABELS[i]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Surface */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>نوع الأرضية</Text>
          <View style={styles.chipRow}>
            {SURFACES.map((s, i) => (
              <TouchableOpacity
                key={s}
                style={[styles.chip, surface === s && styles.chipActive]}
                onPress={() => setSurface(s)}
              >
                <Text style={[styles.chipText, surface === s && styles.chipTextActive]}>
                  {SURFACE_LABELS[i]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>المميزات</Text>
          <View style={styles.chipRow}>
            {AMENITIES_LIST.map((a) => (
              <TouchableOpacity
                key={a}
                style={[styles.chip, selectedAmenities.includes(a) && styles.chipActive]}
                onPress={() => toggleAmenity(a)}
              >
                <Text style={[styles.chipText, selectedAmenities.includes(a) && styles.chipTextActive]}>
                  {a}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>وصف الملعب</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="اكتب وصف مختصر للملعب..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlign="right"
            textAlignVertical="top"
            placeholderTextColor={Colors.textSecondary}
          />
        </View>

        {/* Note */}
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>
            💡 بعد إضافة الملعب، سيتم مراجعته من فريق KoraX خلال 24 ساعة قبل النشر
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveBtnText}>
            {loading ? 'جاري الحفظ...' : 'حفظ الملعب ✓'}
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
  content: { padding: Spacing.lg, gap: Spacing.md },
  photoUpload: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    padding: Spacing.xl,
    alignItems: 'center',
    gap: 8,
  },
  photoIcon: { fontSize: 48 },
  photoText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  photoHint: { fontSize: FontSize.xs, color: Colors.textSecondary },
  section: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.lg, gap: Spacing.md },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text, textAlign: 'right' },
  field: { gap: 6 },
  label: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text, textAlign: 'right' },
  input: {
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: FontSize.md,
    color: Colors.text,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  textArea: { minHeight: 100 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end' },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: Radius.full,
    backgroundColor: Colors.inputBg,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text },
  chipTextActive: { color: '#fff' },
  noteCard: {
    backgroundColor: Colors.primary + '11',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  noteText: { fontSize: FontSize.sm, color: Colors.text, lineHeight: 22, textAlign: 'right' },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { color: '#fff', fontSize: FontSize.lg, fontWeight: '800' },
});
