import AppText from '../../components/common/AppText';
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  FlatList,
  StatusBar,
  Platform,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import Icon from 'react-native-vector-icons/Ionicons';
import { getMandiPrices, getMandiCommodities, mandiError } from '../../features/mandi/mandiAPI';

const { width, height } = Dimensions.get('window');

/* -------------------- Responsive Helpers -------------------- */

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = size => (width / guidelineBaseWidth) * size;

const verticalScale = size =>
  (height / guidelineBaseHeight) * size;

const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const isSmallPhone = width < 360;
const isTablet = width >= 768;

/* -------------------- Dummy Data -------------------- */

const mandiData = [
  {
    id: '1',
    name: 'Banana',
    hindi: 'केला',
    price: '₹ 2500 / Quintal',
    image:require('../../assets/images/banana.png'),
  },
  {
    id: '2',
    name: 'Green Chilli',
    hindi: 'हरी मिर्च',
    price: '₹ 2300 / Quintal',
    image:require('../../assets/images/banana.png'),
  },
  {
    id: '3',
    name: 'Cucumber',
    hindi: 'खीरा',
    price: '₹ 1800 / Quintal',
    image:require('../../assets/images/banana.png'),
  },
  {
    id: '4',
    name: 'Tomato',
    hindi: 'टमाटर',
    price: '₹ 1500 / Quintal',
   image:require('../../assets/images/banana.png'),
  },
  {
    id: '5',
    name: 'Apple',
    hindi: 'सेब',
    price: '₹ 4000 / Quintal',
    image:require('../../assets/images/banana.png'),
  },
  {
    id: '6',
    name: 'Pomegranate',
    hindi: 'अनार',
    price: '₹ 5000 / Quintal',
    image:require('../../assets/images/banana.png'),
  },
  {
    id: '7',
    name: 'Cauliflower',
    hindi: 'फूलगोभी',
    price: '₹ 1200 / Quintal',
    image:require('../../assets/images/banana.png'),
  },
  {
    id: '8',
    name: 'Potato',
    hindi: 'आलू',
    price: '₹ 900 / Quintal',
    image:require('../../assets/images/banana.png'),
  },
];

/* -------------------- Component -------------------- */

