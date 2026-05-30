import React from 'react';
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

const { width, height } = Dimensions.get('window');

/* -------------------- Responsive Helpers -------------------- */

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = size => (width / guidelineBaseWidth) * size;

const verticalScale = size => (height / guidelineBaseHeight) * size;

const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const isTablet = width >= 768;

/* -------------------- Dummy Data -------------------- */

const mandiList = [
  {
    id: '1',
    name: 'Kherli',
    color: '#F5A623',
  },
  {
    id: '2',
    name: 'Alwar (F&V)',
    color: '#2F3B73',
  },
  {
    id: '3',
    name: 'Alwar',
    color: '#E63946',
  },
  {
    id: '4',
    name: 'Khedli',
    color: '#5E6B4E',
  },
  {
    id: '5',
    name: 'Khairthal',
    color: '#4B8B2C',
  },
  {
    id: '6',
    name: 'Bagar Meo',
    color: '#3B145B',
  },
];

/* -------------------- Component -------------------- */

const SelectMandiScreen = ({navigation}) => {
  /* -------------------- Render Item -------------------- */

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.card}
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
        <Text style={styles.cardText}>{item.name}</Text>
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
          <Text style={styles.title}>
            Select <Text style={styles.greenText}>Mandi</Text>{' '}
            <Text style={styles.greenText}>( Alwar )</Text>
          </Text>

          {/* Subtitle */}
          <Text style={styles.subTitle}>
            अपना <Text style={styles.greenText}>मंडी</Text>{' '}
            चुने!
          </Text>

          {/* List */}
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
          onPress={()=>navigation.navigate('MandiBhavScreen')}
        >
          <Text style={styles.buttonText}>Next</Text>
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
});