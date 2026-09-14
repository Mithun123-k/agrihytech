import AppTextInput from '../../components/common/AppTextInput';
import AppText from '../../components/common/AppText';
import React, { useCallback, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, RefreshControl, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import ProductHeader from '../../components/product/ProductHeader';
import { responsiveFont, scale } from '../../utils/responsive';
import { companyError } from '../../features/company/companyAPI';

export function useCompanyData(loader) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const sequence = useRef(0);
  const reload = useCallback(async () => {
    const request = ++sequence.current;
    setLoading(true);
    setError('');
    try {
      const result = await loader();
      if (request === sequence.current) setData(result);
    } catch (reason) {
      if (request === sequence.current) setError(companyError(reason));
    } finally {
      if (request === sequence.current) setLoading(false);
    }
  }, [loader]);
  useFocusEffect(useCallback(() => {
    reload();
    return () => { sequence.current += 1; };
  }, [reload]));
  return { data, loading, error, reload };
}

export function CompanyPage({ title, navigation, children, resource, tab = false }) {
  return <KeyboardAvoidingView style={s.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ProductHeader title={title} navigation={navigation} />
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[s.content, tab && s.tabContent]}
      refreshControl={resource ? <RefreshControl refreshing={resource.loading} onRefresh={resource.reload} colors={['#4C7A1E']} /> : undefined}>
      {resource?.error ? <View style={s.card}><AppText style={s.error}>{resource.error}</AppText><CompanyButton title="Retry" onPress={resource.reload} /></View> : null}
      {resource?.loading && !resource.data ? <ActivityIndicator color="#4C7A1E" /> : children}
    </ScrollView>
  </KeyboardAvoidingView>;
}
export function CompanyButton({ title, onPress, disabled, secondary, danger }) {
  return <TouchableOpacity accessibilityRole="button" disabled={disabled} onPress={onPress}
    style={[s.button, secondary && s.secondary, danger && s.danger, disabled && s.disabled]}>
    <AppText style={[s.buttonText, secondary && s.secondaryText]}>{title}</AppText>
  </TouchableOpacity>;
}
export function CompanyField({ label, value, onChangeText, ...props }) {
  return <View style={s.field}><AppText style={s.label}>{label}</AppText><AppTextInput accessibilityLabel={label} style={s.input} value={String(value ?? '')} onChangeText={onChangeText} placeholderTextColor="#888" {...props} /></View>;
}
export function CompanySelect({ label, value, onChange, options }) {
  return <View style={s.field}><AppText style={s.label}>{label}</AppText><View style={s.select}><Picker accessibilityLabel={label} selectedValue={value} onValueChange={onChange}>
    <Picker.Item label={`Select ${label.toLowerCase()}`} value="" />
    {options.map(item => <Picker.Item key={item._id} label={item.name} value={item._id} />)}
  </Picker></View></View>;
}
export async function pickCompanyImages(multiple = false) {
  const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: multiple ? 5 : 1, quality: 0.8 });
  if (result.errorCode) throw new Error(result.errorMessage || 'Unable to open photo library');
  return result.didCancel ? null : result.assets || null;
}
export function confirmCompanyDelete(title, action) {
  Alert.alert(title, 'This cannot be undone.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: action },
  ]);
}
export const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F5F6F2' },
  content: { padding: scale(16), paddingBottom: scale(35) },
  tabContent: { paddingBottom: scale(120) },
  card: { backgroundColor: '#fff', borderRadius: scale(18), padding: scale(16), marginBottom: scale(14), elevation: 2 },
  title: { fontSize: responsiveFont(20), fontWeight: '600', color: '#222', marginBottom: scale(10) },
  text: { fontSize: responsiveFont(14), color: '#555', marginBottom: scale(8) },
  label: { fontSize: responsiveFont(14), color: '#333', marginBottom: scale(6) },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: scale(12), padding: scale(12), color: '#222', backgroundColor: '#fff' },
  field: { marginBottom: scale(14) },
  select: { borderWidth: 1, borderColor: '#DDD', borderRadius: scale(12), backgroundColor: '#fff' },
  button: { backgroundColor: '#4C7A1E', padding: scale(13), borderRadius: scale(12), alignItems: 'center', marginVertical: scale(5) },
  buttonText: { color: '#fff', fontSize: responsiveFont(14), fontWeight: '600' },
  secondary: { backgroundColor: '#EDF2E9', borderColor: '#4C7A1E', borderWidth: 1 },
  secondaryText: { color: '#4C7A1E' },
  danger: { backgroundColor: '#B93C36' },
  disabled: { opacity: 0.5 },
  image: { width: '100%', height: scale(150), borderRadius: scale(12), resizeMode: 'contain', marginBottom: scale(10) },
  avatar: { width: scale(80), height: scale(80), borderRadius: scale(40), alignSelf: 'center', marginBottom: scale(16) },
  error: { color: '#B42318', marginBottom: scale(10) },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: scale(10) },
  metric: { width: '47%', backgroundColor: '#EDF2E9', borderRadius: scale(14), padding: scale(14), marginBottom: scale(10) },
  number: { fontSize: responsiveFont(24), fontWeight: '700', color: '#4C7A1E' },
  rowCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: scale(18), padding: scale(12), marginBottom: scale(12), borderWidth: 1, borderColor: '#E8EEE3', elevation: 2, shadowColor: '#274415', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
  rowMain: { flex: 1, flexDirection: 'row', alignItems: 'center', minWidth: 0 },
  rowImage: { width: scale(64), height: scale(64), borderRadius: scale(14), resizeMode: 'cover', backgroundColor: '#EDF2E9' },
  rowImagePlaceholder: { width: scale(64), height: scale(64), borderRadius: scale(14), backgroundColor: '#EDF2E9', borderWidth: 1, borderColor: '#DCE7D5' },
  rowText: { flex: 1, marginLeft: scale(12), minWidth: 0, paddingVertical: scale(2) },
  rowTitle: { fontSize: responsiveFont(16), fontWeight: '700', color: '#202820', marginBottom: scale(5) },
  rowSubtext: { fontSize: responsiveFont(12), color: '#6C7569', marginBottom: scale(3) },
  rowActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginLeft: scale(8) },
  rowEdit: { backgroundColor: '#F1F6ED', paddingHorizontal: scale(11), paddingVertical: scale(9), borderRadius: scale(10), marginLeft: scale(6), borderWidth: 1, borderColor: '#D6E5CC' },
  rowEditText: { color: '#4C7A1E', fontSize: responsiveFont(12), fontWeight: '700' },
  rowDelete: { width: scale(30), height: scale(32), alignItems: 'center', justifyContent: 'center', marginLeft: scale(3), borderRadius: scale(9), backgroundColor: '#FFF2F0' },
  rowDeleteText: { color: '#B93C36', fontSize: responsiveFont(21), lineHeight: responsiveFont(22), fontWeight: '500' },
  moreButton: { width: scale(34), height: scale(34), borderRadius: scale(10), backgroundColor: '#F1F6ED', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#D6E5CC' },
  moreText: { color: '#4C7A1E', fontSize: responsiveFont(18), fontWeight: '700', letterSpacing: 1 },
  dealerMenu: { position: 'absolute', zIndex: 20, right: 0, top: scale(40), minWidth: scale(150), backgroundColor: '#FFF', borderRadius: scale(12), paddingVertical: scale(5), elevation: 8, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
  dealerMenuItem: { paddingHorizontal: scale(14), paddingVertical: scale(11) },
  dealerMenuText: { color: '#333', fontSize: responsiveFont(13), fontWeight: '600' },
  dealerMenuDanger: { color: '#B93C36', fontSize: responsiveFont(13), fontWeight: '600' },
  detailsHero: { alignItems: 'center', backgroundColor: '#FFF', borderRadius: scale(18), padding: scale(22), marginBottom: scale(14), elevation: 2 },
  detailsName: { fontSize: responsiveFont(21), fontWeight: '700', color: '#202820', marginTop: scale(10) },
  detailsSub: { fontSize: responsiveFont(13), color: '#6C7569', marginTop: scale(4) },
  detailLabel: { fontSize: responsiveFont(12), color: '#777', marginTop: scale(10), marginBottom: scale(3) },
  detailValue: { fontSize: responsiveFont(15), color: '#222', marginBottom: scale(3) },
  dealerAvatar: { width: scale(54), height: scale(54), borderRadius: scale(27), backgroundColor: '#EDF2E9', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#D6E5CC' },
  dealerAvatarText: { color: '#4C7A1E', fontSize: responsiveFont(20), fontWeight: '700' },
  statusActive: { color: '#4C7A1E', fontSize: responsiveFont(11), fontWeight: '700' },
  statusSuspended: { color: '#B93C36', fontSize: responsiveFont(11), fontWeight: '700' },
});
