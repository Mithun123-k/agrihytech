// PremiumScreen.js

import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";

import RazorpayCheckout from "react-native-razorpay";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  getPlans,
  createOrder,
  verifyPayment,
  activateTrial,
} from "../../features/subscription/subscriptionSlice";

import { loadUser } from "../../features/auth/authSlice";


// ==========================================
// RESPONSIVE HELPERS
// ==========================================

const { width, height } =
  Dimensions.get("window");

const guidelineBaseWidth = 390;
const guidelineBaseHeight = 844;

const scale = (size) =>
  (width / guidelineBaseWidth) *
  size;

const verticalScale = (size) =>
  (height / guidelineBaseHeight) *
  size;

const moderateScale = (
  size,
  factor = 0.5
) =>
  size +
  (scale(size) - size) * factor;

const isSmallDevice =
  width < 360 || height < 700;

const isTablet = width >= 768;


// ==========================================
// FEATURE ITEM
// ==========================================

const FeatureItem = ({ text }) => (
  <View style={styles.featureRow}>

    <View style={styles.checkIcon}>
      <Ionicons
        name="checkmark"
        size={moderateScale(13)}
        color="#fff"
      />
    </View>

    <Text style={styles.featureText}>
      {text}
    </Text>

  </View>
);


// ==========================================
// PLAN CARD
// ==========================================

const PlanCard = ({
  title,
  price,
  subText,
  selected,
  onPress,
  highlight,
}) => {

  return (

    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.planCard,
        selected &&
          styles.planSelected,
      ]}
    >

      <View style={{ flex: 1 }}>

        <Text style={styles.planTitle}>
          {title}{" "}

          <Text style={styles.priceText}>
            ₹{price}
          </Text>

        </Text>

        {!!subText && (

          <Text style={styles.subText}>
            {subText}
          </Text>

        )}

        {highlight && (

          <View style={styles.saveBadge}>

            <Text style={styles.saveText}>
              Recommended
            </Text>

          </View>

        )}

      </View>

      <View
        style={[
          styles.radio,
          selected &&
            styles.radioSelected,
        ]}
      >

        {selected && (
          <View
            style={styles.radioInner}
          />
        )}

      </View>

    </TouchableOpacity>

  );
};


// ==========================================
// MAIN SCREEN
// ==========================================

