import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  FlatList,
  Image,
  StatusBar,
  Platform,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

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

const MandiBhavScreen = ({navigation}) => {
  /* -------------------- Render Item -------------------- */

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.card}
      >
        {/* Left Image */}
        <Image
          source={ item.image }
          style={styles.itemImage}
          resizeMode="contain"
        />

        {/* Center Content */}
        <View style={styles.centerContent}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={styles.itemTitle}
          >
            {item.name}
          </Text>

          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={styles.hindiText}
          >
            {item.hindi}
          </Text>
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

            <Text style={styles.badgeText}>
              Today
            </Text>
          </View>

          {/* Price */}
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={styles.priceText}
          >
            {item.price}
          </Text>
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
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={styles.headerTitle}
        >
          Ch. Dadri Mandi Bhav
        </Text>
      </View>

      {/* -------------------- Scrollable List -------------------- */}

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
});