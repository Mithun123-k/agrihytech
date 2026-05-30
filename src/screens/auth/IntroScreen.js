import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Platform,
  PixelRatio,
  ScrollView,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

// ✅ Responsive Font
const responsiveFont = size => {
  const scale = width / 375;
  const newSize = size * scale;

  if (Platform.OS === 'ios') {
    return Math.round(
      PixelRatio.roundToNearestPixel(newSize),
    );
  }

  return (
    Math.round(
      PixelRatio.roundToNearestPixel(newSize),
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

const RoleCard = ({
  title,
  description,
  image,
  onPress,
  backgroundColor,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.card,
        { backgroundColor },
      ]}
      onPress={onPress}
    >
      <Image
        source={image}
        style={styles.cardImage}
      />

      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>
            {title}
          </Text>

          <Text style={styles.cardDescription}>
            {description}
          </Text>
        </View>

        <Ionicons
          name="arrow-forward"
          size={responsiveFont(22)}
          color="#222"
        />
      </View>
    </TouchableOpacity>
  );
};

const IntroScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../../assets/images/loginback.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.safeArea}>
        {/* ✅ Header Fixed */}
        <View style={styles.header}>
          <View
            style={
              styles.headerTextContainer
            }
          >
            <Text style={styles.heading}>
              Choose how you{'\n'}
              want to use the app
            </Text>

            <Text style={styles.subHeading}>
              Select your role to continue
            </Text>
          </View>

          {/* <TouchableOpacity>
            <Text style={styles.skipText}>
              Skip
            </Text>
          </TouchableOpacity> */}
        </View>

        {/* ✅ Only Cards Scroll */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.cardsScrollContainer
          }
        >
          <View style={styles.cardsContainer}>
            <RoleCard
              title="Farmer"
              description="Find pesticides, brands, and nearby sellers for your crops."
              image={require('../../assets/images/intro1.png')}
              backgroundColor="#E7F0E5"
              onPress={() =>
                navigation.navigate(
                  'Login',
                  { role: 'B2C' },
                )
              }
            />

            <RoleCard
              title="Seller"
              description="List products, connect with farmers, and manage availability."
              image={require('../../assets/images/intro.png')}
              backgroundColor="#F3E9DD"
              onPress={() =>
                navigation.navigate(
                  'Login',
                  { role: 'B2B' },
                )
              }
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default IntroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,

    paddingHorizontal: wp(4),

    paddingTop:
      Platform.OS === 'ios'
        ? hp(6)
        : hp(5),
  },

  // ✅ Header
  header: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'flex-start',

    marginTop: hp(1),

    paddingHorizontal: wp(2),
  },

  headerTextContainer: {
    flex: 1,
    paddingRight: wp(3),
  },

  heading: {
    fontSize: responsiveFont(28),

    fontWeight: '600',

    color: '#272727',

    lineHeight: responsiveFont(36),
  },

  subHeading: {
    marginTop: hp(0.8),

    fontSize: responsiveFont(16),

    fontWeight: '400',

    color: '#272727',

    lineHeight: responsiveFont(24),
  },

  skipText: {
    fontSize: responsiveFont(16),

    color: '#444',

    backgroundColor: '#FFFFFF',

    paddingHorizontal: wp(4),

    paddingVertical: hp(0.8),

    borderRadius: wp(5),

    borderWidth: 0.2,
  },

  // ✅ Scroll only cards
  cardsScrollContainer: {
    paddingBottom: hp(4),
  },

  cardsContainer: {
    marginTop: hp(4),
  },

  // ✅ Card
  card: {
    borderRadius: wp(6),

    padding: wp(3.2),

    marginBottom: hp(2.5),

    elevation: 4,

    shadowColor: '#000',

    shadowOpacity: 0.08,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  // ✅ Responsive Image
  cardImage: {
    width: '100%',

    height:
      width < 360
        ? hp(18)
        : width < 420
        ? hp(18)
        : hp(20),

    borderRadius: wp(5),

    resizeMode: 'cover',
  },

  cardContent: {
    flexDirection: 'row',

    alignItems: 'center',

    marginTop: hp(1.8),
  },

  cardTitle: {
    fontSize: responsiveFont(20),

    fontWeight: '600',

    marginBottom: hp(0.5),

    color: '#111',
  },

  cardDescription: {
    fontSize: responsiveFont(14),

    color: '#555',

    paddingRight: wp(3),

    lineHeight: responsiveFont(21),
  },
});