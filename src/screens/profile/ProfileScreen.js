import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ImageBackground,
  Platform,
  PixelRatio,
  ScrollView,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

import LogoutModal from "../../components/auth/LogoutModal";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { logout } from "../../features/auth/authSlice";

const { width, height } =
  Dimensions.get("window");

// ✅ Responsive Font
const responsiveFont = size => {
  const scale = width / 375;

  const newSize = size * scale;

  if (Platform.OS === "ios") {
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

// ✅ Width %
const wp = percentage => {
  return (width * percentage) / 100;
};

// ✅ Height %
const hp = percentage => {
  return (height * percentage) / 100;
};

const ProfileScreen = ({
  navigation,
}) => {
  const [
    showLogoutModal,
    setShowLogoutModal,
  ] = useState(false);

  const dispatch = useDispatch();

  const { user } =
    useSelector(
      state => state.auth,
    );

  console.log(
    "User Data in ProfileScreen:",
    user?.subscription,
  );

  // =========================
  // Subscription Logic
  // =========================
  const subscription =
    user?.subscription;

  const getRemainingDays =
    () => {
      if (
        !subscription?.endDate
      )
        return 0;

      const today =
        new Date();

      const endDate =
        new Date(
          subscription.endDate,
        );

      const diffTime =
        endDate - today;

      const diffDays =
        Math.ceil(
          diffTime /
          (1000 *
            60 *
            60 *
            24),
        );

      return diffDays > 0
        ? diffDays
        : 0;
    };

  const remainingDays =
    getRemainingDays();

  const isExpired =
    !subscription?.isActive ||
    remainingDays <= 0;

  const isWarning =
    remainingDays <= 3;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Background */}
      <ImageBackground
        source={require("../../assets/images/bg1.png")}
        style={
          styles.backgroundImage
        }
        resizeMode="cover"
      >
        <View
          style={styles.overlay}
        />
      </ImageBackground>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
        >
          <Icon
            name="arrow-back"
            size={responsiveFont(
              22,
            )}
            color="#222"
          />
        </TouchableOpacity>

        <Text
          style={
            styles.headerTitle
          }
        >
          Profile
        </Text>

        <View
          style={{
            width: wp(6),
          }}
        />
      </View>

      {/* SCROLLABLE CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >
        {/* PROFILE CARD */}
        <View
          style={
            styles.profileCard
          }
        >
          <View
            style={
              styles.profileRow
            }
          >
            <Image
              source={{
                uri:
                  user?.profileimage ||
                  "https://i.pravatar.cc/300",
              }}
              style={
                styles.avatar
              }
            />

            <View
              style={
                styles.userInfo
              }
            >
              <Text
                style={
                  styles.name
                }
                numberOfLines={
                  1
                }
              >
                {user?.proprietorName ||
                  "User"}
              </Text>

              <Text
                style={
                  styles.phone
                }
              >
                {user?.mobile ||
                  "NAN"}
              </Text>
            </View>
          </View>

          {/* EDIT */}
          <TouchableOpacity
            activeOpacity={0.5}
            style={
              styles.editIcon
            }
            onPress={() =>
              navigation.navigate(
                "EditProfileScreen",
              )
            }
          >
            <Image
              source={require("../../assets/icons/edit.png")}
              style={
                styles.editIconImage
              }
            />
          </TouchableOpacity>

          {/* PLAN CARD */}
          {user?.role ===
            "B2B" && (
              <View
                style={[
                  styles.planCard,
                  {
                    backgroundColor:
                      isWarning
                        ? "#FDECEC"
                        : "#EAF7EA",
                  },
                ]}
              >
                <View
                  style={
                    styles.planIcon
                  }
                >
                  <Icon
                    name={
                      isExpired
                        ? "close-circle"
                        : isWarning
                          ? "warning"
                          : "checkmark-circle"
                    }
                    size={responsiveFont(
                      22,
                    )}
                    color={
                      isExpired
                        ? "#E74C3C"
                        : isWarning
                          ? "#F39C12"
                          : "#4C8C2B"
                    }
                  />
                </View>

                <View
                  style={
                    styles.planContent
                  }
                >
                  <Text
                    style={[
                      styles.planTitle,
                      {
                        color:
                          isExpired
                            ? "#E74C3C"
                            : isWarning
                              ? "#F39C12"
                              : "#4C8C2B",
                      },
                    ]}
                    numberOfLines={
                      1
                    }
                  >
                    {isExpired
                      ? "Subscription Expired"
                      : user
                        ?.subscription
                        ?.planId
                        ?.name}
                  </Text>

                  <Text
                    style={
                      styles.planDesc
                    }
                  >
                    {isExpired
                      ? "Your subscription has expired"
                      : `Your subscription expires in ${remainingDays} day${remainingDays !==
                        1
                        ? "s"
                        : ""
                      }`}
                  </Text>

                  {/* {subscription?.paymentStatus && (
                  <Text
                    style={
                      styles.paymentStatus
                    }
                  >
                    Payment Status :{" "}
                    {
                      subscription?.paymentStatus
                    }
                  </Text>
                )} */}
                </View>

                <TouchableOpacity
                  style={
                    styles.upgradeBtn
                  }
                  onPress={() =>
                    navigation.navigate(
                      "PremiumScreen",
                    )
                  }
                >
                  <Text
                    style={
                      styles.upgradeText
                    }
                  >
                    {user
                      ?.subscription
                      ?.planId
                      ?.price ===
                      0
                      ? "Upgrade"
                      : "Renew"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
        </View>

        {/* INFO CARD */}
        <View
          style={styles.infoCard}
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            Other Information
          </Text>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                "InfoScreen",
                {
                  id: 1,
                },
              )
            }
          >
            {menuItem(
              "help-circle-outline",
              "Help & Support",
            )}
          </TouchableOpacity>

          {divider()}

          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                "InfoScreen",
                {
                  id: 2,
                },
              )
            }
          >
            {menuItem(
              "document-text-outline",
              "Terms & Conditions",
            )}
          </TouchableOpacity>


          {user?.role !==
            "B2C" && (
              <>
                {divider()}

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(
                      "YourProductsScreen",
                    )
                  }
                >
                  {menuItem(
                    "cube-outline",
                    "Your Products",
                  )}
                </TouchableOpacity>

                {divider()}

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(
                      "OurbrandsScreen",
                    )
                  }
                >
                  {menuItem(
                    "pricetags-outline",
                    "Brands",
                  )}
                </TouchableOpacity>
              </>
            )}

          {divider()}

          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                "InfoScreen",
                {
                  id: 3,
                },
              )
            }
          >
            {menuItem(
              "shield-checkmark-outline",
              "Privacy Policy",
            )}
          </TouchableOpacity>
          {divider()}

          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                "DeleteAccountScreen",
              )
            }
          >
            {menuItem(
              "trash-outline",
              "Delete Account",
            )}
          </TouchableOpacity>

          {divider()}


          <TouchableOpacity
            onPress={() =>
              setShowLogoutModal(
                true,
              )
            }
          >
            {menuItem(
              "power-outline",
              "Logout",
            )}
          </TouchableOpacity>
        </View>

        <View
          style={{
            height: hp(14),
          }}
        />
      </ScrollView>

      {/* TAB BAR */}
      <View style={styles.tabBar}>
        {tabItem(
          "home-outline",
          "Home",
        )}

        {tabItem(
          "search-outline",
          "Search",
        )}

        {tabItem(
          "grid-outline",
          "Category",
        )}

        {tabItem(
          "person",
          "Profile",
          true,
        )}
      </View>

      {/* LOGOUT MODAL */}
      <LogoutModal
        visible={
          showLogoutModal
        }
        onCancel={() =>
          setShowLogoutModal(
            false,
          )
        }
        onLogout={() => {
          dispatch(logout());

          setShowLogoutModal(
            false,
          );

          console.log(
            "User Logged Out",
          );
        }}
      />
    </View>
  );
};

