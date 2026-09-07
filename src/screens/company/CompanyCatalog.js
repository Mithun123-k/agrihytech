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
    {!rows.length && !resource.loading ? <Text style={s.text}>No brands found. Add a brand to get started.</Text> : null}
    {rows.map(brand => <View key={brand._id} style={s.rowCard}>
      <TouchableOpacity style={s.rowMain} onPress={() => navigation.navigate('CompanyProducts', { brandId: brand._id, brandName: brand.name })}>
        {imageUri(brand.image) ? <Image source={{ uri: imageUri(brand.image) }} style={s.rowImage} /> : <View style={s.rowImagePlaceholder} />}
        <View style={s.rowText}><Text style={s.rowTitle} numberOfLines={1}>{brand.name}</Text><Text style={s.rowSubtext}>Category: {brand.category?.name || 'Uncategorized'}</Text></View>
      </TouchableOpacity>
      <View style={s.rowActions}>
        <TouchableOpacity style={s.rowEdit} onPress={() => navigation.navigate('CompanyBrandForm', { brand })}><Text style={s.rowEditText}>Edit</Text></TouchableOpacity>
        <TouchableOpacity style={s.rowDelete} disabled={busy} onPress={() => confirmCompanyDelete('Delete this brand?', () => remove(brand._id))}><Text style={s.rowDeleteText}>×</Text></TouchableOpacity>
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
  const rows = (resource.data || []).filter(item => (!brandId || item.brand?.some(brand => idOf(brand) === brandId)) && item.name?.toLowerCase().includes(search.toLowerCase()));
  const remove = async id => {
    setBusy(true);
    try { await deleteCompanyProduct(id); await resource.reload(); }
    catch (error) { Alert.alert('Unable to delete product', companyError(error)); }
    finally { setBusy(false); }
  };
  return <CompanyPage title={route.params?.brandName || 'My Products'} navigation={navigation} resource={resource}>
    <CompanyButton title="Add Product" onPress={() => navigation.navigate('CompanyProductForm', { brandId })} />
    <CompanyField label="Search products" value={search} onChangeText={setSearch} />
    {!rows.length && !resource.loading ? <Text style={s.text}>No products found.</Text> : null}
    {rows.map(product => <View key={product._id} style={s.rowCard}>
      <TouchableOpacity style={s.rowMain} onPress={() => navigation.navigate('CompanyProductDetails', { product })}>
        {imageUri(product.images?.[0]) ? <Image source={{ uri: imageUri(product.images[0]) }} style={s.rowImage} /> : <View style={s.rowImagePlaceholder} />}
        <View style={s.rowText}><Text style={s.rowTitle} numberOfLines={1}>{product.name}</Text><Text style={s.rowSubtext}>{product.brand?.map(brand => brand.name).join(', ') || 'No brand'}</Text>
        <Text style={s.text}>₹{product.price || 0} · {product.quantity || 0} {product.unit}</Text>
        </View>
      </TouchableOpacity>
      <View style={s.rowActions}>
        <TouchableOpacity style={s.rowEdit} onPress={() => navigation.navigate('CompanyProductForm', { product })}><Text style={s.rowEditText}>Edit</Text></TouchableOpacity>
        <TouchableOpacity style={s.rowDelete} disabled={busy} onPress={() => confirmCompanyDelete('Delete this product?', () => remove(product._id))}><Text style={s.rowDeleteText}>×</Text></TouchableOpacity>
      </View>
    </View>)}
  </CompanyPage>;
}

export function CompanyProductForm({ navigation, route }) {
  const product = route.params?.product;
  const resource = useCompanyData(loadBrandOptions);
  const [draft, setDraft] = useState({ name: product?.name || '', brand: idOf(product?.brand?.[0]) || route.params?.brandId || '', category: idOf(product?.category), description: product?.description || '', price: String(product?.price ?? 0), quantity: String(product?.quantity ?? 0), unit: product?.unit || '', images: [] });
  const [busy, setBusy] = useState(false);
  const field = key => value => setDraft(old => ({ ...old, [key]: value }));
  const brands = resource.data?.brands || [];
  const selectedBrand = brands.find(brand => brand._id === draft.brand);
  const category = idOf(selectedBrand?.category) || draft.category;
  const pick = async () => {
    try { const images = await pickCompanyImages(true); if (images?.length) field('images')(images); }
    catch (error) { Alert.alert('Photo library', companyError(error)); }
  };
  const save = async () => {
    if (!draft.name.trim() || !selectedBrand || !category) { Alert.alert('Missing details', 'Enter a product name and select your brand and category.'); return; }
    if (![draft.price, draft.quantity].every(value => String(value).trim() && Number.isFinite(Number(value)) && Number(value) >= 0)) { Alert.alert('Invalid details', 'Price and quantity must be valid non-negative numbers.'); return; }
    setBusy(true);
    try { await saveCompanyProduct({ ...draft, category }, product?._id); navigation.goBack(); }
    catch (error) { Alert.alert('Unable to save product', companyError(error)); }
    finally { setBusy(false); }
  };
  return <CompanyPage title={product ? 'Edit Product' : 'Add Product'} navigation={navigation} resource={resource}>
    <View style={s.card}>
      {!brands.length && !resource.loading ? <CompanyButton title="Create a Brand First" onPress={() => navigation.navigate('CompanyBrandForm')} /> : null}
      <CompanyField label="Product Name" value={draft.name} onChangeText={field('name')} />
      <CompanySelect label="Brand" value={draft.brand} onChange={field('brand')} options={brands} />
      <Text style={s.label}>Category</Text><Text style={s.text}>{selectedBrand?.category?.name || resource.data?.categories.find(item => item._id === category)?.name || 'Select a brand'}</Text>
      {!idOf(selectedBrand?.category) ? <CompanySelect label="Category" value={draft.category} onChange={field('category')} options={resource.data?.categories || []} /> : null}
      <CompanyField label="Price (₹)" value={draft.price} onChangeText={field('price')} keyboardType="decimal-pad" />
      <CompanyField label="Quantity" value={draft.quantity} onChangeText={field('quantity')} keyboardType="decimal-pad" />
      <CompanyField label="Unit" value={draft.unit} onChangeText={field('unit')} placeholder="kg, litre, pack..." />
      <CompanyField label="Description" value={draft.description} onChangeText={field('description')} multiline />
      {(draft.images.length ? draft.images : product?.images || []).map((asset, index) => <Image key={index} source={{ uri: imageUri(asset) }} style={s.image} />)}
      <CompanyButton secondary title="Choose Images (up to 5)" disabled={busy} onPress={pick} />
      {draft.images.length ? <CompanyButton secondary title="Discard Selected Images" onPress={() => field('images')([])} /> : null}
      {product ? <Text style={s.text}>Choosing new images replaces the existing images when you save.</Text> : null}
      <CompanyButton title={busy ? 'Saving...' : 'Save Product'} disabled={busy || !brands.length} onPress={save} />
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
      <Text style={s.title}>{current.name}</Text><Text style={s.text}>{current.brand?.map(brand => brand.name).join(', ')}</Text>
      <Text style={s.text}>₹{current.price || 0} · {current.quantity || 0} {current.unit}</Text>
      <Text style={s.text}>{current.description || 'No description added.'}</Text>
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
      <Text style={s.title}>{category.name}</Text><Text style={s.text}>{resource.data.brands.filter(brand => idOf(brand.category) === category._id).length} brands</Text>
    </TouchableOpacity>)}
    {!categories.length && !resource.loading ? <Text style={s.text}>No categories found.</Text> : null}
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
    {brands.map(brand => <TouchableOpacity key={brand._id} style={s.card} onPress={() => navigation.navigate('CompanyProducts', { brandId: brand._id, brandName: brand.name })}><Text style={s.title}>{brand.name}</Text><Text style={s.text}>Brand</Text></TouchableOpacity>)}
    {products.map(product => <TouchableOpacity key={product._id} style={s.card} onPress={() => navigation.navigate('CompanyProductDetails', { product })}><Text style={s.title}>{product.name}</Text><Text style={s.text}>Product · ₹{product.price || 0}</Text></TouchableOpacity>)}
    {query.trim() && !brands.length && !products.length && !resource.loading ? <Text style={s.text}>No results found.</Text> : null}
  </CompanyPage>;
}
