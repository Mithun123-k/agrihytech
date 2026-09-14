import AppText from '../../components/common/AppText';
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  FlatList,
  StatusBar,
} from 'react-native';
import { getMandiMarkets, mandiError } from '../../features/mandi/mandiAPI';

const { width, height } = Dimensions.get('window');

/* -------------------- Responsive Helpers -------------------- */

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = size => (width / guidelineBaseWidth) * size;

const verticalScale = size => (height / guidelineBaseHeight) * size;

const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const isTablet = width >= 768;

/* -------------------- Component -------------------- */

const SelectMandiScreen = ({navigation, route}) => {
  const [mandiList, setMandiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const loadMarkets = useCallback(async () => {
    setLoading(true); setError('');
    try { setMandiList(await getMandiMarkets(route.params)); }
    catch (reason) { setError(mandiError(reason)); }
    finally { setLoading(false); }
  }, [route.params]);
  useEffect(() => { loadMarkets(); }, [loadMarkets]);
  /* -------------------- Render Item -------------------- */

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.card}
        onPress={() => navigation.navigate('MandiBhavScreen', { ...route.params, market: item.name })}
      >
        {/* Left Circle */}
        <View style={styles.circleWrapper}>
          <View
            style={[
              styles.innerCircle,
              {
                backgroundColor: item.color,
              },
            ]}
          />
        </View>

        {/* Mandi Name */}
        <AppText style={styles.cardText}>{item.name}</AppText>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#000"
        barStyle="light-content"
      />

      {/* Background Map */}
      <ImageBackground
        source={require('../../assets/images/bgmandi.png')}
        style={styles.mapBackground}
        resizeMode="cover"
        imageStyle={styles.mapImage}
      >
        {/* Main White Card */}
        <View style={styles.mainCard}>
          {/* Title */}
          <AppText style={styles.title}>
            Select <AppText style={styles.greenText}>Mandi</AppText>{' '}
            <AppText style={styles.greenText}></AppText>
          </AppText>

          {/* Subtitle */}
          <AppText style={styles.subTitle}>
            अपना <AppText style={styles.greenText}>मंडी</AppText>{' '}
            चुने!
          </AppText>

          {/* List */}
          {loading ? <AppText style={styles.message}>Loading mandis...</AppText> : null}
          {error ? <TouchableOpacity onPress={loadMarkets}><AppText style={styles.error}>{error}  Tap to retry</AppText></TouchableOpacity> : null}
          {!loading && !error && !mandiList.length ? <AppText style={styles.message}>No mandis found for this district.</AppText> : null}
          <FlatList
            data={mandiList}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: verticalScale(20),
            }}
          />
        </View>

        {/* Bottom Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.button}
          onPress={()=>navigation.navigate('MandiBhavScreen', route.params)}
        >
          <AppText style={styles.buttonText}>Next</AppText>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default SelectMandiScreen;

/* -------------------- Styles -------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },

  mapBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  mapImage: {
    opacity: 0.08,
  },

  /* -------------------- Main Card -------------------- */

  mainCard: {
    backgroundColor: '#FFFFFF',

    marginHorizontal: moderateScale(16),

    borderRadius: moderateScale(28),

    paddingHorizontal: moderateScale(18),
    paddingTop: moderateScale(24),

    paddingBottom: moderateScale(18),

    maxHeight: height * 0.72,
  },

  /* -------------------- Heading -------------------- */

  title: {
    fontSize: isTablet
      ? moderateScale(22)
      : moderateScale(18),

    fontWeight: '800',
    color: '#000',
  },

  greenText: {
    color: '#2FA52F',
  },

  subTitle: {
    marginTop: verticalScale(5),

    fontSize: isTablet
      ? moderateScale(13)
      : moderateScale(15),

    fontWeight: '600',
    color: '#000',

    marginBottom: verticalScale(18),
  },

  /* -------------------- List Card -------------------- */

  card: {
    height: isTablet
      ? verticalScale(72)
      : verticalScale(62),

    backgroundColor: '#F1F1F1',

    borderRadius: moderateScale(22),

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: moderateScale(18),

    marginBottom: verticalScale(16),
  },

  /* -------------------- Left Circle -------------------- */

  circleWrapper: {
    width: moderateScale(32),
    height: moderateScale(32),

    borderRadius: moderateScale(31),

    backgroundColor: '#FFF',

    justifyContent: 'center',
    alignItems: 'center',

    elevation: 3,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },

  innerCircle: {
    width: moderateScale(12),
    height: moderateScale(12),

    borderRadius: moderateScale(8),
  },

  /* -------------------- Text -------------------- */

  cardText: {
    marginLeft: moderateScale(18),

    fontSize: isTablet
      ? moderateScale(16)
      : moderateScale(16),

    fontWeight: '500',
    color: '#111',
  },

  /* -------------------- Button -------------------- */

  button: {
    marginHorizontal: moderateScale(16),

    marginTop: verticalScale(12),
    marginBottom: "15%",

    height: isTablet
      ? verticalScale(55)
      : verticalScale(55),

    borderRadius: moderateScale(20),

    backgroundColor: '#29A329',

    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFF',

    fontSize: moderateScale(18),

    fontWeight: '700',
  },
  message: { textAlign: 'center', color: '#555', paddingVertical: 20 },
  error: { textAlign: 'center', color: '#B42318', paddingVertical: 20 },
});