const menuItem = (
  icon,
  label,
) => (
  <View style={styles.menuRow}>
    <Icon
      name={icon}
      size={responsiveFont(
        18,
      )}
      color="#4C8C2B"
    />

    <Text
      style={styles.menuText}
    >
      {label}
    </Text>

    <Icon
      name="chevron-forward"
      size={responsiveFont(
        16,
      )}
      color="#999"
    />
  </View>
);

const divider = () => (
  <View style={styles.divider} />
);

const tabItem = (
  icon,
  label,
  active = false,
) => (
  <View style={styles.tabItem}>
    <Icon
      name={icon}
      size={responsiveFont(
        22,
      )}
      color={
        active
          ? "#4C8C2B"
          : "#888"
      }
    />

    <Text
      style={[
        styles.tabText,
        {
          color: active
            ? "#4C8C2B"
            : "#888",
        },
      ]}
    >
      {label}
    </Text>
  </View>
);

export default ProfileScreen;

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor:
        "#EDF2E9",
    },

    // ✅ Background
    backgroundImage: {
      ...StyleSheet.absoluteFillObject,

      width: "100%",

      height:
        width < 360
          ? hp(24)
          : hp(26),
    },

    overlay: {},

    // ✅ Header
    header: {
      paddingHorizontal:
        wp(5),

      paddingTop:
        Platform.OS ===
          "ios"
          ? hp(7)
          : hp(6),

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",
    },

    headerTitle: {
      fontSize:
        responsiveFont(18),

      fontWeight: "600",

      color: "#222",
    },

    // ✅ Scroll
    scrollContent: {
      paddingBottom:
        hp(4),
    },

    // ✅ Profile Card
    profileCard: {
      backgroundColor:
        "#FFFFFF",

      marginHorizontal:
        wp(5),

      marginTop: hp(2.5),

      borderRadius:
        wp(4.5),

      padding:
        width < 360
          ? wp(4)
          : wp(4.5),

      elevation: 3,

      shadowColor: "#000",

      shadowOpacity: 0.08,

      shadowRadius: 6,

      shadowOffset: {
        width: 0,
        height: 3,
      },
    },

    profileRow: {
      flexDirection: "row",

      alignItems: "center",
    },

    // ✅ Avatar
    avatar: {
      width:
        width < 360
          ? wp(15)
          : wp(16),

      height:
        width < 360
          ? wp(15)
          : wp(16),

      borderRadius:
        wp(20),
    },

    userInfo: {
      marginLeft: wp(3),

      flex: 1,
    },

    // ✅ Name
    name: {
      fontSize:
        responsiveFont(18),

      fontWeight: "700",

      color: "#111",
    },

    // ✅ Phone
    phone: {
      fontSize:
        responsiveFont(12),

      fontWeight: "400",

      color: "#777",

      marginTop:
        hp(0.4),
    },

    // ✅ Edit Icon
    editIcon: {
      position: "absolute",

      right: wp(4),

      top: hp(2),

      backgroundColor:
        "#EDF2E9",

      padding:
        width < 360
          ? wp(2)
          : wp(2.2),

      borderRadius:
        wp(20),
    },

    editIconImage: {
      width:
        width < 360
          ? wp(4)
          : wp(4.2),

      height:
        width < 360
          ? wp(4)
          : wp(4.2),

      tintColor:
        "#4C8C2B",
    },

    // ✅ Plan Card
    planCard: {
      flexDirection: "row",

      alignItems: "center",

      marginTop: hp(2),

      padding:
        width < 360
          ? wp(3)
          : wp(3.5),

      borderRadius:
        wp(4),
    },

    planIcon: {
      width:
        width < 360
          ? wp(11)
          : wp(12),

      height:
        width < 360
          ? wp(11)
          : wp(12),

      borderRadius:
        wp(3),

      backgroundColor:
        "#fff",

      justifyContent:
        "center",

      alignItems: "center",
    },

    planContent: {
      flex: 1,

      marginLeft: wp(3),
    },

    planTitle: {
      fontSize:
        responsiveFont(14),

      fontWeight: "700",
    },

    planDesc: {
      fontSize:
        responsiveFont(12),

      color: "#666",

      marginTop:
        hp(0.3),

      lineHeight:
        responsiveFont(18),
    },

    paymentStatus: {
      fontSize:
        responsiveFont(11),

      color: "#777",

      marginTop:
        hp(0.5),

      fontWeight: "500",
    },

    // ✅ Upgrade Button
    upgradeBtn: {
      backgroundColor:
        "#4C8C2B",

      paddingHorizontal:
        wp(3),

      paddingVertical:
        hp(1),

      borderRadius:
        wp(2.5),

      marginLeft: wp(2),
    },

    upgradeText: {
      color: "#fff",

      fontSize:
        responsiveFont(12),

      fontWeight: "600",
    },

    // ✅ Info Card
    infoCard: {
      backgroundColor:
        "#FFFFFF",

      marginHorizontal:
        wp(5),

      marginTop: hp(2.2),

      borderRadius:
        wp(4.5),

      paddingVertical:
        hp(1.2),

      elevation: 2,

      shadowColor: "#000",

      shadowOpacity: 0.05,

      shadowRadius: 5,

      shadowOffset: {
        width: 0,
        height: 2,
      },
    },

    sectionTitle: {
      fontSize:
        responsiveFont(14),

      fontWeight: "700",

      paddingHorizontal:
        wp(4),

      marginBottom:
        hp(1),
    },

    // ✅ Menu Row
    menuRow: {
      flexDirection: "row",

      alignItems: "center",

      paddingHorizontal:
        wp(4),

      paddingVertical:
        hp(1.8),

      justifyContent:
        "space-between",
    },

    menuText: {
      flex: 1,

      marginLeft: wp(3),

      fontSize:
        responsiveFont(14),

      color: "#222",
    },

    divider: {
      height: 1,

      backgroundColor:
        "#EEE",

      marginHorizontal:
        wp(4),
    },

    // ✅ Bottom Tab
    tabBar: {
      position: "absolute",

      bottom:
        Platform.OS ===
          "ios"
          ? hp(3)
          : hp(2),

      left: wp(5),

      right: wp(5),

      backgroundColor:
        "#FFFFFF",

      borderRadius:
        wp(5),

      flexDirection: "row",

      justifyContent:
        "space-around",

      paddingVertical:
        hp(1.5),

      elevation: 10,

      shadowColor: "#000",

      shadowOpacity: 0.08,

      shadowRadius: 8,

      shadowOffset: {
        width: 0,
        height: 4,
      },
    },

    tabItem: {
      alignItems: "center",

      justifyContent:
        "center",
    },

    tabText: {
      fontSize:
        responsiveFont(12),

      marginTop:
        hp(0.5),

      fontWeight: "500",
    },
  });