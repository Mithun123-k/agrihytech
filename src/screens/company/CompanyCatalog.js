import AppText from '../../components/common/AppText';
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { companyError, idOf, imageUri, getCompanyBrands, getCompanyCategories, getCompanyProducts, saveCompanyBrand, deleteCompanyBrand, saveCompanyProduct, deleteCompanyProduct } from '../../features/company/companyAPI';
import { CompanyPage, CompanyButton, CompanyField, CompanySelect, useCompanyData, pickCompanyImages, confirmCompanyDelete, s } from './shared';

const loadCatalog = async () => {
  const [brands, categories, products] = await Promise.all([getCompanyBrands(), getCompanyCategories(), getCompanyProducts()]);
  return { brands, categories, products };
};
const loadBrandOptions = async () => {
  const [brands, categories] = await Promise.all([getCompanyBrands(), getCompanyCategories()]);
  return { brands, categories };
};

export function CompanyBrands({ navigation, route }) {
  const resource = useCompanyData(getCompanyBrands);
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);
  const categoryId = route.params?.categoryId;
  const rows = (resource.data || []).filter(item => (!categoryId || idOf(item.category) === categoryId) && item.name?.toLowerCase().includes(search.toLowerCase()));
  const remove = async id => {
    setBusy(true);
    try { await deleteCompanyBrand(id); await resource.reload(); }
    catch (error) { Alert.alert('Unable to delete brand', companyError(error)); }
    finally { setBusy(false); }
  };
  return <CompanyPage title={route.params?.categoryName || 'My Brands'} navigation={navigation} resource={resource}>
    <CompanyButton title="Add Brand" onPress={() => navigation.navigate('CompanyBrandForm', { categoryId })} />
    <CompanyField label="Search brands" value={search} onChangeText={setSearch} />
    {!rows.length && !resource.loading ? <AppText style={s.text}>No brands found. Add a brand to get started.</AppText> : null}
    {rows.map(brand => <View key={brand._id} style={s.rowCard}>
      <TouchableOpacity style={s.rowMain} onPress={() => navigation.navigate('CompanyProducts', { brandId: brand._id, brandName: brand.name })}>
        {imageUri(brand.image) ? <Image source={{ uri: imageUri(brand.image) }} style={s.rowImage} /> : <View style={s.rowImagePlaceholder} />}
        <View style={s.rowText}><AppText style={s.rowTitle} numberOfLines={1}>{brand.name}</AppText><AppText style={s.rowSubtext}>Category: {brand.category?.name || 'Uncategorized'}</AppText></View>
      </TouchableOpacity>
      <View style={s.rowActions}>
        <TouchableOpacity style={s.rowEdit} onPress={() => navigation.navigate('CompanyBrandForm', { brand })}><AppText style={s.rowEditText}>Edit</AppText></TouchableOpacity>
        <TouchableOpacity style={s.rowDelete} disabled={busy} onPress={() => confirmCompanyDelete('Delete this brand?', () => remove(brand._id))}><AppText style={s.rowDeleteText}>×</AppText></TouchableOpacity>
      </View>
    </View>)}
  </CompanyPage>;
}

export function CompanyBrandForm({ navigation, route }) {
  const brand = route.params?.brand;
  const resource = useCompanyData(getCompanyCategories);
  const [draft, setDraft] = useState({ name: brand?.name || '', category: idOf(brand?.category) || route.params?.categoryId || '', image: null });
  const [busy, setBusy] = useState(false);
  const field = key => value => setDraft(old => ({ ...old, [key]: value }));
  const pick = async () => {
    try { const images = await pickCompanyImages(); if (images?.length) field('image')(images[0]); }
    catch (error) { Alert.alert('Photo library', companyError(error)); }
  };
  const save = async () => {
    if (!draft.name.trim() || !draft.category || (!brand && !draft.image)) {
      Alert.alert('Missing details', 'Enter a brand name, select a category and choose a brand image.'); return;
    }
    setBusy(true);
    try { await saveCompanyBrand(draft, brand?._id); navigation.goBack(); }
    catch (error) { Alert.alert('Unable to save brand', companyError(error)); }
    finally { setBusy(false); }
  };
  const preview = draft.image?.uri || imageUri(brand?.image);
  return <CompanyPage title={brand ? 'Edit Brand' : 'Add Brand'} navigation={navigation} resource={resource}>
    <View style={s.card}>
      <CompanyField label="Brand Name" value={draft.name} onChangeText={field('name')} />
      <CompanySelect label="Category" value={draft.category} onChange={field('category')} options={resource.data || []} />
      {preview ? <Image source={{ uri: preview }} style={s.image} /> : null}
      <CompanyButton secondary title="Choose Image" onPress={pick} disabled={busy} />
      <CompanyButton title={busy ? 'Saving...' : 'Save Brand'} disabled={busy} onPress={save} />
    </View>
  </CompanyPage>;
}