const MandiBhavScreen = ({navigation, route}) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commodity, setCommodity] = useState('');
  const [appliedCommodity, setAppliedCommodity] = useState('');
  const [commodityOptions, setCommodityOptions] = useState([]);
  const load = useCallback(async (selectedCommodity = '') => {
    setLoading(true); setError('');
    try { const [prices, options] = await Promise.all([getMandiPrices({ ...route.params, commodity: selectedCommodity }), getMandiCommodities(route.params)]); setRecords(prices); setCommodityOptions(options); }
    catch (reason) { setError(mandiError(reason)); }
    finally { setLoading(false); }
  }, [route.params]);
  useEffect(() => { load(); }, [load]);
  const commodities = commodityOptions.length ? commodityOptions : [...new Set(records.map(item => item.commodity).filter(Boolean))];
  const visibleRecords = appliedCommodity ? records.filter(item => item.commodity === appliedCommodity) : records;
  const mandiData = visibleRecords.map((item, index) => ({
    id: `${item.commodity || 'commodity'}-${index}`,
    name: item.commodity || item.variety || 'Commodity',
    hindi: item.market || route.params?.market || '',
    price: `₹ ${item.modal_price || item.max_price || item.min_price || '—'} / Quintal`,
    image: require('../../assets/images/banana.png'),
  }));
  /* -------------------- Render Item -------------------- */

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.card}
      >
        {/* Left Image */}
        <View style={styles.itemIcon}><Icon name="leaf-outline" size={moderateScale(30)} color="#2FA52F" /></View>

        {/* Center Content */}
        <View style={styles.centerContent}>
          <AppText
            numberOfLines={1}
            adjustsFontSizeToFit
            style={styles.itemTitle}
          >
            {item.name}
          </AppText>

          <AppText
            numberOfLines={1}
            adjustsFontSizeToFit
            style={styles.hindiText}
          >
            {item.hindi}
          </AppText>
        </View>

        {/* Right Content */}
        <View style={styles.rightContent}>
          {/* Today Badge */}
          <View style={styles.badge}>
            <Icon
              name="time"
              size={
                isTablet
                  ? moderateScale(12)
                  : moderateScale(10)
              }
              color="#FFF"
            />

            <AppText style={styles.badgeText}>
              Today
            </AppText>
          </View>

          {/* Price */}
          <AppText
            numberOfLines={1}
            adjustsFontSizeToFit
            style={styles.priceText}
          >
            {item.price}
          </AppText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#F8F8F8"
        barStyle="dark-content"
      />

      {/* -------------------- Header -------------------- */}

      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.backButton}
          onPress={()=> navigation.goBack()}
        >
          <Icon
            name="chevron-back"
            size={
              isTablet
                ? moderateScale(30)
                : moderateScale(24)
            }
            color="#000"
          />
        </TouchableOpacity>

        {/* Title */}
        <AppText
          numberOfLines={1}
          adjustsFontSizeToFit
          style={styles.headerTitle}
        >
          {route.params?.market || 'Mandi Bhav'}
        </AppText>
      </View>

      <View style={styles.filters}>
        <AppText style={styles.filterTitle}>Find Mandi Prices</AppText>
        <AppText style={styles.filterSub}>{route.params?.district || 'Selected district'} · {route.params?.market || 'Selected mandi'}</AppText>
        <View style={styles.picker}><Picker style={styles.pickerText} dropdownIconColor="#222" selectedValue={commodity} onValueChange={setCommodity}><Picker.Item color="#222" label="Select Commodity" value="" />{commodities.map(item => <Picker.Item color="#222" key={item} label={item} value={item} />)}</Picker></View>
        <View style={styles.filterActions}><TouchableOpacity style={styles.resetButton} onPress={() => { setCommodity(''); setAppliedCommodity(''); setRecords([]); load(''); }}><AppText>Reset</AppText></TouchableOpacity><TouchableOpacity style={styles.searchButton} onPress={() => { setAppliedCommodity(commodity); load(commodity); }}><Icon name="search" size={18} color="#FFF" /><AppText style={styles.searchText}>Search Prices</AppText></TouchableOpacity></View>
      </View>

      {/* -------------------- Scrollable List -------------------- */}

      {loading ? <AppText style={styles.message}>Loading latest mandi prices...</AppText> : null}
      {error ? <TouchableOpacity onPress={load}><AppText style={styles.error}>{error}  Tap to retry</AppText></TouchableOpacity> : null}
      {!loading && !error && !mandiData.length ? <AppText style={styles.message}>No prices found for this location.</AppText> : null}
      <FlatList
        data={mandiData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.listContainer}
        removeClippedSubviews={false}
      />
    </SafeAreaView>
  );
};

export default MandiBhavScreen;

