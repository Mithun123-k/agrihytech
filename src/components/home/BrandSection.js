import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  PixelRatio,
} from 'react-native';

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

// ✅ Width %
const wp = percentage => {
  return (width * percentage) / 100;
};

// ✅ Height %
const hp = percentage => {
  return (height * percentage) / 100;
};

const BrandSection = ({
  data = [],
  navigation,
}) => {
  return (
    <View
      style={styles.container}
    >
      {/* HEADER */}
      <View style={styles.row}>
        <Text style={styles.title}>
          Popular Brands
        </Text>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              'BrandListing',
            )
          }
        >
          <Text
            style={
              styles.viewAll
            }
          >
            View All
          </Text>
        </TouchableOpacity>
      </View>

      {/* BRANDS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >
        {(data.length
          ? data
          : []
        ).map((b, i) => (
          <TouchableOpacity
            key={
              b._id || i
            }
            style={styles.card}
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate(
                'product',
                {
                  brandId:
                    b._id,
                },
              )
            }
          >
            {/* IMAGE */}
            <Image
              source={
                b?.image
                  ? {
                      uri: b.image,
                    }
                  : require('../../assets/images/brand.png')
              }
              style={styles.img}
              resizeMode="contain"
            />

            {/* NAME */}
            <Text
              style={
                styles.brandName
              }
              numberOfLines={2}
            >
              {b?.name ||
                'Brand'}
            </Text>

            {/* PRODUCT COUNT */}
            <Text
              style={
                styles.productCount
              }
            >
              {b?.totalProducts ||
                0}{' '}
              Products
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default BrandSection;

const styles =
  StyleSheet.create({
    // ✅ Main Container
    container: {
      marginTop: hp(2.5),
    },

    // ✅ Header Row
    row: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',

      marginBottom:
        hp(1.5),
    },

    // ✅ Title
    title: {
      fontSize:
        responsiveFont(18),

      fontWeight: 'bold',

      color: '#111',
    },

    // ✅ View All
    viewAll: {
      color: 'green',

      fontSize:
        responsiveFont(14),

      fontWeight: '600',
    },

    // ✅ Scroll Content
    scrollContent: {
      paddingRight:
        wp(2),
    },

    // ✅ Brand Card
    card: {
      width:
        width < 360
          ? wp(34)
          : width < 420
          ? wp(32)
          : wp(29),

      backgroundColor:
        '#fff',

      paddingVertical:
        hp(1.5),

      paddingHorizontal:
        wp(2.5),

      borderRadius:
        wp(3),

      marginRight:
        wp(3),

      alignItems: 'center',

      justifyContent:
        'center',

      // elevation: 2,

      // shadowColor: '#000',

      // shadowOpacity: 0.02,

      // shadowRadius: 6,

      // shadowOffset: {
      //   width: 0,
      //   height: 5,
      // },
    },

    // ✅ Responsive Image
    img: {
      width: '100%',

      height:
        width < 360
          ? hp(9)
          : hp(10),

      marginBottom:
        hp(1),

      alignSelf: 'center',
    },

    // ✅ Brand Name
    brandName: {
      fontWeight: 'bold',

      textAlign: 'center',

      color: '#222',

      fontSize:
        responsiveFont(14),

      // lineHeight:
      //   responsiveFont(19),

      // minHeight:
      //   responsiveFont(38),
    },

    // ✅ Product Count
    productCount: {
      color: 'orange',

      textAlign: 'center',

      marginTop:'3%',

      fontSize:
        responsiveFont(12),

      fontWeight: '600',
    },
  });