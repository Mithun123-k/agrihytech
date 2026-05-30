import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
} from "react-native";

import { Formik } from "formik";
import * as Yup from "yup";

import { useDispatch, useSelector } from "react-redux";
import { registerB2B } from "../../features/auth/authSlice";

import FormikInput from "../../components/auth/FormikInput";
import PasswordInput from "../../components/auth/PasswordInput";

import { responsiveFont, scale } from "../../utils/responsive";
import { getPublicCategories } from "../../features/category/categorySlice";

import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ Validation
const schema = Yup.object().shape({
  firmName: Yup.string().required(
    "Firm name required"
  ),

  proprietorName: Yup.string().required(
    "Proprietor name required"
  ),

  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Invalid phone number")
    .required("Phone required"),

  // ✅ CATEGORY REQUIRED
  categories: Yup.array()
    .min(1, "Please select at least 1 category")
    .required("Category is required"),
});

export default function RegisterScreen({
  navigation,
}) {
  const dispatch = useDispatch();

  const { loading } = useSelector(
    (state) => state.auth
  );

  const { publicCategories } = useSelector(
    (state) => state.category
  );

  const [openCat, setOpenCat] = useState(false);

  const categories = publicCategories || [];

  // ✅ GET CATEGORIES
  useEffect(() => {
    dispatch(getPublicCategories());
  }, []);

  return (
    <ImageBackground
      source={require("../../assets/images/loginback.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <Formik
        initialValues={{
          firmName: "",
          proprietorName: "",
          phone: "",
          password: "",
          state: "",
          district: "",
          village: "",
          pincode: "",
          categories: [],
        }}
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            const result = await dispatch(
              registerB2B({
                mobile: values.phone,

                firmName: values.firmName,

                proprietorName:
                  values.proprietorName,

                password: values.password,

                state: values.state,

                district: values.district,

                village: values.village,

                pincode: values.pincode,

                categories: values.categories,

                lat: 26.3,
                lng: 84.4,
              })
            );

            if (
              registerB2B.fulfilled.match(
                result
              )
            ) {
              Alert.alert(
                "Success",
                "Registration successful"
              );

              const token =
                result.payload.token;

              await AsyncStorage.setItem(
                "token",
                token
              );

              navigation.replace(
                "PremiumScreen"
              );
            } else {
              Alert.alert(
                "Error",
                result.payload ||
                  "Registration failed"
              );
            }
          } catch (err) {
            Alert.alert(
              "Error",
              "Something went wrong"
            );
          }
        }}
      >
        {({
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.card}>
            {/* 🌐 Language */}
            <TouchableOpacity
              style={styles.langBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.langText}>
                🌐 हिंदी में
              </Text>
            </TouchableOpacity>

            {/* 🟢 Logo */}
            <Image
              source={require("../../assets/icons/Logo.png")}
              style={styles.logo}
            />

            {/* 📝 Title */}
            <Text style={styles.title}>
              Start your smart farming
              journey 🌾
            </Text>

            {/* ================= FORM ================= */}

            <ScrollView
              contentContainerStyle={
                styles.scrollContent
              }
              showsVerticalScrollIndicator={
                false
              }
              keyboardShouldPersistTaps="handled"
              bounces={false}
            >
              {/* Firm Name */}
              <FormikInput
                name="firmName"
                label="Firm Name"
                placeholder="Enter your firm name"
              />

              {/* Proprietor */}
              <FormikInput
                name="proprietorName"
                label="Proprietor Name"
                placeholder="Proprietor name"
              />

              {/* Phone */}
              <FormikInput
                name="phone"
                label="Phone Number"
                keyboardType="number-pad"
                placeholder="9876543210"
              />

              {/* Password */}
              {/* <PasswordInput
                name="password"
                label="Create Password"
                placeholder="Enter Password"
              /> */}

              {/* ================= CATEGORY ================= */}

              <View style={{ marginTop: scale(2) }}>
                <Text style={styles.locationTitle}>
                  Categories{" "}
                  <Text
                    style={{ color: "red" }}
                  >
                    *
                  </Text>
                </Text>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.categorySelector,

                    touched.categories &&
                      errors.categories &&
                      styles.categoryErrorBorder,
                  ]}
                  onPress={() =>
                    setOpenCat(true)
                  }
                >
                  <Text
                    style={[
                      styles.categoryText,

                      !values.categories
                        ?.length && {
                        color: "#999",
                      },
                    ]}
                    numberOfLines={2}
                  >
                    {values.categories
                      ?.length
                      ? values.categories.join(
                          ", "
                        )
                      : "Select Category"}
                  </Text>

                  <Text
                    style={
                      styles.dropdownArrow
                    }
                  >
                    ▼
                  </Text>
                </TouchableOpacity>

                {/* ERROR */}
                {touched.categories &&
                  errors.categories && (
                    <Text
                      style={styles.errorText}
                    >
                      {errors.categories}
                    </Text>
                  )}
              </View>

              {/* ================= LOCATION ================= */}

              <View style={styles.locationBox}>
                <Text
                  style={styles.locationTitle}
                >
                  📍 Your Location
                </Text>

                <FormikInput
                  name="state"
                  placeholder="State"
                />

                <View style={styles.row}>
                  <View
                    style={{
                      flex: 1,
                      marginRight: scale(10),
                    }}
                  >
                    <FormikInput
                      name="district"
                      placeholder="District"
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <FormikInput
                      name="village"
                      placeholder="City/Village"
                    />
                  </View>
                </View>

                <FormikInput
                  name="pincode"
                  placeholder="Pincode"
                  keyboardType="number-pad"
                />
              </View>
            </ScrollView>

            {/* ================= BUTTON ================= */}

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  Register
                </Text>
              )}
            </TouchableOpacity>

            {/* ================= CATEGORY MODAL ================= */}

            <Modal
              visible={openCat}
              transparent
              animationType="slide"
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalBox}>
                  <Text
                    style={styles.modalTitle}
                  >
                    Select up to 2 categories
                  </Text>

                  <ScrollView
                    showsVerticalScrollIndicator={
                      false
                    }
                  >
                    {(publicCategories || []).map(
                      (item) => {
                        const label =
                          item.name || item;

                        const selected =
                          values.categories.includes(
                            label
                          );

                        return (
                          <TouchableOpacity
                            key={label}
                            style={
                              styles.categoryItem
                            }
                            activeOpacity={
                              0.8
                            }
                            onPress={() => {
                              let updated = [
                                ...values.categories,
                              ];

                              if (
                                selected
                              ) {
                                updated =
                                  updated.filter(
                                    (c) =>
                                      c !==
                                      label
                                  );
                              } else {
                                if (
                                  updated.length <
                                  2
                                ) {
                                  updated.push(
                                    label
                                  );
                                } else {
                                  Alert.alert(
                                    "Limit",
                                    "Only 2 categories allowed"
                                  );

                                  return;
                                }
                              }

                              setFieldValue(
                                "categories",
                                updated
                              );
                            }}
                          >
                            <Text
                              style={
                                styles.categoryLabel
                              }
                            >
                              {label}
                            </Text>

                            <View
                              style={[
                                styles.checkBox,
                                selected &&
                                  styles.checkBoxActive,
                              ]}
                            >
                              {selected && (
                                <Text
                                  style={
                                    styles.checkText
                                  }
                                >
                                  ✓
                                </Text>
                              )}
                            </View>
                          </TouchableOpacity>
                        );
                      }
                    )}
                  </ScrollView>

                  {/* DONE BUTTON */}

                  <TouchableOpacity
                    style={styles.doneBtn}
                    activeOpacity={0.9}
                    onPress={() =>
                      setOpenCat(false)
                    }
                  >
                    <Text
                      style={styles.doneText}
                    >
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        )}
      </Formik>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // ================= BG =================

  bg: {
    flex: 1,
  },

  // ================= CARD =================

  card: {
    flex: 1,

    marginTop: scale(55),

    backgroundColor: "#FFFFFF",

    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),

    paddingHorizontal: scale(18),
    paddingTop: scale(20),

    marginHorizontal: "3%",

    elevation: 3,

    borderWidth: 0.5,
    borderColor: "#E5E5E5",

    overflow: "hidden",
  },

  // ================= LANGUAGE =================

  langBtn: {
    position: "absolute",

    right: scale(18),
    top: scale(18),

    borderWidth: 1,
    borderColor: "#E0E0E0",

    borderRadius: scale(20),

    paddingHorizontal: scale(12),
    paddingVertical: scale(6),

    backgroundColor: "#FAFAFA",

    zIndex: 10,
  },

  langText: {
    fontSize: responsiveFont(13),
    color: "#333",
    fontWeight: "500",
  },

  // ================= LOGO =================

  logo: {
    width: scale(110),
    height: scale(110),

    resizeMode: "contain",

    alignSelf: "center",

    marginTop: scale(25),
  },

  // ================= TITLE =================

  title: {
    fontSize: responsiveFont(21),

    textAlign: "center",

    marginTop: scale(10),
    marginBottom: scale(18),

    fontWeight: "700",

    color: "#222",

    paddingHorizontal: scale(8),

    lineHeight: responsiveFont(30),
  },

  // ================= SCROLL =================

  scrollContent: {
    paddingBottom: scale(35),
  },

  // ================= LOCATION =================

  locationBox: {
    backgroundColor: "#F9F9FA",

    padding: scale(10),

    borderRadius: scale(14),

    marginTop: scale(14),

    borderWidth: 1,
    borderColor: "#EFEFEF",
  },

  locationTitle: {
    fontSize: responsiveFont(16),

    marginBottom: scale(10),

    fontWeight: "600",

    color: "#222",
  },

  row: {
    flexDirection: "row",
  },

  // ================= CATEGORY =================

  categorySelector: {
    borderWidth: 1,
    borderColor: "#DDDDDD",

    borderRadius: scale(12),

    paddingHorizontal: scale(14),
    paddingVertical: scale(14),

    backgroundColor: "#FFFFFF",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    minHeight: scale(54),
  },

  categoryText: {
    flex: 1,

    color: "#222",

    fontSize: responsiveFont(14),

    fontWeight: "500",

    marginRight: scale(10),
  },

  dropdownArrow: {
    fontSize: responsiveFont(12),
    color: "#777",
  },

  categoryErrorBorder: {
    borderColor: "#E53935",
  },

  errorText: {
    color: "#E53935",

    marginTop: scale(6),

    fontSize: responsiveFont(12),

    fontWeight: "500",
  },

  // ================= BUTTON =================

  button: {
    backgroundColor: "#2e7d32",

    paddingVertical: scale(15),

    borderRadius: scale(14),

    marginTop: scale(18),
    marginBottom: scale(12),

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#2e7d32",
    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.18,
    shadowRadius: 4,

    elevation: 4,
  },

  buttonText: {
    color: "#fff",

    textAlign: "center",

    fontSize: responsiveFont(16),

    fontWeight: "700",
  },

  // ================= MODAL =================

  modalOverlay: {
    flex: 1,

    justifyContent: "center",

    backgroundColor: "rgba(0,0,0,0.45)",

    paddingHorizontal: scale(20),
  },

  modalBox: {
    backgroundColor: "#fff",

    borderRadius: scale(22),

    padding: scale(20),

    maxHeight: "70%",

    elevation: 5,
  },

  modalTitle: {
    fontSize: responsiveFont(18),

    fontWeight: "700",

    color: "#222",

    marginBottom: scale(16),
  },

  categoryItem: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingVertical: scale(14),

    borderBottomWidth: 1,

    borderColor: "#F0F0F0",
  },

  categoryLabel: {
    flex: 1,

    fontSize: responsiveFont(15),

    color: "#333",

    fontWeight: "500",
  },

  checkBox: {
    width: scale(22),
    height: scale(22),

    borderRadius: scale(11),

    borderWidth: 1.5,

    borderColor: "#CCCCCC",

    justifyContent: "center",
    alignItems: "center",
  },

  checkBoxActive: {
    backgroundColor: "#2e7d32",

    borderColor: "#2e7d32",
  },

  checkText: {
    color: "#fff",

    fontSize: responsiveFont(12),

    fontWeight: "700",
  },

  doneBtn: {
    marginTop: scale(18),

    backgroundColor: "#2e7d32",

    paddingVertical: scale(14),

    borderRadius: scale(14),

    alignItems: "center",
  },

  doneText: {
    color: "#fff",

    fontSize: responsiveFont(15),

    fontWeight: "700",
  },
});