export function CompanyProducts({ navigation, route }) {
  const resource = useCompanyData(getCompanyProducts);
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);
  const brandId = route.params?.brandId;
  const categoryId = route.params?.categoryId;
  const rows = (resource.data || []).filter(item =>
    (!brandId || item.brand?.some(brand => idOf(brand) === brandId)) &&
    (!categoryId || idOf(item.category) === categoryId) &&
    item.name?.toLowerCase().includes(search.toLowerCase())
  );
  const remove = async id => {
    setBusy(true);
    try { await deleteCompanyProduct(id); await resource.reload(); }
    catch (error) { Alert.alert('Unable to delete product', companyError(error)); }
    finally { setBusy(false); }
  };
  return <CompanyPage title={route.params?.categoryName || route.params?.brandName || 'My Products'} navigation={navigation} resource={resource}>
    <CompanyButton title="Add Product" onPress={() => navigation.navigate('CompanyProductForm', { brandId, categoryId })} />
    <CompanyField label="Search products" value={search} onChangeText={setSearch} />
    {!rows.length && !resource.loading ? <AppText style={s.text}>No products found.</AppText> : null}
    {rows.map(product => <View key={product._id} style={s.rowCard}>
      <TouchableOpacity style={s.rowMain} onPress={() => navigation.navigate('CompanyProductDetails', { product })}>
        {imageUri(product.images?.[0]) ? <Image source={{ uri: imageUri(product.images[0]) }} style={s.rowImage} /> : <View style={s.rowImagePlaceholder} />}
        <View style={s.rowText}><AppText style={s.rowTitle} numberOfLines={1}>{product.name}</AppText><AppText style={s.rowSubtext}>{product.brand?.map(brand => brand.name).join(', ') || 'No brand'}</AppText>
        <AppText style={s.text}>₹{product.price || 0} · {product.quantity || 0} {product.unit}</AppText>
        </View>
      </TouchableOpacity>
      <View style={s.rowActions}>
        <TouchableOpacity style={s.rowEdit} onPress={() => navigation.navigate('CompanyProductForm', { product })}><AppText style={s.rowEditText}>Edit</AppText></TouchableOpacity>
        <TouchableOpacity style={s.rowDelete} disabled={busy} onPress={() => confirmCompanyDelete('Delete this product?', () => remove(product._id))}><AppText style={s.rowDeleteText}>×</AppText></TouchableOpacity>
      </View>
    </View>)}
  </CompanyPage>;
}

export function CompanyProductForm({ navigation, route }) {
  const product = route.params?.product;
  const resource = useCompanyData(getCompanyCategories);
  const [draft, setDraft] = useState({
    name: product?.name || '',
    category: idOf(product?.category) || route.params?.categoryId || '',
    description: product?.description || '',
    images: [],
  });
  const [busy, setBusy] = useState(false);
  const field = key => value => setDraft(old => ({ ...old, [key]: value }));
  const pick = async () => {
    try { const images = await pickCompanyImages(true); if (images?.length) field('images')(images); }
    catch (error) { Alert.alert('Photo library', companyError(error)); }
  };
  const save = async () => {
    if (!draft.name.trim() || !draft.category || (!product && !draft.images.length)) {
      Alert.alert('Missing details', 'Enter a product name, select a category and choose a product image.');
      return;
    }
    setBusy(true);
    try { await saveCompanyProduct(draft, product?._id); navigation.goBack(); }
    catch (error) { Alert.alert('Unable to save product', companyError(error)); }
    finally { setBusy(false); }
  };
  return <CompanyPage title={product ? 'Edit Product' : 'Add Product'} navigation={navigation} resource={resource}>
    <View style={s.card}>
      <CompanyField label="Product Name" value={draft.name} onChangeText={field('name')} />
      <CompanySelect label="Category" value={draft.category} onChange={field('category')} options={resource.data || []} />
      <CompanyField label="Description (optional)" value={draft.description} onChangeText={field('description')} multiline />
      {(draft.images.length ? draft.images : product?.images || []).map((asset, index) => <Image key={index} source={{ uri: imageUri(asset) }} style={s.image} />)}
      <CompanyButton secondary title="Choose Images (up to 5)" disabled={busy} onPress={pick} />
      {draft.images.length ? <CompanyButton secondary title="Discard Selected Images" onPress={() => field('images')([])} /> : null}
      {product ? <AppText style={s.text}>Choosing new images replaces the existing images when you save.</AppText> : null}
      <CompanyButton title={busy ? 'Saving...' : 'Save Product'} disabled={busy} onPress={save} />
    </View>
  </CompanyPage>;
}

