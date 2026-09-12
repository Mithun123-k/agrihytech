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
import { registerB2B, registerCompany } from "../../features/auth/authSlice";

import FormikInput from "../../components/auth/FormikInput";
import PasswordInput from "../../components/auth/PasswordInput";

import { responsiveFont, scale } from "../../utils/responsive";
import { getPublicCategories } from "../../features/category/categorySlice";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchImageLibrary } from "react-native-image-picker";
import { getAssignableBrandsAPI } from "../../features/brands/brandAPI";

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

const companySchema = Yup.object().shape({
  companyName: Yup.string().trim().min(2, "Company name required").required("Company name required"),
  contactPerson: Yup.string().trim().min(2, "Contact person required").required("Contact person required"),
  phone: Yup.string().matches(/^[0-9]{10}$/, "Invalid phone number").required("Phone required"),
  email: Yup.string().trim().email("Invalid email address"),
  categories: Yup.array().min(1, "Please select at least 1 category").max(2, "Only 2 categories allowed").required("Category is required"),
});

export default function RegisterScreen({
  navigation,
  route,
}) {
  const isCompany = route?.params?.role === "COMPANY";
  const dispatch = useDispatch();

  const { loading } = useSelector(
    (state) => state.auth
  );

  const { publicCategories } = useSelector(
    (state) => state.category
  );

  const [openCat, setOpenCat] = useState(false);
  const [openBrand, setOpenBrand] = useState(false);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [companyLogo, setCompanyLogo] = useState(null);

  const categories = publicCategories || [];

  // ✅ GET CATEGORIES
  useEffect(() => {
    dispatch(getPublicCategories());
  }, [dispatch]);

  useEffect(() => {
    if (isCompany) return;
    let active = true;
    setBrandsLoading(true);
    getAssignableBrandsAPI()
      .then(({ data }) => {
        if (active) setAvailableBrands(data.brands || []);
      })
      .catch(() => {
        if (active) setAvailableBrands([]);
      })
      .finally(() => {
        if (active) setBrandsLoading(false);
      });
    return () => { active = false; };
  }, [isCompany]);

  const pickCompanyLogo = async () => {
    const result = await launchImageLibrary({ mediaType: "photo", selectionLimit: 1, quality: 0.8 });
    if (result.errorCode) {
      Alert.alert("Logo", result.errorMessage || "Unable to select logo");
      return;
    }
    if (!result.didCancel && result.assets?.[0]) setCompanyLogo(result.assets[0]);
  };

  return (
    <ImageBackground
      source={require("../../assets/images/loginback.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <Formik
        initialValues={{
          companyName: "",
          contactPerson: "",
          email: "",
          gstNumber: "",
          address: "",
          firmName: "",
          proprietorName: "",
          phone: "",
          password: "",
          state: "",
          district: "",
          village: "",
          pincode: "",
          categories: [],
          dealerBrands: [],
        }}
        validationSchema={isCompany ? companySchema : schema}
        onSubmit={async (values) => {
          try {
            const registerAccount = isCompany ? registerCompany : registerB2B;
            if (isCompany && !companyLogo) {
              Alert.alert("Logo required", "Please select your company logo");
              return;
            }

            let registrationData;
            if (isCompany) {
              registrationData = new FormData();
              registrationData.append("mobile", values.phone);
              registrationData.append("companyName", values.companyName.trim());
              registrationData.append("contactPerson", values.contactPerson.trim());
              if (values.email.trim()) registrationData.append("email", values.email.trim());
              values.categories.forEach(category => registrationData.append("categories", category));
              registrationData.append("profileimage", {
                uri: companyLogo.uri,
                type: companyLogo.type || "image/jpeg",
                name: companyLogo.fileName || "company-logo.jpg",
              });
            } else {
              registrationData = {
                mobile: values.phone,
                firmName: values.firmName,
                proprietorName: values.proprietorName,
                password: values.password,
                state: values.state,
                district: values.district,
                village: values.village,
                pincode: values.pincode,
                categories: values.categories,
                dealerBrands: values.dealerBrands || [],
                lat: 26.3,
                lng: 84.4,
              };
            }
            const result = await dispatch(
              registerAccount(registrationData)
            );

            if (
              registerAccount.fulfilled.match(
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
              {isCompany ? "Register your company" : "Start your smart farming journey 🌾"}
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
                name={isCompany ? "companyName" : "firmName"}
                label={isCompany ? "Company Name" : "Firm Name"}
                placeholder={isCompany ? "Enter your company name" : "Enter your firm name"}
              />

              {isCompany && (
                <View style={styles.logoField}>
                  <Text style={styles.locationTitle}>Company Logo <Text style={styles.required}>*</Text></Text>
                  {companyLogo?.uri ? <Image source={{ uri: companyLogo.uri }} style={styles.companyLogoPreview} /> : null}
                  <TouchableOpacity style={styles.logoPicker} activeOpacity={0.8} onPress={pickCompanyLogo}>
                    <Text style={styles.logoPickerText}>{companyLogo ? "Change Company Logo" : "Select Company Logo"}</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Proprietor */}
              <FormikInput
                name={isCompany ? "contactPerson" : "proprietorName"}
                label={isCompany ? "Contact Person" : "Proprietor Name"}
                placeholder={isCompany ? "Contact person name" : "Proprietor name"}
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

              {isCompany && (
                <FormikInput name="email" label="Email (optional)" placeholder="Company email" keyboardType="email-address" autoCapitalize="none" />
              )}

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

              {!isCompany && (
                <View style={{ marginTop: scale(14) }}>
                  <Text style={styles.locationTitle}>Select Brand</Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.categorySelector}
                    onPress={() => setOpenBrand(true)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        !(values.dealerBrands || []).length && { color: "#999" },
                      ]}
                      numberOfLines={2}
                    >
                      {(values.dealerBrands || []).length
                        ? availableBrands
                            .filter(brand => (values.dealerBrands || []).includes(brand._id))
                            .map(brand => brand.name)
                            .join(", ")
                        : brandsLoading
                          ? "Loading brands..."
                          : "Select Brand"}
                    </Text>
                    <Text style={styles.dropdownArrow}>▼</Text>
                  </TouchableOpacity>
                </View>
              )}
              {/* ================= LOCATION ================= */}

              {!isCompany && <View style={styles.locationBox}>
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
              </View>}
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

            <Modal
              visible={openBrand}
              transparent
              animationType="slide"
              onRequestClose={() => setOpenBrand(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalBox}>
                  <Text style={styles.modalTitle}>Select Brand</Text>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {availableBrands
                      .filter(brand => {
                        if (!values.categories.length) return true;
                        if (brand.isCompany) {
                          return (brand.categories || []).some(category =>
                            values.categories.includes(category)
                          );
                        }
                        return !brand.category?.name ||
                          values.categories.includes(brand.category.name);
                      })
                      .map(brand => {
                        const selected = (values.dealerBrands || []).includes(brand._id);
                        return (
                          <TouchableOpacity
                            key={brand._id}
                            style={styles.categoryItem}
                            activeOpacity={0.8}
                            onPress={() => {
                              let updated;
                              if (selected) {
                                updated = (values.dealerBrands || []).filter(id => id !== brand._id);
                              } else if (brand.isCompany) {
                                const companyIds = availableBrands
                                  .filter(item => item.isCompany)
                                  .map(item => item._id);
                                updated = (values.dealerBrands || [])
                                  .filter(id => !companyIds.includes(id))
                                  .concat(brand._id);
                              } else {
                                updated = [...(values.dealerBrands || []), brand._id];
                              }
                              setFieldValue("dealerBrands", updated);
                            }}
                          >
                            <View style={styles.brandOption}>
                              {brand.image ? (
                                <Image source={{ uri: brand.image }} style={styles.brandImage} />
                              ) : null}
                              <View style={styles.brandText}>
                                <Text style={styles.categoryLabel}>{brand.name}</Text>
                                {brand.isCompany ? <Text style={styles.companyLabel}>Company</Text> : null}
                              </View>
                            </View>
                            <View style={[styles.checkBox, selected && styles.checkBoxActive]}>
                              {selected ? <Text style={styles.checkText}>✓</Text> : null}
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                  </ScrollView>
                  <TouchableOpacity style={styles.doneBtn} activeOpacity={0.9} onPress={() => setOpenBrand(false)}>
                    <Text style={styles.doneText}>Done</Text>
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

  logoField: {
    marginTop: scale(2),
    marginBottom: scale(12),
  },

  required: {
    color: "red",
  },

  companyLogoPreview: {
    width: scale(92),
    height: scale(92),
    borderRadius: scale(14),
    marginBottom: scale(10),
    resizeMode: "contain",
    alignSelf: "center",
  },

  logoPicker: {
    minHeight: scale(50),
    borderWidth: 1,
    borderColor: "#2e7d32",
    borderRadius: scale(12),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EDF2E9",
  },

  logoPickerText: {
    color: "#2e7d32",
    fontSize: responsiveFont(14),
    fontWeight: "600",
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

  brandOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: scale(12),
  },

  brandImage: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(8),
    resizeMode: "contain",
    marginRight: scale(12),
    backgroundColor: "#F5F5F5",
  },

  brandText: {
    flex: 1,
  },

  companyLabel: {
    marginTop: scale(2),
    color: "#2e7d32",
    fontSize: responsiveFont(11),
    fontWeight: "600",
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
