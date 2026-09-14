import AppText from '../../components/common/AppText';
import React, { useCallback, useState } from 'react';
import { View, Text, Image, Alert, Linking, ImageBackground, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RazorpayCheckout from 'react-native-razorpay';
import { logout, updateProfile, loadUser } from '../../features/auth/authSlice';
import { getCompanyProfile, getCompanyProducts, getCompanyDealers, getCompanyDealerDetails, getCompanyCategories, assignCompanyDealer, removeCompanyDealer, setCompanyDealerStatus, getCompanySubscription, getCompanyPlans, startCompanyTrial, createCompanyOrder, verifyCompanyPayment, companyError, appendCompanyImage } from '../../features/company/companyAPI';
import { CompanyPage, CompanyButton, CompanyField, useCompanyData, pickCompanyImages, s } from './shared';
import LanguageSelector from '../../components/common/LanguageSelector';

const loadDashboard = async () => {
  const [profile, products, dealers] = await Promise.all([getCompanyProfile(), getCompanyProducts(), getCompanyDealers()]);
  return { profile, products, dealers };
};
const companyMenu = [
  ['My Products', 'CompanyProducts'], ['My Dealers', 'CompanyDealers'],
  ['Subscription', 'CompanySubscription'], ['Edit Profile', 'CompanySettings'],
];
export function subscriptionActive(subscription) {
  return Boolean(subscription?.isActive && new Date(subscription.endDate).getTime() > Date.now());
}
const dateLabel = value => value ? new Date(value).toLocaleDateString() : '—';

export function CompanyDashboard({ navigation }) {
  const resource = useCompanyData(loadDashboard);
  const data = resource.data;
  const metrics = [
    ['Products', data?.products.length || 0],
    ['Dealers', data?.dealers.length || 0],
    ['Active Dealers', data?.dealers.filter(dealer => dealer.companyDealerStatus === 'ACTIVE').length || 0],
  ];
  return <CompanyPage title={data?.profile.companyName || 'Company'} navigation={navigation} resource={resource} tab>
    <View style={s.card}><AppText style={s.title}>Welcome, {data?.profile.contactPerson || 'Company'}</AppText><AppText style={s.text}>Manage your products and dealer network.</AppText>
      <AppText style={s.text}>{subscriptionActive(data?.profile.subscription) ? `Subscription active until ${dateLabel(data.profile.subscription.endDate)}` : 'Subscription inactive'}</AppText>
    </View>
    <View style={s.row}>{metrics.map(([label, value]) => <View key={label} style={s.metric}><AppText style={s.number}>{value}</AppText><AppText style={s.text}>{label}</AppText></View>)}</View>
    {companyMenu.map(([title, screen]) => <CompanyButton key={screen} title={title} onPress={() => navigation.navigate(screen)} />)}
  </CompanyPage>;
}

export function CompanyDealers({ navigation }) {
  const resource = useCompanyData(getCompanyDealers);
  const [mobile, setMobile] = useState('');
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const act = async action => {
    setBusy(true);
    try { await action(); setMobile(''); await resource.reload(); }
    catch (error) { Alert.alert('Unable to update dealers', companyError(error)); }
    finally { setBusy(false); }
  };
  const rows = (resource.data || []).filter(dealer => `${dealer.firmName} ${dealer.proprietorName} ${dealer.mobile}`.toLowerCase().includes(search.toLowerCase()));
  return <CompanyPage title="My Dealers" navigation={navigation} resource={resource}>
    <View style={s.card}>
      <CompanyField label="Registered dealer mobile number" value={mobile} onChangeText={value => setMobile(value.replace(/\D/g, '').slice(0, 10))} keyboardType="phone-pad" maxLength={10} />
      <CompanyButton title={busy ? 'Please wait...' : 'Add Dealer'} disabled={busy || !/^\d{10}$/.test(mobile)} onPress={() => act(() => assignCompanyDealer(mobile))} />
    </View>
    <CompanyField label="Search dealers" value={search} onChangeText={setSearch} />
    {!rows.length && !resource.loading ? <AppText style={s.text}>No dealers found.</AppText> : null}
    {rows.map(dealer => <View key={dealer._id} style={s.rowCard}>
      <View style={s.rowMain}>
        <View style={s.dealerAvatar}><AppText style={s.dealerAvatarText}>{(dealer.firmName || dealer.proprietorName || 'D').slice(0, 1).toUpperCase()}</AppText></View>
        <View style={s.rowText}>
          <AppText style={s.rowTitle} numberOfLines={1}>{dealer.firmName || dealer.proprietorName || 'Dealer'}</AppText>
          <AppText style={s.rowSubtext} numberOfLines={1}>{dealer.proprietorName || dealer.mobile || 'Registered dealer'}</AppText>
          <AppText style={s.rowSubtext} numberOfLines={1}>{[dealer.location?.village, dealer.location?.district, dealer.location?.state].filter(Boolean).join(', ') || 'Location not added'}</AppText>
          <AppText style={dealer.companyDealerStatus === 'SUSPENDED' ? s.statusSuspended : s.statusActive}>{dealer.companyDealerStatus || 'ACTIVE'}</AppText>
        </View>
      </View>
      <View style={s.rowActions}>
        <TouchableOpacity style={s.moreButton} onPress={() => setOpenMenu(openMenu === dealer._id ? null : dealer._id)}><AppText style={s.moreText}>•••</AppText></TouchableOpacity>
        {openMenu === dealer._id ? <View style={s.dealerMenu}>
          {dealer.mobile ? <TouchableOpacity style={s.dealerMenuItem} onPress={() => { setOpenMenu(null); Linking.openURL(`tel:${dealer.mobile}`).catch(() => Alert.alert('Unable to open dialler')); }}><AppText style={s.dealerMenuText}>Call dealer</AppText></TouchableOpacity> : null}
          <TouchableOpacity style={s.dealerMenuItem} disabled={busy} onPress={() => { setOpenMenu(null); act(() => setCompanyDealerStatus(dealer._id, dealer.companyDealerStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED')); }}><AppText style={s.dealerMenuText}>{dealer.companyDealerStatus === 'SUSPENDED' ? 'Activate dealer' : 'Suspend dealer'}</AppText></TouchableOpacity>
          <TouchableOpacity style={s.dealerMenuItem} onPress={() => { setOpenMenu(null); navigation.navigate('CompanyDealerDetails', { dealerId: dealer._id, dealer }); }}><AppText style={s.dealerMenuText}>View details</AppText></TouchableOpacity>
          <TouchableOpacity style={s.dealerMenuItem} disabled={busy} onPress={() => { setOpenMenu(null); Alert.alert('Remove dealer?', 'The dealer will be disconnected from your company.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Remove', style: 'destructive', onPress: () => act(() => removeCompanyDealer(dealer._id)) }]); }}><AppText style={s.dealerMenuDanger}>Remove dealer</AppText></TouchableOpacity>
        </View> : null}
      </View>
    </View>)}
  </CompanyPage>;
}

export function CompanyDealerDetails({ navigation, route }) {
  const dealerId = route.params?.dealerId;
  const initialDealer = route.params?.dealer;
  const loadDetails = useCallback(async () => {
    const dealer = initialDealer || await getCompanyDealerDetails(dealerId);
    const categories = await getCompanyCategories().catch(() => []);
    return { dealer, categories };
  }, [dealerId, initialDealer]);
  const resource = useCompanyData(loadDetails);
  const dealer = resource.data?.dealer || route.params?.dealer || {};
  const categoryOptions = resource.data?.categories || [];
  const location = [dealer.location?.village, dealer.location?.district, dealer.location?.state, dealer.location?.pincode].filter(Boolean).join(', ');
  const categories = [...new Map((dealer.dealerBrands || []).map(brand => { const value = typeof brand.category === 'string' ? brand.category : brand.category?._id || brand.category?.name; const found = categoryOptions.find(item => item._id === value || item.id === value); return [found?._id || value, found?.name || (typeof brand.category === 'object' ? brand.category?.name : '')]; }).filter(([, name]) => name)).values()];
  return <CompanyPage title="Dealer Details" navigation={navigation} resource={resource}>
    <View style={s.detailsHero}><View style={s.dealerAvatar}><AppText style={s.dealerAvatarText}>{(dealer.firmName || dealer.proprietorName || 'D').slice(0, 1).toUpperCase()}</AppText></View><AppText style={s.detailsName}>{dealer.firmName || 'Dealer'}</AppText><AppText style={s.detailsSub}>{dealer.proprietorName || dealer.mobile || ''}</AppText></View>
    <View style={s.card}><AppText style={s.title}>Dealer Information</AppText>
      <AppText style={s.detailLabel}>Mobile</AppText><AppText style={s.detailValue}>{dealer.mobile || 'Not available'}</AppText>
      <AppText style={s.detailLabel}>Email</AppText><AppText style={s.detailValue}>{dealer.email || 'Not available'}</AppText>
      <AppText style={s.detailLabel}>GST Number</AppText><AppText style={s.detailValue}>{dealer.gstNumber || 'Not available'}</AppText>
      <AppText style={s.detailLabel}>Address</AppText><AppText style={s.detailValue}>{dealer.address || 'Not added'}</AppText>
      <AppText style={s.detailLabel}>Location</AppText><AppText style={s.detailValue}>{location || 'Not added'}</AppText>
      <AppText style={s.detailLabel}>Status</AppText><AppText style={dealer.companyDealerStatus === 'SUSPENDED' ? s.statusSuspended : s.statusActive}>{dealer.companyDealerStatus || 'ACTIVE'}</AppText>
      <AppText style={s.detailLabel}>Registered on</AppText><AppText style={s.detailValue}>{dealer.createdAt ? new Date(dealer.createdAt).toLocaleDateString() : 'Not available'}</AppText>
    </View>
    <View style={s.card}><AppText style={s.title}>Connected Brands</AppText><AppText style={s.detailValue}>{dealer.dealerBrands?.length ? dealer.dealerBrands.map(brand => brand.name).filter(Boolean).join(', ') : 'No brands connected'}</AppText></View>
    <View style={s.card}><AppText style={s.title}>Categories</AppText><AppText style={s.detailValue}>{categories.length ? categories.join(', ') : 'No categories connected'}</AppText></View>
  </CompanyPage>;
}

export function CompanyProfile({ navigation }) {
  const resource = useCompanyData(getCompanyProfile);
  const dispatch = useDispatch();
  const user = resource.data;
  const signOut = () => Alert.alert('Log out?', 'You can log in again with your company mobile number.', [
    { text: 'Cancel', style: 'cancel' }, { text: 'Log out', onPress: async () => {
      try { await AsyncStorage.removeItem('token'); dispatch(logout()); }
      catch (error) { Alert.alert('Unable to log out', companyError(error)); }
    } },
  ]);
  return <View style={profileStyles.container}>
    <StatusBar barStyle="dark-content" />
    <ImageBackground source={require('../../assets/images/bg1.png')} style={profileStyles.background} resizeMode="cover" />
    <View style={profileStyles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#222" /></TouchableOpacity>
      <AppText style={profileStyles.headerTitle}>Profile</AppText><View style={{ width: 24 }} />
    </View>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={profileStyles.content}>
      {resource.loading && !user ? <AppText style={profileStyles.loading}>Loading profile...</AppText> : null}
      {resource.error ? <AppText style={profileStyles.error}>{resource.error}</AppText> : null}
      <View style={profileStyles.profileCard}>
        <View style={profileStyles.profileRow}>
          {user?.profileimage ? <Image source={{ uri: user.profileimage }} style={profileStyles.avatar} /> : <View style={profileStyles.avatarPlaceholder}><Ionicons name="business-outline" size={30} color="#4C8C2B" /></View>}
          <View style={{ flex: 1, marginLeft: 14 }}><AppText style={profileStyles.name} numberOfLines={1}>{user?.companyName || 'Company'}</AppText><AppText style={profileStyles.phone}>{user?.mobile || 'NAN'}</AppText></View>
        </View>
        <TouchableOpacity style={profileStyles.edit} onPress={() => navigation.navigate('CompanySettings')}><Ionicons name="create-outline" size={21} color="#4C8C2B" /></TouchableOpacity>
      </View>
      <View style={profileStyles.infoCard}>
        <AppText style={profileStyles.sectionTitle}>Company Management</AppText>
        {companyMenu.map(([title, screen], index) => <View key={screen}>
          {index ? <View style={profileStyles.divider} /> : null}
          <TouchableOpacity style={profileStyles.menuRow} onPress={() => navigation.navigate(screen)}><Ionicons name={profileIcons[screen]} size={21} color="#4C8C2B" /><AppText style={profileStyles.menuText}>{title}</AppText><Ionicons name="chevron-forward" size={18} color="#999" /></TouchableOpacity>
        </View>)}
        <View style={profileStyles.divider} />
        <View style={profileStyles.menuRow}><Ionicons name="language-outline" size={21} color="#4C8C2B" /><AppText style={profileStyles.menuText}>Language</AppText><LanguageSelector /></View>
        <View style={profileStyles.divider} />
        <TouchableOpacity style={profileStyles.menuRow} onPress={signOut}><Ionicons name="power-outline" size={21} color="#4C8C2B" /><AppText style={profileStyles.menuText}>Logout</AppText><Ionicons name="chevron-forward" size={18} color="#999" /></TouchableOpacity>
      </View>
    </ScrollView>
  </View>;
}

const profileIcons = { CompanyProducts: 'cube-outline', CompanyDealers: 'people-outline', CompanySubscription: 'card-outline', CompanySettings: 'create-outline' };
const profileStyles = {
  container: { flex: 1, backgroundColor: '#EDF2E9' },
  background: { position: 'absolute', top: 0, left: 0, right: 0, height: 210 },
  header: { height: 120, paddingHorizontal: 20, paddingTop: 42, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#222' },
  content: { paddingBottom: 120 },
  profileCard: { backgroundColor: '#FFF', marginHorizontal: 20, marginTop: 10, borderRadius: 18, padding: 18, elevation: 3 },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 62, height: 62, borderRadius: 31 },
  avatarPlaceholder: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#EDF2E9', alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 18, fontWeight: '700', color: '#111' },
  phone: { fontSize: 13, color: '#777', marginTop: 4 },
  edit: { position: 'absolute', right: 16, top: 16, backgroundColor: '#EDF2E9', padding: 8, borderRadius: 20 },
  infoCard: { backgroundColor: '#FFF', marginHorizontal: 20, marginTop: 18, borderRadius: 18, paddingVertical: 12, elevation: 2 },
  sectionTitle: { fontSize: 14, fontWeight: '700', paddingHorizontal: 18, marginBottom: 4, color: '#222' },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 16 },
  menuText: { flex: 1, marginLeft: 12, fontSize: 14, color: '#222' },
  divider: { height: 1, backgroundColor: '#EEE', marginHorizontal: 18 },
  loading: { textAlign: 'center', marginTop: 20, color: '#555' },
  error: { color: '#B42318', marginHorizontal: 20, marginTop: 12 },
};

export function CompanySettings({ navigation }) {
  const resource = useCompanyData(getCompanyProfile);
  return <CompanyPage title="Edit Profile" navigation={navigation} resource={resource}>
    {resource.data ? <CompanyProfileForm key={resource.data._id} profile={resource.data} navigation={navigation} /> : null}
  </CompanyPage>;
}
function CompanyProfileForm({ profile, navigation }) {
  const dispatch = useDispatch();
  const [draft, setDraft] = useState({
    companyName: profile.companyName || '', contactPerson: profile.contactPerson || '', email: profile.email || '', gstNumber: profile.gstNumber || '', address: profile.address || '',
    state: profile.location?.state || '', district: profile.location?.district || '', village: profile.location?.village || '', pincode: profile.location?.pincode || '',
  });
  const [image, setImage] = useState(null);
  const [busy, setBusy] = useState(false);
  const fields = [['companyName', 'Company Name'], ['contactPerson', 'Contact Person'], ['email', 'Email'], ['gstNumber', 'GST Number'], ['address', 'Address'], ['state', 'State'], ['district', 'District'], ['village', 'City / Village'], ['pincode', 'Pincode']];
  const pick = async () => {
    try { const images = await pickCompanyImages(); if (images?.length) setImage(images[0]); }
    catch (error) { Alert.alert('Photo library', companyError(error)); }
  };
  const save = async () => {
    if (!['companyName', 'contactPerson', 'state', 'district', 'village'].every(key => draft[key].trim()) || !/^\d{6}$/.test(draft.pincode)) {
      Alert.alert('Invalid details', 'Enter your company name, contact person and complete location with a 6-digit pincode.'); return;
    }
    if (draft.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) { Alert.alert('Invalid email', 'Enter a valid email address.'); return; }
    const form = new FormData();
    ['companyName', 'contactPerson', 'email', 'gstNumber', 'address'].forEach(key => form.append(key, draft[key].trim()));
    form.append('location', JSON.stringify({ state: draft.state.trim(), district: draft.district.trim(), village: draft.village.trim(), pincode: draft.pincode }));
    appendCompanyImage(form, 'profileimage', image);
    setBusy(true);
    try { await dispatch(updateProfile(form)).unwrap(); navigation.goBack(); }
    catch (error) { Alert.alert('Unable to update profile', typeof error === 'string' ? error : companyError(error)); }
    finally { setBusy(false); }
  };
  return <View style={s.card}>
    {image?.uri || profile.profileimage ? <Image style={s.avatar} source={{ uri: image?.uri || profile.profileimage }} /> : null}
    <CompanyButton secondary title="Change Profile Photo" disabled={busy} onPress={pick} />
    <AppText style={s.text}>Mobile: {profile.mobile}</AppText>
    {fields.map(([key, label]) => <CompanyField key={key} label={label} value={draft[key]} onChangeText={value => setDraft(old => ({ ...old, [key]: value }))} keyboardType={key === 'pincode' ? 'number-pad' : key === 'email' ? 'email-address' : 'default'} autoCapitalize={key === 'email' ? 'none' : 'sentences'} />)}
    <CompanyButton title={busy ? 'Saving...' : 'Save Changes'} disabled={busy} onPress={save} />
  </View>;
}

const loadSubscription = async () => {
  const [plans, subscription] = await Promise.all([getCompanyPlans(), getCompanySubscription()]);
  return { plans, subscription };
};
export function CompanySubscription({ navigation }) {
  const resource = useCompanyData(loadSubscription);
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const [busy, setBusy] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const plans = resource.data?.plans || [];
  const subscription = resource.data?.subscription;
  const current = subscription?.current;
  const selected = plans.find(plan => plan._id === selectedId) || plans.find(plan => plan.price > 0) || plans[0];
  const trial = plans.find(plan => plan.price === 0);
  const subscribe = async plan => {
    if (busy || !plan) return;
    setBusy(true);
    try {
      if (Number(plan.price) === 0) {
        await startCompanyTrial();
      } else {
        const order = await createCompanyOrder(plan._id);
        const payment = await RazorpayCheckout.open({ key: order.key, amount: order.amount, currency: order.currency, name: 'AgriHytech', description: plan.name, order_id: order.orderId, prefill: { contact: user?.mobile || '', email: user?.email || '' }, theme: { color: '#4C7A1E' } });
        await verifyCompanyPayment({ razorpay_order_id: payment.razorpay_order_id, razorpay_payment_id: payment.razorpay_payment_id, razorpay_signature: payment.razorpay_signature, planId: plan._id });
      }
      // The session reload switches newly registered companies into their workspace.
      await dispatch(loadUser()).unwrap();
      Alert.alert('Success', Number(plan.price) === 0 ? 'Free trial activated' : 'Subscription activated');
    } catch (error) {
      Alert.alert('Subscription', typeof error === 'string' ? error : companyError(error));
    } finally { setBusy(false); }
  };
  return <CompanyPage title="Subscription" navigation={navigation} resource={resource}>
    <View style={s.card}><AppText style={s.title}>{current?.planId?.name || 'Choose your plan'}</AppText><AppText style={s.text}>{subscriptionActive(current) ? 'Active' : 'Inactive'}</AppText>
      {current?.startDate ? <AppText style={s.text}>{dateLabel(current.startDate)} – {dateLabel(current.endDate)}</AppText> : null}
    </View>
    {plans.map(plan => <View key={plan._id} style={s.card}>
      <AppText style={s.title}>{plan.name}{plan.isRecommended ? ' · Recommended' : ''}</AppText><AppText style={s.number}>{plan.currency || 'INR'} {plan.price}</AppText><AppText style={s.text}>{plan.duration} days</AppText>
      {(plan.features || []).map((feature, index) => <AppText key={index} style={s.text}>✓ {feature}</AppText>)}
      <CompanyButton secondary={selected?._id !== plan._id} title={selected?._id === plan._id ? 'Selected' : 'Select Plan'} disabled={busy || (plan.price === 0 && (subscription?.trialUsed || subscriptionActive(current)))} onPress={() => setSelectedId(plan._id)} />
    </View>)}
    <CompanyButton title={busy ? 'Please wait...' : 'Continue'} disabled={busy || !selected || (selected.price === 0 && (subscription?.trialUsed || subscriptionActive(current)))} onPress={() => subscribe(selected)} />
    {trial && !subscription?.trialUsed && !subscriptionActive(current) ? <CompanyButton secondary title={`Start ${trial.duration}-day Free Trial`} disabled={busy} onPress={() => subscribe(trial)} /> : null}
    {!plans.length && !resource.loading ? <AppText style={s.text}>No subscription plans available.</AppText> : null}
    <AppText style={s.title}>Subscription History</AppText>
    {(subscription?.history || []).map((item, index) => <View style={s.card} key={item._id || index}>
      <AppText style={s.title}>{item.planId?.name || 'Previous plan'}</AppText><AppText style={s.text}>{item.paymentStatus || 'TRIAL'} · {item.currency || 'INR'} {item.amount || 0}</AppText>
      <AppText style={s.text}>{dateLabel(item.startDate)} – {dateLabel(item.endDate)}</AppText>
    </View>)}
    {!subscription?.history?.length ? <AppText style={s.text}>No previous subscriptions.</AppText> : null}
  </CompanyPage>;
}