const PremiumScreen = () => {

  const dispatch = useDispatch();

  const [selectedPlan, setSelectedPlan] =
    useState(null);

  const {
    plans,
    loading,
  } = useSelector(
    (state) => state.subscription
  );

  const {
    user,
    token,
  } = useSelector(
    (state) => state.auth
  );


  // FETCH PLANS
  useEffect(() => {

    dispatch(getPlans());

  }, []);


  // AUTO SELECT FIRST PLAN
  useEffect(() => {

    if (
      plans &&
      plans.length > 0
    ) {
      setSelectedPlan(plans[0]);
    }

  }, [plans]);


  // ==========================================
  // FREE TRIAL
  // ==========================================

  const handleTrial =
    async () => {

      try {

        await dispatch(
          activateTrial()
        ).unwrap();

        if (token) {

          await AsyncStorage.setItem(
            "token",
            token
          );

        }

        await dispatch(
          loadUser()
        );

        Alert.alert(
          "Success",
          "7 Days Free Trial Activated"
        );

      } catch (err) {

        Alert.alert(
          "Trial Failed",
          err?.message || err
        );

      }
    };


  // ==========================================
  // PAYMENT FLOW
  // ==========================================

  const handlePayment =
    async () => {

      try {

        if (!selectedPlan) {

          return Alert.alert(
            "Please select a plan"
          );

        }

        // CREATE ORDER
        const order =
          await dispatch(
            createOrder(
              selectedPlan._id
            )
          ).unwrap();

        // RAZORPAY OPTIONS
        const options = {

          key: order.key,

          amount: order.amount,

          currency: order.currency,

          name: "AgriHytech",

          description:
            selectedPlan.name,

          order_id:
            order.orderId,

          prefill: {

            contact:
              user?.mobile || "",

          },

          theme: {
            color: "#4C7C1A",
          },
        };

        // OPEN PAYMENT
        const paymentData =
          await RazorpayCheckout.open(
            options
          );

        // VERIFY PAYMENT
        await dispatch(
          verifyPayment({

            razorpay_order_id:
              paymentData.razorpay_order_id,

            razorpay_payment_id:
              paymentData.razorpay_payment_id,

            razorpay_signature:
              paymentData.razorpay_signature,

            planId:
              selectedPlan._id,

          })
        ).unwrap();

        if (token) {

          await AsyncStorage.setItem(
            "token",
            token
          );

        }

        await dispatch(
          loadUser()
        );

        Alert.alert(
          "Success",
          "Subscription Activated"
        );

      } catch (err) {

        Alert.alert(
          "Payment Failed",
          err?.description ||
            err?.message ||
            "Payment cancelled"
        );

      }
    };


  // ==========================================
  // UI
  // ==========================================

  return (

    <View style={{ flex: 1 }}>

      <ImageBackground
        source={require("../../assets/images/loginback.png")}
        style={styles.bg}
        resizeMode="cover"
      >

        <SafeAreaView
          style={styles.safeArea}
        >

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              styles.scrollContainer
            }
          >

            {/* TOP BUTTON */}
            <View style={styles.topRow}>

              <TouchableOpacity
                style={styles.skipBtn}
                activeOpacity={0.85}
                onPress={handleTrial}
              >

                <Text
                  style={styles.skipText}
                >
                  Start Free Trial
                </Text>

              </TouchableOpacity>

            </View>


            {/* MAIN CARD */}
            <View style={styles.card}>

              {/* PREMIUM BADGE */}
              <View
                style={styles.premiumBadge}
              >

                <Ionicons
                  name="diamond"
                  size={moderateScale(14)}
                  color="#fff"
                />

                <Text
                  style={styles.badgeText}
                >
                  PREMIUM
                </Text>

              </View>


              {/* TITLE */}
              <Text style={styles.title}>
                Unlock Premium Seller
                Experience
              </Text>

              {/* SUBTITLE */}
              <Text style={styles.subtitle}>
                Boost your business
                visibility and grow
                faster with premium
                selling tools.
              </Text>


              {/* FEATURES */}
              <View
                style={
                  styles.featuresContainer
                }
              >

                <FeatureItem
                  text="Seller can add and publish products without limits"
                />

                <FeatureItem
                  text="Products appear higher in search and category results"
                />

                <FeatureItem
                  text="Unlock calls, messages, or order requests from buyers"
                />

                <FeatureItem
                  text="Clean, distraction-free selling experience"
                />

              </View>


              {/* PLANS */}
              <View
                style={styles.planContainer}
              >

                {loading &&
                plans.length === 0 ? (

                  <ActivityIndicator
                    size="large"
                    color="#4C7C1A"
                  />

                ) : (

                  plans.map((plan) => (

                    <PlanCard

                      key={plan._id}

                      title={plan.name}

                      price={plan.price}

                      subText={`${plan.duration} days access`}

                      highlight={
                        plan.isRecommended
                      }

                      selected={
                        selectedPlan?._id ===
                        plan._id
                      }

                      onPress={() =>
                        setSelectedPlan(
                          plan
                        )
                      }

                    />

                  ))
                )}

              </View>


              {/* FOOTER TEXT */}
              <Text
                style={styles.trialText}
              >
                Cancel anytime. Secure
                payment powered by
                Razorpay.
              </Text>


              {/* CONTINUE BUTTON */}
              <TouchableOpacity
                style={styles.continueBtn}
                onPress={handlePayment}
                activeOpacity={0.9}
                disabled={loading}
              >

                <Text
                  style={
                    styles.continueText
                  }
                >
                  {loading
                    ? "Processing..."
                    : "Continue"}
                </Text>

              </TouchableOpacity>


              {/* FOOTER */}
              <Text
                style={styles.footerText}
              >
                Terms · Privacy
              </Text>

            </View>

          </ScrollView>

        </SafeAreaView>

      </ImageBackground>

    </View>

  );
};

export default PremiumScreen;


// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({

  bg: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
    paddingBottom:
      verticalScale(50),
  },

  topRow: {
    alignItems: "flex-end",

    paddingHorizontal:
      moderateScale(18),

    paddingTop:
      Platform.OS === "android"
        ? verticalScale(
            isSmallDevice
              ? 18
              : 28
          )
        : verticalScale(10),
  },

  skipBtn: {
    paddingHorizontal:
      moderateScale(16),

    paddingVertical:
      verticalScale(9),

    borderRadius:
      moderateScale(30),

    backgroundColor:
      "rgba(255,255,255,0.95)",

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.6)",

    elevation: 3,
    marginTop:verticalScale(15)
  },

  skipText: {
    fontSize:
      moderateScale(13),

    color: "#222",

    fontWeight: "700",
  },

  card: {
    backgroundColor:
      "rgba(255,255,255,0.98)",

    marginTop:
      verticalScale(10),

    borderRadius:
      moderateScale(30),

    paddingHorizontal:
      moderateScale(18),

    paddingVertical:
      verticalScale(24),

    elevation: 10,

    shadowColor: "#000",

    shadowOpacity: 0.08,

    shadowRadius: 12,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    borderWidth: 1,

    borderColor: "#ECECEC",

    width: "92%",

    alignSelf: "center",

    maxWidth: isTablet
      ? 650
      : "100%",
  },

  premiumBadge: {
    flexDirection: "row",

    alignItems: "center",

    alignSelf: "flex-start",

    backgroundColor: "#111827",

    paddingHorizontal:
      moderateScale(12),

    paddingVertical:
      verticalScale(6),

    borderRadius:
      moderateScale(30),

    marginBottom:
      verticalScale(10),
  },

  badgeText: {
    color: "#fff",

    fontSize:
      moderateScale(11),

    fontWeight: "700",

    marginLeft:
      moderateScale(6),

    letterSpacing: 0.8,
  },

  title: {
    fontSize: isSmallDevice
      ? moderateScale(22)
      : moderateScale(22),

    fontWeight: "800",

    color: "#111827",

    // lineHeight:
    //   verticalScale(
    //     isSmallDevice
    //       ? 30
    //       : 38
    //   ),

    letterSpacing: 0.3,
  },

  subtitle: {
    fontSize:
      moderateScale(14),

    color: "#6B7280",

    marginTop:
      verticalScale(5),

    // lineHeight:
    //   verticalScale(22),

    fontWeight: "500",
  },

  featuresContainer: {
    marginTop:
      verticalScale(5),
  },

  featureRow: {
    flexDirection: "row",

    alignItems: "flex-start",

    marginBottom:
      verticalScale(5),
  },

  checkIcon: {
    width: moderateScale(18),

    height:
      moderateScale(18),

    borderRadius:
      moderateScale(11),

    backgroundColor: "#D28A00",

    justifyContent: "center",

    alignItems: "center",

    marginRight:
      moderateScale(12),

    marginTop: 2,
  },

  featureText: {
    flex: 1,

    fontSize: isSmallDevice
      ? moderateScale(12.5)
      : moderateScale(14),

    color: "#4B5563",

    // lineHeight:
    //   verticalScale(22),

    fontWeight: "500",
  },

  planContainer: {
    marginTop:
      verticalScale(12),
  },

  planCard: {
    borderWidth: 1.2,

    borderColor: "#E5E7EB",

    borderRadius:
      moderateScale(20),

    padding:
      moderateScale(16),

    marginBottom:
      verticalScale(14),

    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",

    backgroundColor: "#fff",

    minHeight:
      verticalScale(82),
  },

  planSelected: {
    backgroundColor: "#F4FAEE",

    borderColor: "#6A9E3F",
  },

  planTitle: {
    fontSize: isSmallDevice
      ? moderateScale(14)
      : moderateScale(16),

    fontWeight: "700",

    color: "#111827",

    // lineHeight:
    //   verticalScale(22),
  },

  priceText: {
    color: "#3D7A12",

    fontWeight: "800",
  },

  subText: {
    fontSize:
      moderateScale(12),

    color: "#6B7280",

    marginTop:
      verticalScale(5),

    fontWeight: "500",
  },

  saveBadge: {
    marginTop:
      verticalScale(8),

    backgroundColor: "#2563EB",

    paddingHorizontal:
      moderateScale(10),

    paddingVertical:
      verticalScale(5),

    borderRadius:
      moderateScale(8),

    alignSelf: "flex-start",
  },

  saveText: {
    color: "#fff",

    fontSize:
      moderateScale(11),

    fontWeight: "700",
  },

  radio: {
    width: moderateScale(24),

    height:
      moderateScale(24),

    borderRadius:
      moderateScale(12),

    borderWidth: 1.5,

    borderColor: "#A1A1AA",

    justifyContent: "center",

    alignItems: "center",

    marginLeft:
      moderateScale(10),
  },

  radioSelected: {
    borderColor: "#111827",
  },

  radioInner: {
    width: moderateScale(11),

    height:
      moderateScale(11),

    borderRadius:
      moderateScale(6),

    backgroundColor: "#111827",
  },

  trialText: {
    textAlign: "center",

    color: "#6B7280",

    marginTop:
      verticalScale(8),

    marginBottom:
      verticalScale(16),

    lineHeight:
      verticalScale(20),

    fontSize:
      moderateScale(13),

    fontWeight: "500",
  },

  continueBtn: {
    backgroundColor: "#4C7C1A",

    paddingVertical:
      verticalScale(
        isSmallDevice
          ? 14
          : 16
      ),

    borderRadius:
      moderateScale(18),

    alignItems: "center",

    marginTop:
      verticalScale(4),

    elevation: 3,

    shadowColor: "#000",

    shadowOpacity: 0.1,

    shadowRadius: 5,

    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  continueText: {
    color: "#fff",

    fontSize:
      moderateScale(16),

    fontWeight: "700",

    letterSpacing: 0.3,
  },

  footerText: {
    textAlign: "center",

    fontSize:
      moderateScale(12),

    color: "#9CA3AF",

    marginTop:
      verticalScale(16),

    marginBottom:
      verticalScale(4),

    fontWeight: "500",
  },

});