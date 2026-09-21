import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import AppText from '../../components/common/AppText';
import {
  deleteAdminSubCategoryAPI,
  getSubCategoriesAPI,
  saveAdminSubCategoryAPI,
} from '../../features/category/categoryAPI';

const errorMessage = error => error.response?.data?.error || error.response?.data?.message || error.message || 'Please try again.';

export default function AdminCategoryDetail({ navigation, route }) {
  const category = route.params?.category;
  const { user } = useSelector(state => state.auth);
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const supportsSubcategories = !/medicine/i.test(category?.name || '');

  const load = useCallback(async () => {
    try {
      const response = await getSubCategoriesAPI(category._id);
      setItems(response.data.subCategories || []);
      setUnavailable(false);
    } catch (error) {
      setItems([]);
      if (error.response?.status === 404) setUnavailable(true);
      else Alert.alert('Unable to load subcategories', errorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [category?._id]);

  useEffect(() => {
    if (user?.role !== 'ADMIN' || !category?._id || !supportsSubcategories) {
      setLoading(false);
      return;
    }
    load();
  }, [user?.role, category?._id, supportsSubcategories, load]);

  const reset = () => { setName(''); setImage(null); setEditingId(null); setFormVisible(false); };

  const openForm = item => {
    setName(item?.name || '');
    setImage(item?.image ? { uri: item.image, existing: true } : null);
    setEditingId(item?._id || null);
    setFormVisible(true);
  };

  const pickImage = async () => {
    try {
      const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, quality: 0.8 });
      if (result.errorCode) throw new Error(result.errorMessage || 'Unable to select image');
      if (result.assets?.[0]) setImage(result.assets[0]);
    } catch (error) { Alert.alert('Image', errorMessage(error)); }
  };

  const save = async () => {
    if (!name.trim() || (!editingId && !image?.uri)) {
      Alert.alert('Missing details', 'Enter a subcategory name and choose an image.');
      return;
    }
    if (busy) return;
    setBusy(true);
    try {
      const form = new FormData();
      form.append('name', name.trim());
      form.append('categoryId', category._id);
      if (image?.uri && !image.existing) form.append('image', {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.fileName || 'subcategory.jpg',
      });
      await saveAdminSubCategoryAPI(form, editingId);
      reset();
      await load();
    } catch (error) {
      Alert.alert('Unable to save subcategory', errorMessage(error));
    } finally { setBusy(false); }
  };

  const remove = item => Alert.alert(`Delete ${item.name}?`, 'This cannot be undone.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: async () => {
      if (busy) return;
      setBusy(true);
      try {
        await deleteAdminSubCategoryAPI(item._id);
        if (editingId === item._id) reset();
        await load();
      } catch (error) {
        Alert.alert('Unable to delete subcategory', errorMessage(error));
      } finally { setBusy(false); }
    } },
  ]);

  if (user?.role !== 'ADMIN' || !category) return null;

  return <View style={styles.page}>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Go back"><Icon name="arrow-back" size={24} color="#202820" /></TouchableOpacity>
      <AppText style={styles.title} numberOfLines={1}>{category.name}</AppText>
    </View>
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.categoryCard}>
        {category.image && <Image source={{ uri: category.image }} style={styles.categoryImage} />}
        <View style={styles.categoryText}>
          <AppText style={styles.categoryName}>{category.name}</AppText>
          <AppText style={styles.subLabel}>Subcategories</AppText>
        </View>
      </View>
      {!supportsSubcategories ? <View style={styles.card}><AppText style={styles.muted}>This category does not use subcategories.</AppText></View> :
        unavailable ? <View style={styles.card}><AppText style={styles.muted}>Subcategory API is not deployed yet.</AppText></View> : <>
          <TouchableOpacity style={styles.addButton} onPress={() => openForm()}>
            <Icon name="add-circle-outline" size={22} color="#fff" />
            <AppText style={styles.saveText}>Add Subcategory</AppText>
          </TouchableOpacity>
          <AppText style={styles.sectionTitle}>Subcategories {loading ? '...' : `(${items.length})`}</AppText>
          <View style={styles.grid}>
            {items.map(item => <View key={item._id} style={styles.subcategoryCard}>
              {item.image ? <Image source={{ uri: item.image }} style={styles.subcategoryImage} resizeMode="cover" /> :
                <View style={styles.subcategoryPlaceholder}><Icon name="leaf-outline" size={34} color="#4C7A1E" /></View>}
              <AppText style={styles.subcategoryName} numberOfLines={2}>{item.name}</AppText>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.action} onPress={() => openForm(item)} accessibilityLabel={`Edit ${item.name}`}>
                  <Icon name="create-outline" size={20} color="#4C7A1E" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.action} onPress={() => remove(item)} accessibilityLabel={`Delete ${item.name}`}>
                  <Icon name="trash-outline" size={20} color="#B93C36" />
                </TouchableOpacity>
              </View>
            </View>)}
          </View>
          {!loading && items.length === 0 && <AppText style={styles.muted}>No subcategories yet.</AppText>}
        </>}
    </ScrollView>
    <Modal visible={formVisible} transparent animationType="fade" onRequestClose={reset}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <AppText style={styles.cardTitle}>{editingId ? 'Edit' : 'Add'} Subcategory</AppText>
            <TouchableOpacity onPress={reset}><Icon name="close" size={24} color="#202820" /></TouchableOpacity>
          </View>
          <AppText style={styles.label}>Name</AppText>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Wheat" placeholderTextColor="#888" />
          <AppText style={styles.label}>Image {editingId ? '(optional)' : '*'}</AppText>
          {image?.uri ? <Image source={{ uri: image.uri }} style={styles.preview} resizeMode="cover" /> :
            <View style={styles.previewPlaceholder}><Icon name="image-outline" size={35} color="#78925E" /></View>}
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Icon name="images-outline" size={19} color="#4C7A1E" />
            <AppText style={styles.imageButtonText}>{image ? 'Change image' : 'Choose image'}</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.saveButton, busy && styles.disabled]} disabled={busy} onPress={save}>
            <AppText style={styles.saveText}>{busy ? 'Saving...' : editingId ? 'Save changes' : 'Add Subcategory'}</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  </View>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#EDF2E9' },
  header: { paddingTop: 55, paddingBottom: 18, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', gap: 20 },
  title: { flex: 1, fontSize: 21, fontWeight: '700', color: '#202820' },
  content: { paddingHorizontal: 18, paddingBottom: 45 },
  categoryCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 20 },
  categoryImage: { width: 60, height: 60, borderRadius: 12, marginRight: 13 },
  categoryText: { flex: 1 },
  categoryName: { color: '#202820', fontSize: 19, fontWeight: '700' },
  subLabel: { color: '#6C7569', marginTop: 4 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 18, marginBottom: 23 },
  cardTitle: { color: '#202820', fontSize: 17, fontWeight: '700', marginBottom: 14 },
  label: { color: '#202820', fontSize: 14, fontWeight: '600', marginBottom: 7 },
  input: { borderWidth: 1, borderColor: '#DDD', backgroundColor: '#fff', color: '#202820', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16 },
  saveButton: { backgroundColor: '#4C7A1E', borderRadius: 12, padding: 14, alignItems: 'center' },
  addButton: { backgroundColor: '#4C7A1E', borderRadius: 14, padding: 14, marginBottom: 22, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  saveText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  disabled: { opacity: 0.6 },
  cancelButton: { alignItems: 'center', paddingTop: 14 },
  cancelText: { color: '#4C7A1E', fontWeight: '600' },
  sectionTitle: { color: '#202820', fontSize: 18, fontWeight: '700', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  subcategoryCard: { width: '48%', backgroundColor: '#fff', borderRadius: 18, marginBottom: 14, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOpacity: 0.07, shadowOffset: { width: 0, height: 2 }, shadowRadius: 5 },
  subcategoryImage: { width: '100%', height: 125 },
  subcategoryPlaceholder: { width: '100%', height: 125, backgroundColor: '#EEF5E7', alignItems: 'center', justifyContent: 'center' },
  subcategoryName: { color: '#202820', fontSize: 14, fontWeight: '700', textAlign: 'center', minHeight: 42, paddingHorizontal: 8, paddingTop: 10 },
  actions: { flexDirection: 'row', justifyContent: 'center', borderTopWidth: 1, borderTopColor: '#EDF1E9' },
  action: { padding: 9 },
  muted: { color: '#6C7569' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', padding: 22 },
  modalCard: { backgroundColor: '#fff', borderRadius: 22, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  preview: { width: '100%', height: 155, borderRadius: 14, marginBottom: 12 },
  previewPlaceholder: { width: '100%', height: 120, borderRadius: 14, marginBottom: 12, backgroundColor: '#F0F5EB', alignItems: 'center', justifyContent: 'center' },
  imageButton: { height: 48, borderWidth: 1, borderColor: '#A9BE94', borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 },
  imageButtonText: { color: '#4C7A1E', fontWeight: '700' },
});