/* -------------------- Styles -------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    marginTop:'10%'
  },

  /* -------------------- Header -------------------- */

  header: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: moderateScale(16),

    paddingTop:
      Platform.OS === 'ios'
        ? verticalScale(10)
        : verticalScale(14),

    paddingBottom: verticalScale(18),
  },

  backButton: {
    width: isTablet
      ? moderateScale(58)
      : moderateScale(50),

    height: isTablet
      ? moderateScale(58)
      : moderateScale(50),

    borderRadius: moderateScale(29),

    backgroundColor: '#EFEFEF',

    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    flex: 1,

    marginLeft: moderateScale(16),

    fontSize: isTablet
      ? moderateScale(24)
      : isSmallPhone
      ? moderateScale(18)
      : moderateScale(22),

    fontWeight: '800',
    color: '#000',
  },

  /* -------------------- List -------------------- */

  listContainer: {
    paddingHorizontal: moderateScale(16),

    paddingBottom: verticalScale(30),
  },

  /* -------------------- Card -------------------- */

  card: {
    minHeight: isTablet
      ? verticalScale(120)
      : isSmallPhone
      ? verticalScale(92)
      : verticalScale(102),

    backgroundColor: '#EFEFEF',

    borderRadius: moderateScale(24),

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: moderateScale(14),

    marginBottom: verticalScale(16),
  },

  /* -------------------- Product Image -------------------- */

  itemImage: {
    width: isTablet
      ? moderateScale(90)
      : isSmallPhone
      ? moderateScale(56)
      : moderateScale(72),

    height: isTablet
      ? moderateScale(90)
      : isSmallPhone
      ? moderateScale(56)
      : moderateScale(72),
  },

  /* -------------------- Center Content -------------------- */

  centerContent: {
    flex: 1,

    justifyContent: 'center',

    marginLeft: moderateScale(14),

    paddingRight: moderateScale(8),
  },

  itemTitle: {
    fontSize: isTablet
      ? moderateScale(20)
      : isSmallPhone
      ? moderateScale(14)
      : moderateScale(18),

    fontWeight: '700',
    color: '#2FA52F',
  },

  hindiText: {
    marginTop: verticalScale(4),

    fontSize: isTablet
      ? moderateScale(17)
      : isSmallPhone
      ? moderateScale(12)
      : moderateScale(15),

    fontWeight: '700',
    color: '#2FA52F',
  },

  /* -------------------- Right Content -------------------- */

  rightContent: {
    width: isTablet
      ? '30%'
      : isSmallPhone
      ? '38%'
      : '35%',

    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  /* -------------------- Badge -------------------- */

  badge: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#2FA52F',

    paddingHorizontal: moderateScale(10),

    paddingVertical:
      Platform.OS === 'ios'
        ? verticalScale(5)
        : verticalScale(4),

    borderRadius: moderateScale(20),
  },

  badgeText: {
    marginLeft: moderateScale(4),

    color: '#FFF',

    fontSize: isTablet
      ? moderateScale(12)
      : isSmallPhone
      ? moderateScale(9)
      : moderateScale(11),

    fontWeight: '700',
  },

  /* -------------------- Price -------------------- */

  priceText: {
    marginTop: verticalScale(10),

    fontSize: isTablet
      ? moderateScale(16)
      : isSmallPhone
      ? moderateScale(11)
      : moderateScale(14),

    fontWeight: '700',
    color: '#000',

    textAlign: 'right',
  },
  itemIcon: { width: moderateScale(58), height: moderateScale(58), borderRadius: moderateScale(16), backgroundColor: '#EAF7EA', alignItems: 'center', justifyContent: 'center' },
  message: { textAlign: 'center', color: '#555', paddingHorizontal: 20, paddingVertical: 20 },
  error: { textAlign: 'center', color: '#B42318', paddingHorizontal: 20, paddingVertical: 20 },
  filters: { backgroundColor: '#FFF', marginHorizontal: 16, marginBottom: 16, padding: 16, borderRadius: 20, elevation: 2 },
  filterTitle: { fontSize: 20, fontWeight: '800', color: '#111' },
  filterSub: { fontSize: 13, color: '#666', marginTop: 4, marginBottom: 10 },
  picker: { borderWidth: 1, borderColor: '#E1E5E1', borderRadius: 14, overflow: 'hidden' },
  pickerText: { color: '#222' },
  filterActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, gap: 10 },
  resetButton: { borderWidth: 1, borderColor: '#DDE3DD', borderRadius: 18, paddingHorizontal: 18, paddingVertical: 11 },
  searchButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#16A34A', borderRadius: 18, paddingHorizontal: 18, paddingVertical: 11 },
  searchText: { color: '#FFF', fontWeight: '700' },
});
