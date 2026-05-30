import React, {
  useState,
  useRef,
  useEffect,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Image,
  Dimensions,
  Platform,
  PixelRatio,
  ScrollView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  verifyOtp,
  sendOtp,
  loadUser,
} from '../../features/auth/authSlice';

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

// ✅ OTP BOX RESPONSIVE
const otpBoxSize =
  width < 360
    ? wp(14)
    : width < 420
    ? wp(15)
    : wp(16);

const OtpScreen = ({
  navigation,
  route,
}) => {
  const {
    role,
    otp: initialOtp,
  } = route.params || {};

  const [otp, setOtp] = useState([
    '',
    '',
    '',
    '',
  ]);

  const [error, setError] =
    useState(null);

  const inputs = useRef([]);

  const [timer, setTimer] =
    useState(60);

  const dispatch = useDispatch();

  const { mobile, loading } =
    useSelector(
      state => state.auth,
    );

  console.log(
    'Initial OTP in OTP Screen:',
    initialOtp,
  );

  // =========================
  // TIMER
  // =========================
  useEffect(() => {
    let interval;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }

    return () =>
      clearInterval(interval);
  }, [timer]);

  // =========================
  // HANDLE OTP INPUT
  // =========================
  const handleChange = (
    text,
    index,
  ) => {
    const cleanText =
      text.replace(/[^0-9]/g, '');

    let newOtp = [...otp];

    newOtp[index] = cleanText;

    setOtp(newOtp);

    if (
      cleanText &&
      index < 3
    ) {
      inputs.current[
        index + 1
      ]?.focus();
    } else if (
      !cleanText &&
      index > 0
    ) {
      inputs.current[
        index - 1
      ]?.focus();
    }
  };

  // =========================
  // RESEND OTP
  // =========================
  const handleResend = async () => {
    setTimer(60);

    const result = await dispatch(
      sendOtp({
        mobile,
        role,
      }),
    );

    if (
      sendOtp.fulfilled.match(
        result,
      )
    ) {
      Alert.alert(
        'Success',
        'OTP resent successfully',
      );
    } else {
      Alert.alert(
        'Error',
        result.payload ||
          'Failed to resend OTP',
      );
    }
  };

  // =========================
  // VERIFY OTP
  // =========================
  const handleVerify = async () => {
    const finalOtp =
      otp.join('');

    if (
      finalOtp.length !== 4
    ) {
      Alert.alert(
        'Error',
        'Please enter 4 digit OTP',
      );

      return;
    }

    const result = await dispatch(
      verifyOtp({
        mobile,
        otp: finalOtp,
        role,
      }),
    );

    if (
      verifyOtp.fulfilled.match(
        result,
      )
    ) {
      const user =
        result.payload.user;

      const token =
        result.payload.token;

      // =========================
      // B2B CHECK
      // =========================
      if (
        user?.role === 'B2B'
      ) {
        const hasSubscription =
          user?.subscription
            ?.isActive;

        if (
          !hasSubscription
        ) {
          navigation.replace(
            'PremiumScreen',
            {
              token,
              user,
            },
          );

          return;
        }
      }

      // =========================
      // SAVE TOKEN
      // =========================
      await AsyncStorage.setItem(
        'token',
        token,
      );

      // =========================
      // LOAD USER
      // =========================
      await dispatch(
        loadUser(),
      );
    } else {
      Alert.alert(
        'Error',
        result.payload ||
          'Invalid OTP',
      );
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/loginback.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView
        style={styles.safeArea}
      >
        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.scrollContainer
          }
        >
          <View style={styles.card}>
            {/* ICON */}
            <View style={styles.tick}>
              <Image
                source={require('../../assets/icons/Group.png')}
                style={styles.tickImage}
                resizeMode="contain"
              />
            </View>

            {/* TITLE */}
            <Text style={styles.title}>
              Verify Your Number
            </Text>

            {/* OTP SHOW */}
            {/* <Text
              style={styles.subtitle}
            >
              {initialOtp}
            </Text> */}

            <Text
              style={styles.subtitle}
            >
              Enter the 4-digit OTP
              sent to +91 {mobile}
            </Text>

            {/* OTP BOX */}
            <View style={styles.otpRow}>
              {otp.map(
                (
                  digit,
                  index,
                ) => (
                  <TextInput
                    key={index}
                    ref={ref =>
                      (inputs.current[
                        index
                      ] = ref)
                    }
                    style={
                      styles.otpBox
                    }
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={text =>
                      handleChange(
                        text,
                        index,
                      )
                    }
                  />
                ),
              )}
            </View>

            {/* ERROR */}
            {error && (
              <Text
                style={
                  styles.errorText
                }
              >
                {error}
              </Text>
            )}

            {/* TIMER / RESEND */}
            {timer > 0 ? (
              <Text
                style={styles.timer}
              >
                Resend OTP in{' '}
                {timer}s
              </Text>
            ) : (
              <TouchableOpacity
                onPress={
                  handleResend
                }
              >
                <Text
                  style={
                    styles.resend
                  }
                >
                  Resend OTP
                </Text>
              </TouchableOpacity>
            )}

            {/* VERIFY BUTTON */}
            <TouchableOpacity
              style={[
                styles.btn,
                {
                  opacity:
                    otp.join('')
                      .length ===
                    4
                      ? 1
                      : 0.4,
                },
              ]}
              disabled={
                otp.join('')
                  .length !==
                  4 || loading
              }
              onPress={
                handleVerify
              }
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={
                    styles.btnText
                  }
                >
                  Continue
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,

    justifyContent: 'center',

    paddingVertical: hp(4),
  },

  // ✅ CARD
  card: {
    backgroundColor: '#fff',

    marginHorizontal: wp(5),

    borderRadius: wp(6),

    paddingHorizontal: wp(6),

    paddingVertical: hp(4),

    elevation: 8,

    shadowColor: '#000',

    shadowOpacity: 0.08,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  // ✅ ICON
  tick: {
    width:
      width < 360
        ? wp(16)
        : wp(18),

    height:
      width < 360
        ? wp(16)
        : wp(18),

    borderRadius: wp(10),

    alignSelf: 'center',

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: hp(1.5),
  },

  tickImage: {
    width:
      width < 360
        ? wp(14)
        : wp(15),

    height:
      width < 360
        ? wp(14)
        : wp(15),
  },

  // ✅ TITLE
  title: {
    fontSize: responsiveFont(22),

    fontWeight: 'bold',

    textAlign: 'center',

    color: '#111',

    lineHeight: responsiveFont(30),
  },

  // ✅ SUBTITLE
  subtitle: {
    textAlign: 'center',

    color: '#666',

    marginTop: hp(0.8),

    marginBottom: hp(2),

    fontSize: responsiveFont(14),

    lineHeight: responsiveFont(22),

    paddingHorizontal: wp(2),
  },

  // ✅ OTP ROW
  otpRow: {
    flexDirection: 'row',

    justifyContent:
      'space-between',

    alignItems: 'center',

    marginBottom: hp(3),

    width: '100%',
  },

  // ✅ OTP BOX
  otpBox: {
    width: otpBoxSize,

    height: otpBoxSize * 1.2,

    borderWidth: 1,

    borderColor: '#ddd',

    borderRadius: wp(3),

    textAlign: 'center',

    fontSize: responsiveFont(20),

    backgroundColor: '#F9F9F9',

    color: '#111',
  },

  // ✅ TIMER
  timer: {
    textAlign: 'center',

    color: '#999',

    marginBottom: hp(2.5),

    fontSize: responsiveFont(14),
  },

  // ✅ RESEND
  resend: {
    textAlign: 'center',

    color: '#F39C12',

    fontWeight: 'bold',

    marginBottom: hp(2.5),

    fontSize: responsiveFont(15),
  },

  // ✅ BUTTON
  btn: {
    backgroundColor: '#4A7C1C',

    height:
      width < 360
        ? hp(6.5)
        : hp(7),

    borderRadius: wp(3.5),

    alignItems: 'center',

    justifyContent: 'center',
  },

  btnText: {
    color: '#fff',

    fontSize: responsiveFont(18),

    fontWeight: 'bold',
  },

  // ✅ ERROR
  errorText: {
    color: 'red',

    textAlign: 'center',

    marginBottom: hp(2),

    fontSize: responsiveFont(13),
  },
});