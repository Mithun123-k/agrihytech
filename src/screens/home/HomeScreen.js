import AppText from '../../components/common/AppText';
import React, {
  useCallback,
  useEffect,
} from 'react';

import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Text,
  Dimensions,
  Platform,
  PixelRatio,
} from 'react-native';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  getHomeData,
  getUserHomeData,
} from '../../features/home/homeSlice';

import Header from '../../components/home/Header';
import BannerSlider from '../../components/home/BannerSlider';
import CategorySection from '../../components/home/CategorySection';
import BrandSection from '../../components/home/BrandSection';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { useFocusEffect } from '@react-navigation/native';

const { width, height } =
  Dimensions.get('window');

// ✅ Responsive Font
const responsiveFont = size => {
  const scale = width / 375;

  const newSize = size * scale;

  if (Platform.OS === 'ios') {
    return Math.round(
      PixelRatio.roundToNearestPixel(
        newSize,
      ),
    );
  }

  return (
    Math.round(
      PixelRatio.roundToNearestPixel(
        newSize,
      ),
    ) - 1
  );
};

// ✅ Width Percentage
const wp = percentage => {
  return (width * percentage) / 100;
};

// ✅ Height Percentage
const hp = percentage => {
  return (height * percentage) / 100;
};

const HomeScreen = ({
  navigation,
  route,
}) => {
  const dispatch = useDispatch();

  const {
    banners,
    categories,
    brands,
    userName,
    loading,
    error,
  } = useSelector(
    state => state.home,
  );

  const { user } = useSelector(
    state => state.auth,
  );

  // 🔥 CALL API
  useFocusEffect(
    useCallback(() => {
      if (
        user?.role === 'B2C'
      ) {
        dispatch(
          getUserHomeData(),
        );
      } else {
        dispatch(getHomeData());
      }
    }, [
      dispatch,
      user?.role,
    ]),
  );

  const openWhatsApp = () => {
    const phone =
      '919243127974';

    const message =
      'Hello, I need help';

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(
      message,
    )}`;

    Linking.openURL(url);
  };

  const makeCall = () => {
    Linking.openURL(
      `tel:+919243127974`,
    );
  };

  // 🔄 LOADING UI
  if (loading) {
    return (
      <View
        style={
          styles.loaderContainer
        }
      >
        <ActivityIndicator
          size="large"
        />
      </View>
    );
  }

  return (
    <View style={styles.main}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* 🔥 PASS USER NAME */}
        <Header
          navigation={
            navigation
          }
          userName={
            user?.proprietorName
          }
        />

        <View
          style={styles.content}
        >
          {/* 🔥 PASS API DATA */}
          <BannerSlider
            data={banners}
          />

          <View style={styles.trustBar}>
            {[
              ['500+', 'Verified Brands'],
              ['25K+', 'Products'],
              ['10K+', 'Dealers'],
              ['28', 'States Covered'],
            ].map(([value, label], index) => (
              <View key={label} style={[styles.trustItem, index > 0 && styles.trustDivider]}>
                <AppText style={styles.trustValue}>{value}</AppText>
                <AppText style={styles.trustLabel}>{label}</AppText>
              </View>
            ))}
          </View>

          <CategorySection
            data={categories}
            navigation={
              navigation
            }
            role={user?.role}
          />

          <BrandSection
            data={brands}
            navigation={
              navigation
            }
          />

          {error && (
            <AppText
              style={
                styles.errorText
              }
            >
              {error}
            </AppText>
          )}

          <View
            style={{
              height: hp(12),
            }}
          />
        </View>


      </ScrollView>

      {/* Floating Buttons */}
      <View
        style={
          styles.floatingContainer
        }
      >
        <TouchableOpacity
          style={
            styles.callButton
          }
          onPress={makeCall}
          activeOpacity={0.8}
        >
          <Ionicons
            name="call"
            size={responsiveFont(22)}
            color="#fff"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={
            styles.whatsappButton
          }
          onPress={
            openWhatsApp
          }
          activeOpacity={0.85}
        >
          <Ionicons
            name="logo-whatsapp"
            size={responsiveFont(30)}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles =
  StyleSheet.create({
    main: {
      flex: 1,
    },

    container: {
      flex: 1,

      backgroundColor:
        '#F5F6F2',
    },

    scrollContent: {
      paddingBottom: hp(8),
    },

    content: {
      paddingHorizontal:
        wp(4),

      marginTop: hp(0.5),
    },

    trustBar: {
      flexDirection: 'row',
      backgroundColor: '#FFFFFF',
      borderRadius: wp(5),
      borderWidth: 1,
      borderColor: '#E5ECE6',
      marginTop: hp(1.5),
      marginBottom: hp(1.5),
      paddingVertical: hp(1.5),
      elevation: 3,
      shadowColor: '#274B38',
      shadowOpacity: 0.08,
      shadowRadius: 7,
      shadowOffset: { width: 0, height: 3 },
    },
    trustItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: wp(0.5),
    },
    trustDivider: {
      borderLeftWidth: 1,
      borderLeftColor: '#E4E9E4',
    },
    trustValue: {
      fontSize: responsiveFont(20),
      fontWeight: '800',
      color: '#23764D',
    },
    trustLabel: {
      fontSize: responsiveFont(10),
      color: '#586474',
      textAlign: 'center',
      marginTop: hp(0.4),
    },

    // ✅ Loader
    loaderContainer: {
      flex: 1,

      justifyContent:
        'center',

      alignItems: 'center',

      backgroundColor:
        '#F5F6F2',
    },

    // ✅ Error Text
    errorText: {
      color: 'red',

      textAlign: 'center',

      fontSize:
        responsiveFont(14),

      marginTop: hp(2),

      lineHeight:
        responsiveFont(22),
    },

    // ✅ Floating Buttons Container
    floatingContainer: {
      position: 'absolute',

      right:
        width < 360
          ? wp(4)
          : wp(5),

      bottom:
        Platform.OS ===
          'ios'
          ? hp(20)
          : hp(18),

      alignItems: 'center',
    },

    // ✅ Call Button
    callButton: {
      backgroundColor:
        '#007AFF',

      width:
        width < 360
          ? wp(13)
          : wp(14),

      height:
        width < 360
          ? wp(13)
          : wp(14),

      borderRadius:
        wp(10),

      justifyContent:
        'center',

      alignItems: 'center',

      marginBottom:
        hp(1.5),

      elevation: 5,

      shadowColor: '#000',

      shadowOpacity: 0.15,

      shadowRadius: 6,

      shadowOffset: {
        width: 0,
        height: 3,
      },
    },

    // ✅ WhatsApp Button
    whatsappButton: {
      backgroundColor:
        '#25D366',

      width:
        width < 360
          ? wp(14)
          : wp(15),

      height:
        width < 360
          ? wp(14)
          : wp(15),

      borderRadius:
        wp(10),

      justifyContent:
        'center',

      alignItems: 'center',

      elevation: 6,

      shadowColor: '#000',

      shadowOpacity: 0.18,

      shadowRadius: 8,

      shadowOffset: {
        width: 0,
        height: 4,
      },
    },
  });
