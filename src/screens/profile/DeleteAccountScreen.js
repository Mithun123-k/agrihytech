import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  PixelRatio,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

import {
  useDispatch,
} from "react-redux";

import { logout, requestAccountDeletion } from "../../features/auth/authSlice";

const { width, height } =
  Dimensions.get("window");

// Responsive Font
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

// Width %
const wp = percentage => {
  return (width * percentage) / 100;
};

// Height %
const hp = percentage => {
  return (height * percentage) / 100;
};

const DeleteAccountScreen = ({
  navigation,
}) => {
  const dispatch =
    useDispatch();

  const [
    reason,
    setReason,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  // =========================
  // DELETE ACCOUNT
  // =========================
  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style:
            "destructive",
          onPress:
            async () => {
              try {
                setLoading(
                  true,
                );

                // ==================================
                // API CALL HERE
                // ==================================
                // Example:
                //
                // await axios.delete(
                //   "/api/user/delete-account",
                //   {
                //     data: {
                //       reason,
                //     },
                //   },
                // );

                // Fake Delay
                await dispatch(

                  requestAccountDeletion(
                    reason
                  )

                ).unwrap();

                setLoading(
                  false,
                );

                Alert.alert(
                  "Account Deleted",
                  "Your account has been permanently deleted.",
                );

                dispatch(
                  logout(),
                );

                navigation.reset(
                  {
                    index: 0,
                    routes: [
                      {
                        name: "LoginScreen",
                      },
                    ],
                  },
                );
              } catch (error) {

                setLoading(false);

                Alert.alert(
                  "Delete Request",

                  typeof error === "string"
                    ? error
                    : error?.message ||
                    "Something went wrong"
                );
              }
            },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

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
          Delete Account
        </Text>

        <View
          style={{
            width: wp(6),
          }}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >
        {/* ICON */}
        <View
          style={styles.iconBox}
        >
          <Icon
            name="trash-bin"
            size={responsiveFont(
              50,
            )}
            color="#E53935"
          />
        </View>

        {/* TITLE */}
        <Text
          style={styles.title}
        >
          Permanently Delete
          Your Account
        </Text>

        {/* DESCRIPTION */}
        <Text
          style={
            styles.description
          }
        >
          Deleting your account
          will permanently remove
          your profile, saved
          data, preferences, and
          account-related
          information from Agro
          Mere Agri Hitech.
        </Text>

        {/* WARNING CARD */}
        <View
          style={
            styles.warningCard
          }
        >
          <View
            style={
              styles.warningRow
            }
          >
            <Icon
              name="warning"
              size={responsiveFont(
                18,
              )}
              color="#F39C12"
            />

            <Text
              style={
                styles.warningTitle
              }
            >
              Important
            </Text>
          </View>

          <Text
            style={
              styles.warningText
            }
          >
            • This action cannot
            be undone.
          </Text>

          <Text
            style={
              styles.warningText
            }
          >
            • Your account data
            will be permanently
            removed.
          </Text>

          <Text
            style={
              styles.warningText
            }
          >
            • Account deletion may
            take up to 7 business
            days to process.
          </Text>
        </View>

        {/* REASON INPUT */}
        <View
          style={
            styles.inputContainer
          }
        >
          <Text
            style={
              styles.inputLabel
            }
          >
            Reason for leaving
            (Optional)
          </Text>

          <TextInput
            value={reason}
            onChangeText={
              setReason
            }
            placeholder="Tell us why you want to delete your account..."
            placeholderTextColor="#999"
            multiline
            style={
              styles.textInput
            }
          />
        </View>

        {/* DELETE BUTTON */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={
            styles.deleteBtn
          }
          onPress={
            handleDeleteAccount
          }
          disabled={loading}
        >
          <Icon
            name="trash-outline"
            size={responsiveFont(
              18,
            )}
            color="#fff"
          />

          <Text
            style={
              styles.deleteBtnText
            }
          >
            {loading
              ? "Deleting..."
              : "Delete My Account"}
          </Text>
        </TouchableOpacity>

        {/* CANCEL BUTTON */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={
            styles.cancelBtn
          }
          onPress={() =>
            navigation.goBack()
          }
        >
          <Text
            style={
              styles.cancelBtnText
            }
          >
            Cancel
          </Text>
        </TouchableOpacity>

        <View
          style={{
            height: hp(5),
          }}
        />
      </ScrollView>
    </View>
  );
};

export default DeleteAccountScreen;

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#F5F7F2",
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",

      paddingHorizontal:
        wp(5),

      paddingTop:
        Platform.OS ===
          "ios"
          ? hp(7)
          : hp(6),

      paddingBottom:
        hp(2),
    },

    headerTitle: {
      fontSize:
        responsiveFont(18),

      fontWeight: "700",

      color: "#222",
    },

    scrollContent: {
      paddingHorizontal:
        wp(5),
    },

    iconBox: {
      width: wp(24),
      height: wp(24),

      borderRadius:
        wp(12),

      backgroundColor:
        "#FDECEC",

      justifyContent:
        "center",

      alignItems: "center",

      alignSelf: "center",

      marginTop: hp(3),
    },

    title: {
      fontSize:
        responsiveFont(24),

      fontWeight: "700",

      color: "#111",

      textAlign: "center",

      marginTop: hp(3),

      lineHeight:
        responsiveFont(32),
    },

    description: {
      fontSize:
        responsiveFont(14),

      color: "#666",

      textAlign: "center",

      lineHeight:
        responsiveFont(22),

      marginTop: hp(1.5),

      paddingHorizontal:
        wp(3),
    },

    warningCard: {
      backgroundColor:
        "#FFF7E8",

      borderRadius:
        wp(4),

      padding:
        wp(4),

      marginTop: hp(3),
    },

    warningRow: {
      flexDirection: "row",
      alignItems: "center",

      marginBottom:
        hp(1),
    },

    warningTitle: {
      fontSize:
        responsiveFont(14),

      fontWeight: "700",

      color: "#D68910",

      marginLeft: wp(2),
    },

    warningText: {
      fontSize:
        responsiveFont(13),

      color: "#6E5A1E",

      lineHeight:
        responsiveFont(22),

      marginTop: hp(0.4),
    },

    inputContainer: {
      marginTop: hp(3),
    },

    inputLabel: {
      fontSize:
        responsiveFont(14),

      fontWeight: "600",

      color: "#222",

      marginBottom:
        hp(1),
    },

    textInput: {
      minHeight: hp(14),

      backgroundColor:
        "#fff",

      borderRadius:
        wp(4),

      padding:
        wp(4),

      fontSize:
        responsiveFont(14),

      color: "#222",

      textAlignVertical:
        "top",

      borderWidth: 1,

      borderColor: "#E5E5E5",
    },

    deleteBtn: {
      height: hp(6.5),

      backgroundColor:
        "#E53935",

      borderRadius:
        wp(4),

      justifyContent:
        "center",

      alignItems: "center",

      flexDirection: "row",

      marginTop: hp(4),
    },

    deleteBtnText: {
      color: "#fff",

      fontSize:
        responsiveFont(15),

      fontWeight: "700",

      marginLeft: wp(2),
    },

    cancelBtn: {
      height: hp(6.5),

      borderRadius:
        wp(4),

      justifyContent:
        "center",

      alignItems: "center",

      backgroundColor:
        "#fff",

      marginTop: hp(1.5),

      borderWidth: 1,

      borderColor: "#E5E5E5",
    },

    cancelBtnText: {
      color: "#333",

      fontSize:
        responsiveFont(15),

      fontWeight: "600",
    },
  });