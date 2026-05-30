import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  Modal,
  FlatList,
  Pressable,
  ScrollView,
} from 'react-native';

import { State, City } from 'country-state-city';

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

const SelectLocationScreen = ({navigation}) => {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [districtModalVisible, setDistrictModalVisible] = useState(false);

  /* -------------------- Load States -------------------- */

  useEffect(() => {
    const indiaStates = State.getStatesOfCountry('IN');
    setStates(indiaStates);
  }, []);

  /* -------------------- Load Districts -------------------- */

  useEffect(() => {
    if (selectedState !== '') {
      const cities = City.getCitiesOfState('IN', selectedState);

      setDistricts(cities);

      setSelectedDistrict('');
    } else {
      setDistricts([]);
    }
  }, [selectedState]);

  /* -------------------- Get State Name -------------------- */

  const getStateName = () => {
    const state = states.find(
      item => item.isoCode === selectedState,
    );

    return state ? state.name : 'Select State';
  };

  /* -------------------- Handle Next -------------------- */

  const handleNext = () => {
    console.log('Selected State:', getStateName());
    console.log('Selected District:', selectedDistrict);
    navigation.navigate('SelectMandiScreen')
  };

  /* -------------------- Render Item -------------------- */

  const renderStateItem = ({ item }) => (
    <Pressable
      style={styles.listItem}
      onPress={() => {
        setSelectedState(item.isoCode);
        setStateModalVisible(false);
      }}
    >
      <Text style={styles.listItemText}>{item.name}</Text>
    </Pressable>
  );

  const renderDistrictItem = ({ item }) => (
    <Pressable
      style={styles.listItem}
      onPress={() => {
        setSelectedDistrict(item.name);
        setDistrictModalVisible(false);
      }}
    >
      <Text style={styles.listItemText}>{item.name}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Map */}
      <ImageBackground
        source={require('../../assets/images/bgmandi.png')}
        style={styles.mapBackground}
        resizeMode="cover"
        imageStyle={styles.mapImage}
      >
        {/* Bottom Card */}
        <View style={styles.bottomCard}>
          {/* Title */}
          <Text style={styles.title}>
            Select <Text style={styles.greenText}>State</Text> and{' '}
            <Text style={styles.greenText}>District</Text>
          </Text>

          {/* Subtitle */}
          <Text style={styles.subTitle}>
            अपना <Text style={styles.greenText}>राज्य</Text> और{' '}
            <Text style={styles.greenText}>जिला</Text> चुने!
          </Text>

          {/* -------------------- State Dropdown -------------------- */}

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.dropdownContainer}
            onPress={() => setStateModalVisible(true)}
          >
            <Text
              style={[
                styles.dropdownText,
                {
                  color:
                    selectedState === '' ? '#777' : '#000',
                },
              ]}
            >
              {getStateName()}
            </Text>

            <Text style={styles.arrow}>⌵</Text>
          </TouchableOpacity>

          {/* -------------------- District Dropdown -------------------- */}

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.dropdownContainer}
            onPress={() => {
              if (selectedState !== '') {
                setDistrictModalVisible(true);
              }
            }}
          >
            <Text
              style={[
                styles.dropdownText,
                {
                  color:
                    selectedDistrict === ''
                      ? '#777'
                      : '#000',
                },
              ]}
            >
              {selectedDistrict || 'Select District'}
            </Text>

            <Text style={styles.arrow}>⌵</Text>
          </TouchableOpacity>

          {/* -------------------- Button -------------------- */}

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.button}
            onPress={handleNext}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>

        {/* -------------------- State Modal -------------------- */}

        <Modal
          visible={stateModalVisible}
          transparent
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                Select State
              </Text>

              <FlatList
                data={states}
                keyExtractor={item => item.isoCode}
                renderItem={renderStateItem}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </Modal>

        {/* -------------------- District Modal -------------------- */}

        <Modal
          visible={districtModalVisible}
          transparent
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                Select District
              </Text>

              <FlatList
                data={districts}
                keyExtractor={(item, index) =>
                  index.toString()
                }
                renderItem={renderDistrictItem}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default SelectLocationScreen;

/* -------------------- Styles -------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  mapBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  mapImage: {
    opacity: 0.09,
  },

  bottomCard: {
    backgroundColor: '#FFFFFF',

    borderTopLeftRadius: 30,
    borderTopRightRadius: 34,

    paddingHorizontal: moderateScale(22),
    paddingTop: moderateScale(26),

    paddingBottom: '20%',

    minHeight: isTablet
      ? height * 0.4
      : height * 0.43,
  },

  title: {
    fontSize: isTablet
      ? moderateScale(20)
      : moderateScale(24),

    fontWeight: '800',
    color: '#000',
  },

  greenText: {
    color: '#29A329',
  },

  subTitle: {
    marginTop: verticalScale(6),

    fontSize: isTablet
      ? moderateScale(13)
      : moderateScale(15),

    fontWeight: '600',
    color: '#000',
  },

  dropdownContainer: {
    marginTop: verticalScale(22),

    backgroundColor: '#F2F2F2',

    borderRadius: moderateScale(15),

    height: isTablet
      ? verticalScale(55)
      : verticalScale(50),

    paddingHorizontal: moderateScale(18),

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dropdownText: {
    fontSize: moderateScale(16),
    fontWeight: '500',
  },

  arrow: {
    fontSize: moderateScale(18),
    color: '#777',
  },

  button: {
    marginTop: verticalScale(30),

    height: isTablet
      ? verticalScale(55)
      : verticalScale(50),

    borderRadius: moderateScale(20),

    backgroundColor: '#2FA52F',

    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFF',

    fontSize: isTablet
      ? moderateScale(18)
      : moderateScale(18),

    fontWeight: '700',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  modalContainer: {
    backgroundColor: '#FFF',

    maxHeight: '70%',

    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,

    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  modalTitle: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: '#000',
    marginBottom: 20,
  },

  listItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },

  listItemText: {
    fontSize: moderateScale(16),
    color: '#000',
  },
});