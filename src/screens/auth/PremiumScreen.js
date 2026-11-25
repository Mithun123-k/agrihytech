import AppText from '../../components/common/AppText';
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
import { paymentErrorMessage } from "../../utils/paymentError";

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

    <AppText style={styles.featureText}>
      {text}
    </AppText>

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
  features,
  fallbackFeatures,
}) => {
  const planFeatures = features?.length
    ? features
    : fallbackFeatures;

  return (

    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.planCard,
        highlight && styles.planFeatured,
        selected &&
          styles.planSelected,
      ]}
    >

      <View style={styles.planContent}>

        <AppText style={styles.planTitle}>
          {title}{" "}

          <AppText style={styles.priceText}>
            ₹{price}
          </AppText>

        </AppText>

        {!!subText && (

          <AppText style={styles.subText}>
            {subText}
          </AppText>

        )}

        <View style={styles.cardFeatures}>
          {planFeatures.map((feature, index) => (
            <FeatureItem key={`${title}-feature-${index}`} text={feature} />
          ))}
        </View>

        <View style={[styles.planAction, selected && styles.planActionSelected]}>
          <AppText style={styles.planActionText}>{selected ? "Selected plan" : "Select plan"}</AppText>
          <Ionicons name="arrow-forward" size={17} color="#FFFFFF" />
        </View>

        {highlight && (

          <View style={styles.saveBadge}>

            <AppText style={styles.saveText}>
              Recommended
            </AppText>

          </View>

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

  const [processingPlanId, setProcessingPlanId] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

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

  const isCompany = user?.role === "COMPANY";
  const trialPlan = plans.find(plan => Number(plan.price) === 0);
  const canStartTrial = Boolean(trialPlan && !user?.trialUsed);
  const projectFeatures = isCompany
    ? [
        "Publish products under your registered category",
        "Manage your company catalogue in one place",
        "Add and manage authorised dealers",
        "Reach farmers across the Agri HiTech network",
      ]
    : [
        "Add products under your registered categories",
        "Manage company brands and dealership access",
        "Showcase products to farmers and buyers",
        "Receive business enquiries from the marketplace",
      ];


  // FETCH PLANS
  useEffect(() => {

    dispatch(getPlans());

  }, [dispatch]);

  useEffect(() => {
    if (plans?.length && !plans.some(plan => plan._id === selectedPlan?._id)) {
      setSelectedPlan(plans[0]);
    }
  }, [plans, selectedPlan]);


  // ==========================================
  // FREE TRIAL
  // ==========================================

  const handleTrial =
    async () => {

      if (!canStartTrial || loading || processingPlanId) return;
      setProcessingPlanId(trialPlan._id);

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
          "Free trial activated successfully"
        );

      } catch (err) {

        Alert.alert(
          "Trial Failed",
          err?.message || err
        );

      } finally {
        setProcessingPlanId(null);
      }
    };


  // ==========================================
  // PAYMENT FLOW
  // ==========================================

  const handlePayment =
    async (selectedPlan) => {

      if (!selectedPlan) return;
      if (processingPlanId) return;
      setProcessingPlanId(selectedPlan._id);

      try {

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
        const paymentError = paymentErrorMessage(err);
        Alert.alert(paymentError.title, paymentError.message);

      } finally {
        setProcessingPlanId(null);
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
            {canStartTrial ? <View style={styles.topRow}>

              <TouchableOpacity
                style={styles.skipBtn}
                activeOpacity={0.85}
                onPress={handleTrial}
              >

                <AppText
                  style={styles.skipText}
                >
                  Start Free Trial
                </AppText>

              </TouchableOpacity>

            </View> : null}


            {/* MAIN CARD */}
            <View style={styles.card}>

              {/* TITLE */}
              <AppText style={styles.title}>
                Choose your {isCompany ? "company" : "seller"} plan
              </AppText>

              {/* SUBTITLE */}
              <AppText style={styles.subtitle}>
                {isCompany
                  ? "Select the access period that suits your company. Manage products and dealers while reaching farmers across Agri HiTech Kisan."
                  : "Select the access period that suits your shop. Manage products and company partnerships while connecting with farmers."}
              </AppText>


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

                      features={plan.features}

                      fallbackFeatures={projectFeatures}

                      highlight={
                        plan.isRecommended
                      }

                      selected={processingPlanId === plan._id || selectedPlan?._id === plan._id}

                      onPress={() => {
                        if (loading || processingPlanId) return;
                        setSelectedPlan(plan);
                        if (Number(plan.price) === 0) handleTrial();
                        else handlePayment(plan);
                      }}

                    />

                  ))
                )}

              </View>


              {/* FOOTER TEXT */}
              <AppText
                style={styles.trialText}
              >
                Cancel anytime. Secure
                payment powered by
                Razorpay.
              </AppText>


              {/* FOOTER */}
              <AppText
                style={styles.footerText}
              >
                Terms · Privacy
              </AppText>

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

    borderTopWidth: 5,

    borderTopColor: "#4C7C1A",

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

  cardFeatures: {
    marginTop: verticalScale(14),
  },

  featureRow: {
    flexDirection: "row",

    alignItems: "flex-start",

    marginBottom: verticalScale(7),
    paddingVertical: verticalScale(3),
  },

  checkIcon: {
    width: moderateScale(22),

    height:
      moderateScale(22),

    borderRadius:
      moderateScale(11),

    backgroundColor: "#56B847",

    justifyContent: "center",

    alignItems: "center",

    marginRight:
      moderateScale(10),

    marginTop: 2,
  },

  featureText: {
    flex: 1,

    fontSize: isSmallDevice
      ? moderateScale(12)
      : moderateScale(13),

    color: "#20372B",

    // lineHeight:
    //   verticalScale(22),

    fontWeight: "600",
  },

  planContainer: {
    marginTop: verticalScale(14),
    flexDirection: "column",
  },

  planCard: {
    borderWidth: 1.5,

    borderColor: "#75A879",

    borderRadius:
      moderateScale(20),

    borderTopWidth: 1.5,

    padding:
      moderateScale(18),

    marginBottom:
      verticalScale(12),

    flexDirection: "column",

    justifyContent:
      "flex-start",

    backgroundColor: "#FFFFFF",

    minHeight: verticalScale(230),
    width: "100%",
    alignItems: "stretch",
    shadowColor: "#3D7A12",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  planSelected: {
    backgroundColor: "#F4FAEE",

    borderColor: "#4C7C1A",
    borderWidth: 2,

  },

  planFeatured: {
    backgroundColor: "#F3F9E9",
    borderColor: "#6BAF62",
  },

  planContent: { flex: 1 },
  planAction: { marginTop: verticalScale(15), backgroundColor: "#075A35", borderRadius: moderateScale(12), paddingVertical: verticalScale(12), paddingHorizontal: moderateScale(16), flexDirection: "row", alignItems: "center", justifyContent: "center", gap: moderateScale(8) },
  planActionSelected: { backgroundColor: "#8BCF4B" },
  planActionText: { color: "#FFFFFF", fontSize: moderateScale(14), fontWeight: "800" },

  planTitle: {
    fontSize: isSmallDevice
      ? moderateScale(16)
      : moderateScale(18),

    fontWeight: "800",

    color: "#111827",

    // lineHeight:
    //   verticalScale(22),
  },

  priceText: {
    color: "#28620E",

    fontWeight: "800",
    fontSize: moderateScale(30),
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

    backgroundColor: "#FFF2C7",

    paddingHorizontal:
      moderateScale(10),

    paddingVertical:
      verticalScale(5),

    borderRadius:
      moderateScale(8),

    alignSelf: "flex-start",
  },

  saveText: {
    color: "#8A5A00",

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
