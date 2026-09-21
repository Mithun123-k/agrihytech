import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, Dimensions, FlatList, Image, ImageBackground, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AppText from '../../components/common/AppText';
import API from '../../services/axios';

const errorMessage = error => error.response?.status === 404
  ? 'This catalogue is not available until the backend update is deployed.'
  : error.response?.data?.error || error.response?.data?.message || error.message || 'Please try again.';

async function allPages(path, key, params) {
  const rows = [];
  let page = 1;
  let totalPages = 1;
  do {
    const { data } = await API.get(path, { params: { ...params, page, limit: 100 } });
    rows.push(...(data[key] || []));
    totalPages = Number(data.totalPages) || 1;
    page += 1;
  } while (page <= totalPages);
  return rows;
}

export default function UserCatalogScreen({ navigation, route }) {
  const width = Dimensions.get('window').width;
  const { categoryId, categoryName, categoryImage } = route.params || {};
  const isMedicine = /medicine/i.test(categoryName || '');
  const [stage, setStage] = useState(isMedicine ? 'brands' : 'subcategories');
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const requestId = useRef(0);

  const load = useCallback(async (nextStage, subcategory, brand) => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    setError('');
    try {
      let rows;
      if (nextStage === 'subcategories') {
        const { data } = await API.get('/subcategories', { params: { categoryId } });
        rows = data.subCategories || [];
      } else if (nextStage === 'brands') {
        rows = await allPages(`/categories/${categoryId}/brands`, 'brands', {
          onlyWithProducts: 'true',
          ...(subcategory?._id ? { subCategoryId: subcategory._id } : {}),
        });
      } else {
        rows = await allPages(`/brands/${brand._id}/products`, 'products', {
          categoryId,
          ...(subcategory?._id ? { subCategoryId: subcategory._id } : {}),
        });
      }
      if (currentRequest !== requestId.current) return;
      if (nextStage === 'subcategories') setSubcategories(rows);
      else if (nextStage === 'brands') setBrands(rows);
      else setProducts(rows);
    } catch (cause) {
      if (currentRequest === requestId.current) setError(errorMessage(cause));
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    if (!categoryId) return;
    setStage(isMedicine ? 'brands' : 'subcategories');
    setSelectedSubcategory(null);
    setSelectedBrand(null);
    load(isMedicine ? 'brands' : 'subcategories', null, null);
    return () => { requestId.current += 1; };
  }, [categoryId, isMedicine, load]);

  const back = useCallback(() => {
    requestId.current += 1;
    setLoading(false);
    setError('');
    setSearch('');
    if (stage === 'products') { setStage('brands'); setSelectedBrand(null); }
    else if (stage === 'brands' && !isMedicine) { setStage('subcategories'); setSelectedSubcategory(null); }
    else navigation.goBack();
  }, [isMedicine, navigation, stage]);

  useFocusEffect(useCallback(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stage === 'products' || (stage === 'brands' && !isMedicine)) {
        back();
        return true;
      }
      return false;
    });
    return () => subscription.remove();
  }, [back, isMedicine, stage]));

  const choose = item => {
    setSearch('');
    if (stage === 'subcategories') {
      setSelectedSubcategory(item);
      setStage('brands');
      load('brands', item, null);
    } else if (stage === 'brands') {
      setSelectedBrand(item);
      setStage('products');
      load('products', selectedSubcategory, item);
    } else {
      navigation.navigate('ProductDetailsScreen', { productId: item._id });
    }
  };

  const rows = stage === 'subcategories' ? subcategories : stage === 'brands' ? brands : products;
  const visibleRows = rows.filter(item => (item.name || '').toLowerCase().includes(search.trim().toLowerCase()));
  const heading = stage === 'subcategories' ? categoryName : stage === 'brands'
    ? selectedSubcategory?.name || categoryName : selectedBrand?.name || categoryName;
  const label = stage === 'subcategories' ? 'Subcategories' : stage === 'brands' ? 'Brands / Companies' : 'Products';

  return <View style={styles.page}>
    <ImageBackground source={require('../../assets/images/bg1.png')} style={styles.hero} resizeMode="cover">
      <SafeAreaView edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={back} accessibilityLabel="Go back"><Icon name="arrow-back" size={25} color="#202820" /></TouchableOpacity>
          <AppText style={styles.heading} numberOfLines={2}>{heading}</AppText>
          {stage === 'subcategories' && categoryImage ? <Image source={{ uri: categoryImage }} style={styles.headerImage} /> : <View style={styles.headerImage} />}
        </View>
        <View style={styles.searchBox}>
          <Icon name="search" size={19} color="#777" />
          <TextInput style={styles.searchInput} value={search} onChangeText={setSearch} placeholder={`Search ${label.toLowerCase()}`} placeholderTextColor="#888" />
        </View>
      </SafeAreaView>
    </ImageBackground>
    <AppText style={styles.sectionTitle}>{label} {loading ? '' : `(${visibleRows.length})`}</AppText>
    {error ? <View style={styles.messageBox}>
      <AppText style={styles.message}>{error}</AppText>
      <TouchableOpacity onPress={() => load(stage, selectedSubcategory, selectedBrand)}><AppText style={styles.retry}>Retry</AppText></TouchableOpacity>
    </View> : <FlatList
      key="catalog-grid"
      data={loading ? [] : visibleRows}
      keyExtractor={item => item._id}
      numColumns={2}
      columnWrapperStyle={styles.gridRow}
      contentContainerStyle={styles.list}
      ListEmptyComponent={!loading ? <AppText style={styles.empty}>No {label.toLowerCase()} found.</AppText> : <AppText style={styles.empty}>Loading...</AppText>}
      renderItem={({ item }) => stage === 'subcategories' ?
        <TouchableOpacity activeOpacity={0.85} style={[styles.gridCard, { width: (width - 48) / 2 }]} onPress={() => choose(item)}>
          <View style={styles.gridImageBox}>
            {item.image ? <Image source={{ uri: item.image }} style={styles.gridImage} resizeMode="cover" /> :
              <Icon name="leaf-outline" size={36} color="#4C7A1E" />}
          </View>
          <View style={styles.gridFooter}>
            <AppText style={styles.gridTitle} numberOfLines={2}>{item.name}</AppText>
          </View>
        </TouchableOpacity> :
        <TouchableOpacity activeOpacity={0.85} style={[styles.gridCard, { width: (width - 48) / 2 }]} onPress={() => choose(item)}>
          <View style={styles.gridImageBox}>
            {(stage === 'products' ? item.images?.[0]?.url : item.image) ?
              <Image source={{ uri: stage === 'products' ? item.images[0].url : item.image }} style={styles.gridImage} resizeMode="contain" /> :
              <Icon name={stage === 'products' ? 'cube-outline' : 'business-outline'} size={36} color="#4C7A1E" />}
          </View>
          <View style={styles.gridFooter}>
            <AppText style={styles.gridTitle} numberOfLines={2}>{item.name}</AppText>
            {stage === 'brands' && <AppText style={styles.gridSubtitle}>{item.isCompany ? 'Company' : 'Brand'}</AppText>}
          </View>
        </TouchableOpacity>}
    />}
  </View>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F2F7EE' },
  hero: { paddingHorizontal: 22, paddingBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 77, gap: 15 },
  heading: { flex: 1, color: '#202820', fontSize: 22, fontWeight: '700', textAlign: 'center' },
  headerImage: { width: 39, height: 39, borderRadius: 20 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 16, height: 54 },
  searchInput: { flex: 1, color: '#202820', fontSize: 15 },
  sectionTitle: { color: '#202820', fontSize: 18, fontWeight: '700', marginHorizontal: 22, marginTop: 22, marginBottom: 14 },
  list: { paddingHorizontal: 18, paddingBottom: 35 },
  gridRow: { justifyContent: 'space-between' },
  gridCard: { backgroundColor: '#fff', borderRadius: 20, marginBottom: 14, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 2 }, shadowRadius: 5 },
  gridImageBox: { height: 145, backgroundColor: '#F7F8F5', justifyContent: 'center', alignItems: 'center', padding: 12 },
  gridImage: { width: '100%', height: '100%' },
  gridFooter: { paddingHorizontal: 10, paddingVertical: 12, alignItems: 'center', minHeight: 68 },
  gridTitle: { color: '#202820', fontSize: 14, fontWeight: '600', textAlign: 'center' },
  gridSubtitle: { color: '#6C7569', fontSize: 12, marginTop: 4, textAlign: 'center' },
  empty: { color: '#6C7569', textAlign: 'center', marginTop: 50 },
  messageBox: { marginHorizontal: 18, padding: 20, borderRadius: 15, backgroundColor: '#fff', alignItems: 'center' },
  message: { color: '#6C7569', textAlign: 'center' },
  retry: { color: '#4C7A1E', fontWeight: '700', marginTop: 14 },
});
