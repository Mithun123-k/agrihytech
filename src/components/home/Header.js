import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  PermissionsAndroid,
  Platform,
  Dimensions,
  PixelRatio,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import { SafeAreaView } from 'react-native-safe-area-context';

import axios from 'axios';

import Geolocation from 'react-native-geolocation-service';

import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY =
  'a4b50d71891e3659606dd99e18e77aa1';

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

const HomeHeader = ({
  navigation,
  userName = undefined,
}) => {
  const [temp, setTemp] =
    useState('--');

  const [
    weatherType,
    setWeatherType,
  ] = useState('');

  const [humidity, setHumidity] =
    useState('--');

  const [
    locationName,
    setLocationName,
  ] = useState('');

  const saveLocation = async (
    latitude,
    longitude,
  ) => {
    try {
      const locationData = {
        latitude,
        longitude,
        updatedAt: Date.now(),
      };

      await AsyncStorage.setItem(
        'USER_LOCATION',
        JSON.stringify(
          locationData,
        ),
      );

      console.log(
        'Location Saved',
      );
    } catch (error) {
      console.log(
        'SAVE LOCATION ERROR:',
        error,
      );
    }
  };

  // =========================
  // LOCATION PERMISSION
  // =========================
  const requestLocationPermission =
    async () => {
      if (
        Platform.OS ===
        'android'
      ) {
        const granted =
          await PermissionsAndroid.request(
            PermissionsAndroid
              .PERMISSIONS
              .ACCESS_FINE_LOCATION,
          );

        return (
          granted ===
          PermissionsAndroid
            .RESULTS.GRANTED
        );
      }

      return true;
    };

  // =========================
  // GET LOCATION
  // =========================
  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {
          latitude,
          longitude,
        } = position.coords;

        console.log(
          'LAT',
          latitude,
        );

        console.log(
          'LON',
          longitude,
        );

        // Save latest location
        saveLocation(
          latitude,
          longitude,
        );

        // Weather API
        getWeather(
          latitude,
          longitude,
        );
      },

      error => {
        console.log(
          'LOCATION ERROR:',
          error,
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 10000,
        forceRequestLocation: true,
        showLocationDialog: true,
      },
    );
  };

  // =========================
  // WEATHER API
  // =========================
  const getWeather = async (
    lat,
    lon,
  ) => {
    try {
      const res =
        await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
        );

      console.log(
        '======>>',
        res.data.main,
      );

      setTemp(
        Math.round(
          res.data.main.temp,
        ),
      );

      setWeatherType(
        res.data.weather[0].main,
      );

      setHumidity(
        res.data.main.humidity,
      );

      setLocationName(
        res.data.name,
      );
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // DYNAMIC GREETING
  // =========================
  const getGreeting = () => {
    const currentHour =
      new Date().getHours();

    if (
      currentHour >= 5 &&
      currentHour < 12
    ) {
      return 'Good Morning';
    }

    if (
      currentHour >= 12 &&
      currentHour < 17
    ) {
      return 'Good Afternoon';
    }

    if (
      currentHour >= 17 &&
      currentHour < 21
    ) {
      return 'Good Evening';
    }

    return 'Good Night';
  };

  const greetingText =
    getGreeting();

  useEffect(() => {
    const init =
      async () => {
        const permission =
          await requestLocationPermission();

        if (permission) {
          getLocation();
        }
      };

    init();

    const interval =
      setInterval(() => {
        getLocation();
      }, 600000);

    return () =>
      clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <ImageBackground
        source={require('../../assets/images/bg.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <SafeAreaView>
          <View style={styles.content}>
            {/* Top Row */}
            <View
              style={styles.topRow}
            >
              <View
                style={
                  styles.textContainer
                }
              >
                <Text
                  style={
                    styles.greeting
                  }
                  numberOfLines={1}
                >
                  {greetingText},{' '}
                  {userName !==
                  undefined
                    ? userName
                    : 'Ramesh'}{' '}
                  🌾
                </Text>

                <Text
                  style={
                    styles.highlight
                  }
                >
                  Here's today's
                  <Text
                    style={
                      styles.title
                    }
                  >
                    {' '}
                    best crop {'\n'}
                    care solutions
                  </Text>{' '}
                  for you
                </Text>
              </View>

              <TouchableOpacity
                style={
                  styles.bellContainer
                }
                onPress={() =>
                  navigation.navigate(
                    'NotificationsScreen',
                  )
                }
                activeOpacity={0.8}
              >
                <Icon
                  name="notifications-outline"
                  size={responsiveFont(
                    22,
                  )}
                  color="#333"
                />

                <View
                  style={
                    styles.badge
                  }
                />
              </TouchableOpacity>
            </View>

            {/* Weather Card */}
            <View
              style={
                styles.weatherCard
              }
            >
              <View
                style={
                  styles.weatherLeft
                }
              >
                <View
                  style={
                    styles.sunCircle
                  }
                >
                  <Icon
                    name="sunny"
                    size={responsiveFont(
                      24,
                    )}
                    color="#f4a100"
                  />
                </View>

                <View
                  style={{
                    marginLeft:
                      wp(3),
                  }}
                >
                  <Text
                    style={
                      styles.location
                    }
                    numberOfLines={
                      1
                    }
                  >
                    {
                      locationName
                    }
                  </Text>

                  <Text
                    style={
                      styles.temp
                    }
                  >
                    {temp}°C
                  </Text>
                </View>
              </View>

              <View
                style={
                  styles.weatherRight
                }
              >
                <Text
                  style={
                    styles.weatherType
                  }
                >
                  {
                    weatherType
                  }
                </Text>

                <View
                  style={
                    styles.humidityRow
                  }
                >
                  <Icon
                    name="leaf-outline"
                    size={responsiveFont(
                      16,
                    )}
                    color="#4c8c2b"
                  />

                  <Text
                    style={
                      styles.humidity
                    }
                  >
                    {humidity}%
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

export default HomeHeader;

const styles =
  StyleSheet.create({
    container: {
      height:
        width < 360
          ? hp(28)
          : hp(30),
          marginBottom:hp(5)
    },

    background: {
      // flex: 1,
    },

    overlay: {
      ...StyleSheet.absoluteFillObject,
    },

    content: {
      paddingHorizontal:
        wp(5),

      paddingTop:
        Platform.OS ===
        'ios'
          ? hp(1)
          : hp(1.5),
    },

    // ✅ TOP ROW
    topRow: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems:
        'flex-start',
    },

    textContainer: {
      flex: 1,

      paddingRight: wp(3),
    },

    // ✅ GREETING
    greeting: {
      fontSize:
        responsiveFont(16),

      color: '#444',

      marginBottom:
        hp(0.7),
    },

    // ✅ HIGHLIGHT TEXT
    highlight: {
      fontSize:
        responsiveFont(22),

      fontWeight: '700',

      color: '#4c8c2b',

      lineHeight:
        responsiveFont(31),
    },

    title: {
      fontSize:
        responsiveFont(22),

      fontWeight: '700',

      color: '#222',

      lineHeight:
        responsiveFont(31),
    },

    // ✅ NOTIFICATION BUTTON
    bellContainer: {
      width:
        width < 360
          ? wp(11)
          : wp(12),

      height:
        width < 360
          ? wp(11)
          : wp(12),

      borderRadius:
        wp(10),

      backgroundColor:
        '#EDF2E9',

      justifyContent:
        'center',

      alignItems: 'center',

      elevation: 4,

      shadowColor: '#000',

      shadowOpacity: 0.1,

      shadowRadius: 5,

      shadowOffset: {
        width: 0,
        height: 3,
      },
    },

    badge: {
      position: 'absolute',

      top:
        width < 360
          ? wp(2)
          : wp(2.5),

      right:
        width < 360
          ? wp(2)
          : wp(2.5),

      width:
        width < 360
          ? wp(2)
          : wp(2.2),

      height:
        width < 360
          ? wp(2)
          : wp(2.2),

      borderRadius:
        wp(5),

      backgroundColor: 'red',
    },

    // ✅ WEATHER CARD
    weatherCard: {
      marginTop: hp(3),

      borderRadius: wp(5),

      borderWidth: 1,

      borderColor: '#fff',

      paddingVertical:
        hp(2),

      paddingHorizontal:
        wp(4),

      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',
    },

    weatherLeft: {
      flexDirection: 'row',

      alignItems: 'center',

      flex: 1,
    },

    // ✅ SUN ICON
    sunCircle: {
      width:
        width < 360
          ? wp(12)
          : wp(13),

      height:
        width < 360
          ? wp(12)
          : wp(13),

      borderRadius:
        wp(10),

      backgroundColor:
        '#fff3dd',

      justifyContent:
        'center',

      alignItems: 'center',
    },

    // ✅ LOCATION
    location: {
      fontSize:
        responsiveFont(14),

      color: '#555',

      maxWidth: wp(30),
    },

    // ✅ TEMP
    temp: {
      fontSize:
        responsiveFont(26),

      fontWeight: '700',

      color: '#222',

      lineHeight:
        responsiveFont(34),
    },

    // ✅ WEATHER RIGHT
    weatherRight: {
      alignItems: 'flex-end',

      marginLeft: wp(3),
    },

    weatherType: {
      fontSize:
        responsiveFont(16),

      color: '#333',
    },

    // ✅ HUMIDITY
    humidityRow: {
      flexDirection: 'row',

      alignItems: 'center',

      marginTop: hp(0.5),
    },

    humidity: {
      marginLeft: wp(1),

      fontSize:
        responsiveFont(16),

      color: '#4c8c2b',

      fontWeight: '600',
    },
  });