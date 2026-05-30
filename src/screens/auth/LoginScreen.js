import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  PixelRatio,
  ScrollView,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { sendOtp } from '../../features/auth/authSlice';

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

const LoginScreen = ({
  navigation,
  route,
}) => {
  const { role } = route.params || {};

  console.log('Selected Role:', role);

  const [phone, setPhone] = useState('');

  const dispatch = useDispatch();

  const { loading, error } = useSelector(
    state => state.auth,
  );

  const handleLogin = async () => {
    if (phone.length !== 10) {
      Alert.alert(
        'Invalid Number',
        'Please enter valid 10 digit mobile number',
      );

      return;
    }

    try {
      const result = await dispatch(
        sendOtp({
          mobile: phone,
          role: role,
        }),
      );

      if (
        sendOtp.fulfilled.match(result)
      ) {
        console.log(
          'OTP sent successfully:',
          result.payload?.otp,
        );

        navigation.navigate('Otp', {
          mobile: phone,
          role: role,
          otp: result.payload?.otp,
        });
      } else {
        Alert.alert(
          'Error',
          result.payload ||
            'Failed to send OTP',
        );
      }
    } catch (err) {
      Alert.alert(
        'Error',
        'Something went wrong',
      );
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/loginback.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.scrollContainer
          }
        >
          {/* Language button */}
          <View style={styles.topRow}>
            <View style={styles.langBtn}>
              <Text style={styles.langText}>
                🌐 हिंदी में
              </Text>
            </View>
          </View>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/icons/Logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.title}>
              Welcome To Hitech Kisan
            </Text>

            <Text style={styles.subtitle}>
              Login to find the right
              pesticide and crop solution
              near you.
            </Text>

            <Text style={styles.label}>
              Phone Number
            </Text>

            <View
              style={styles.phoneContainer}
            >
              <Text style={styles.prefix}>
                +91
              </Text>

              <TextInput
                placeholder="XXXX XXXX XX"
                placeholderTextColor={
                  '#7F7F7F'
                }
                keyboardType="number-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
                style={styles.phoneInput}
              />
            </View>

            <TouchableOpacity
              style={styles.loginBtn}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={styles.loginText}
                >
                  Login
                </Text>
              )}
            </TouchableOpacity>

           { role!=='B2C' && <TouchableOpacity
              activeOpacity={1}
              style={styles.registerBtn}
            >
              <Text
                style={
                  styles.registerText
                }
              >
                Don’t have an account?{' '}
                <Text
                  onPress={() =>
                    navigation.navigate(
                      'RegisterScreen',
                    )
                  }
                  style={styles.link}
                >
                  Register
                </Text>
              </Text>
            </TouchableOpacity>}

            <Text style={styles.terms}>
              By logging into this app,
              you agree to our{' '}
              <Text style={styles.link}>
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text style={styles.link}>
                Privacy Policy
              </Text>
              .
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,

    paddingBottom: hp(4),
  },

  // ✅ Top Language Button
  topRow: {
    alignItems: 'flex-end',

    paddingHorizontal: wp(4),

    paddingTop:
      Platform.OS === 'ios'
        ? hp(2)
        : hp(6),
  },

  langBtn: {
    backgroundColor: '#fff',

    paddingHorizontal: wp(4),

    paddingVertical: hp(1),

    borderRadius: wp(6),

    elevation: 3,
  },

  langText: {
    fontSize: responsiveFont(15),
    color: '#111',
  },

  // ✅ Logo
  logoContainer: {
    alignItems: 'center',

    marginTop: hp(2),
  },

  logo: {
    width:
      width < 360
        ? wp(36)
        : wp(42),

    height:
      width < 360
        ? wp(36)
        : wp(42),
  },

  // ✅ Card
  card: {
    backgroundColor: '#fff',

    marginHorizontal: wp(5),

    marginTop: hp(4),

    borderRadius: wp(6),

    paddingHorizontal: wp(5),

    paddingVertical: hp(3),

    elevation: 8,

    shadowColor: '#000',

    shadowOpacity: 0.08,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  // ✅ Title
  title: {
    fontSize: responsiveFont(22),

    fontWeight: 'bold',

    textAlign: 'center',

    color: '#111',

    lineHeight: responsiveFont(30),
  },

  subtitle: {
    textAlign: 'center',

    color: '#666',

    marginTop: hp(1),

    marginBottom: hp(3),

    fontSize: responsiveFont(14),

    lineHeight: responsiveFont(22),

    paddingHorizontal: wp(2),
  },

  // ✅ Label
  label: {
    fontSize: responsiveFont(16),

    marginBottom: hp(0.8),

    fontWeight: '600',

    color: '#111',
  },

  // ✅ Phone Input
  phoneContainer: {
    flexDirection: 'row',

    alignItems: 'center',

    borderWidth: 1,

    borderColor: '#ddd',

    borderRadius: wp(3.5),

    paddingHorizontal: wp(3.5),

    marginBottom: hp(2.8),

    height:
      width < 360
        ? hp(6.5)
        : hp(7),

    backgroundColor: '#F9F9F9',
  },

  prefix: {
    fontSize: responsiveFont(16),

    fontWeight: '600',

    marginRight: wp(2),

    color: '#333',
  },

  phoneInput: {
    flex: 1,

    fontSize: responsiveFont(16),

    color: '#111',
  },

  // ✅ Login Button
  loginBtn: {
    backgroundColor: '#4A7C1C',

    height:
      width < 360
        ? hp(6.5)
        : hp(7),

    borderRadius: wp(3.5),

    alignItems: 'center',

    justifyContent: 'center',
  },

  loginText: {
    color: '#fff',

    fontSize: responsiveFont(18),

    fontWeight: 'bold',
  },

  // ✅ Register
  registerBtn: {
    marginTop: hp(2),

    alignItems: 'center',
  },

  registerText: {
    color: '#777',

    fontSize: responsiveFont(15),

    fontWeight: '600',

    textAlign: 'center',

    lineHeight: responsiveFont(22),
  },

  // ✅ Terms
  terms: {
    textAlign: 'center',

    color: '#777',

    marginTop: hp(2),

    fontSize: responsiveFont(12),

    lineHeight: responsiveFont(20),

    paddingHorizontal: wp(2),
  },

  link: {
    color: '#2E7D32',

    fontWeight: 'bold',
  },
});