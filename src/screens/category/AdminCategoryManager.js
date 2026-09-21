import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import AppText from '../../components/common/AppText';
import { getCategories } from '../../features/category/categorySlice';
import {
  deleteAdminCategoryAPI,
  getCategoriesAPI,
  saveAdminCategoryAPI,
} from '../../features/category/categoryAPI';

const messageOf = error => error.response?.data?.error || error.response?.data?.message || error.message || 'Please try again.';

export default function AdminCategoryManager({ navigation }) {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    const categoryResponse = await getCategoriesAPI();
    setCategories(Array.isArray(categoryResponse.data) ? categoryResponse.data : categoryResponse.data.categories || []);
  };

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;
    getCategoriesAPI().then(response => {
      setCategories(Array.isArray(response.data) ? response.data : response.data.categories || []);
    }).catch(error => Alert.alert('Unable to load categories', messageOf(error)))
      .finally(() => setLoading(false));
  }, [user?.role]);

  const reset = () => {
    setName('');
    setImage(null);
    setEditingId(null);
  };

  const pickImage = async () => {
    try {
      const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, quality: 0.8 });
      if (result.errorCode) throw new Error(result.errorMessage || 'Unable to select image');
      if (result.assets?.[0]) setImage(result.assets[0]);
    } catch (error) {
      Alert.alert('Image', messageOf(error));
    }
  };

  const save = async () => {
    if (!name.trim() || (!editingId && !image)) {
      Alert.alert('Missing details', 'Enter a category name and choose an image.');
      return;
    }
    if (busy) return;
    setBusy(true);
    try {
      const form = new FormData();
      form.append('name', name.trim());
      if (image) form.append('image', {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.fileName || 'category.jpg',
      });
      await saveAdminCategoryAPI(form, editingId);
      reset();
      await reload();
      dispatch(getCategories());
    } catch (error) {
      Alert.alert('Unable to save', messageOf(error));
    } finally {
      setBusy(false);
    }
  };

  const remove = item => Alert.alert(
    `Delete ${item.name}?`,
    'This cannot be undone.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        if (busy) return;
        setBusy(true);
        try {
          await deleteAdminCategoryAPI(item._id);
          if (editingId === item._id) reset();
          await reload();
          dispatch(getCategories());
        } catch (error) {
          Alert.alert('Unable to delete', messageOf(error));
        } finally {
          setBusy(false);
        }
      } },
    ],
  );

  if (user?.role !== 'ADMIN') return null;

  return <View style={styles.page}>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Go back">
        <Icon name="arrow-back" size={24} color="#202820" />
      </TouchableOpacity>
      <AppText style={styles.title}>Manage Categories</AppText>
    </View>
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <AppText style={styles.cardTitle}>{editingId ? 'Edit' : 'Add'} Category</AppText>
        <AppText style={styles.label}>Name</AppText>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Category name" placeholderTextColor="#888" />
        <AppText style={styles.label}>Image {editingId ? '(optional)' : '*'}</AppText>
        {image?.uri && <Image source={{ uri: image.uri }} style={styles.preview} />}
        <TouchableOpacity style={styles.outlineButton} onPress={pickImage}>
          <AppText style={styles.outlineText}>{image ? 'Change image' : 'Choose image'}</AppText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.saveButton, busy && styles.disabled]} disabled={busy} onPress={save}>
          <AppText style={styles.saveText}>{busy ? 'Saving...' : editingId ? 'Save changes' : 'Add Category'}</AppText>
        </TouchableOpacity>
        {editingId && <TouchableOpacity style={styles.cancelButton} onPress={reset}><AppText style={styles.outlineText}>Cancel edit</AppText></TouchableOpacity>}
      </View>
      <AppText style={styles.listTitle}>Categories {loading ? '...' : `(${categories.length})`}</AppText>
      {categories.map(category => <View key={category._id} style={styles.categoryCard}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.rowMain} onPress={() => navigation.navigate('AdminCategoryDetail', { category })} accessibilityLabel={`Open ${category.name}`}>
            {category.image && <Image source={{ uri: category.image }} style={styles.rowImage} />}
            <View style={styles.rowText}>
              <AppText style={styles.rowName} numberOfLines={1}>{category.name}</AppText>
              <AppText style={styles.parentName}>View subcategories</AppText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.action} onPress={() => {
            setEditingId(category._id);
            setName(category.name);
            setImage(null);
          }} accessibilityLabel={`Edit ${category.name}`}>
            <Icon name="create-outline" size={21} color="#4C7A1E" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.action} onPress={() => remove(category)} accessibilityLabel={`Delete ${category.name}`}>
            <Icon name="trash-outline" size={21} color="#B93C36" />
          </TouchableOpacity>
        </View>
      </View>)}
      {!loading && categories.length === 0 && <AppText style={styles.empty}>No categories yet.</AppText>}
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#EDF2E9' },
  header: { paddingTop: 55, paddingBottom: 18, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', gap: 20 },
  title: { fontSize: 21, fontWeight: '700', color: '#202820' },
  content: { paddingHorizontal: 18, paddingBottom: 45 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 18, marginBottom: 24 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#202820', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#DDD', backgroundColor: '#fff', color: '#202820', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  option: { borderWidth: 1, borderColor: '#D6E5CC', borderRadius: 10, paddingHorizontal: 13, paddingVertical: 10, backgroundColor: '#F8FAF6' },
  optionSelected: { backgroundColor: '#4C7A1E', borderColor: '#4C7A1E' },
  optionText: { color: '#345226', fontSize: 14 },
  optionTextSelected: { color: '#fff', fontWeight: '600' },
  preview: { width: 96, height: 96, borderRadius: 12, marginBottom: 10 },
  outlineButton: { borderWidth: 1, borderColor: '#4C7A1E', borderRadius: 11, padding: 12, alignItems: 'center', marginBottom: 18 },
  outlineText: { color: '#4C7A1E', fontWeight: '600' },
  saveButton: { backgroundColor: '#4C7A1E', borderRadius: 12, padding: 14, alignItems: 'center' },
  saveText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  disabled: { opacity: 0.6 },
  cancelButton: { alignItems: 'center', paddingTop: 14 },
  listTitle: { fontSize: 18, fontWeight: '700', color: '#202820', marginBottom: 12 },
  row: { backgroundColor: '#fff', borderRadius: 14, padding: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  rowMain: { flex: 1, flexDirection: 'row', alignItems: 'center', minWidth: 0 },
  categoryCard: { backgroundColor: '#fff', borderRadius: 14, marginBottom: 10 },
  rowImage: { width: 48, height: 48, borderRadius: 9, marginRight: 10 },
  rowText: { flex: 1, minWidth: 0 },
  rowName: { color: '#202820', fontWeight: '600', fontSize: 15 },
  parentName: { color: '#6C7569', fontSize: 12, marginTop: 3 },
  action: { padding: 9 },
  empty: { color: '#6C7569', textAlign: 'center', marginTop: 25 },
});