export function CompanyProductDetails({ navigation, route }) {
  const product = route.params.product;
  const resource = useCompanyData(getCompanyProducts);
  const current = resource.data?.find(item => item._id === product._id) || product;
  return <CompanyPage title={current.name} navigation={navigation} resource={resource}>
    <View style={s.card}>
      {(current.images || []).map((asset, index) => <Image key={index} source={{ uri: imageUri(asset) }} style={s.image} />)}
      <AppText style={s.title}>{current.name}</AppText><AppText style={s.text}>{current.brand?.map(brand => brand.name).join(', ')}</AppText>
      <AppText style={s.text}>₹{current.price || 0} · {current.quantity || 0} {current.unit}</AppText>
      <AppText style={s.text}>{current.description || 'No description added.'}</AppText>
      <CompanyButton title="Edit Product" onPress={() => navigation.navigate('CompanyProductForm', { product: current })} />
    </View>
  </CompanyPage>;
}

export function CompanyCategories({ navigation }) {
  const resource = useCompanyData(loadBrandOptions);
  const [search, setSearch] = useState('');
  const categories = (resource.data?.categories || []).filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
  return <CompanyPage title="Categories" navigation={navigation} resource={resource} tab>
    <CompanyField label="Search categories" value={search} onChangeText={setSearch} />
    {categories.map(category => <TouchableOpacity key={category._id} style={s.card} onPress={() => navigation.navigate('CompanyBrands', { categoryId: category._id, categoryName: category.name })}>
      {category.image ? <Image source={{ uri: category.image }} style={s.image} /> : null}
      <AppText style={s.title}>{category.name}</AppText><AppText style={s.text}>{resource.data.brands.filter(brand => idOf(brand.category) === category._id).length} brands</AppText>
    </TouchableOpacity>)}
    {!categories.length && !resource.loading ? <AppText style={s.text}>No categories found.</AppText> : null}
  </CompanyPage>;
}

export function CompanySearch({ navigation }) {
  const resource = useCompanyData(loadCatalog);
  const [query, setQuery] = useState('');
  const matches = item => query.trim() && item.name?.toLowerCase().includes(query.trim().toLowerCase());
  const brands = (resource.data?.brands || []).filter(matches);
  const products = (resource.data?.products || []).filter(matches);
  return <CompanyPage title="Search" navigation={navigation} resource={resource} tab>
    <CompanyField label="Search your brands and products" value={query} onChangeText={setQuery} />
    {brands.map(brand => <TouchableOpacity key={brand._id} style={s.card} onPress={() => navigation.navigate('CompanyProducts', { brandId: brand._id, brandName: brand.name })}><AppText style={s.title}>{brand.name}</AppText><AppText style={s.text}>Brand</AppText></TouchableOpacity>)}
    {products.map(product => <TouchableOpacity key={product._id} style={s.card} onPress={() => navigation.navigate('CompanyProductDetails', { product })}><AppText style={s.title}>{product.name}</AppText><AppText style={s.text}>Product · ₹{product.price || 0}</AppText></TouchableOpacity>)}
    {query.trim() && !brands.length && !products.length && !resource.loading ? <AppText style={s.text}>No results found.</AppText> : null}
  </CompanyPage>;
}
