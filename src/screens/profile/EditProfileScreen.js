import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    StatusBar,
    ImageBackground,
    ScrollView,
    ActivityIndicator,
    Dimensions,
    Platform,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { Formik } from "formik";
import { launchImageLibrary } from "react-native-image-picker";
import FormikInput from "../../components/auth/FormikInput";
import { responsiveFont, scale } from "../../utils/responsive";
import { useDispatch } from "react-redux";
import { updateProfile } from "../../features/auth/authSlice";

const { width, height } = Dimensions.get("window");

const isSmallDevice = width < 360;
const isTablet = width >= 768;

const EditProfileScreen = ({ navigation }) => {
    const dispatch = useDispatch();

    const { user, loading } = useSelector((state) => state.auth);

    const [selectedImage, setSelectedImage] = useState(null);

    const initialValues = {
        firmName: user?.firmName || "",
        proprietorName: user?.proprietorName || "",
        mobile: user?.mobile || "",
        state: user?.location?.state || "",
        district: user?.location?.district || "",
        village: user?.location?.village || "",
        pincode: user?.location?.pincode || "",
        lat: user?.location?.lat?.toString() || "",
        lng: user?.location?.lng?.toString() || ""
    };

    const pickImage = async () => {
        const result = await launchImageLibrary({
            mediaType: "photo",
            quality: 0.8
        });

        if (!result.didCancel && result.assets?.length > 0) {
            setSelectedImage(result.assets[0]);
        }
    };

    const handleUpdate = async (values) => {

        const formData = new FormData();

        formData.append("firmName", values.firmName);
        formData.append("proprietorName", values.proprietorName);

        formData.append(
            "location",
            JSON.stringify({
                state: values.state,
                district: values.district,
                village: values.village,
                pincode: values.pincode,
                lat: Number(values.lat),
                lng: Number(values.lng)
            })
        );

        if (selectedImage) {
            formData.append("profileimage", {
                uri: selectedImage.uri,
                type: selectedImage.type,
                name: selectedImage.fileName || "profile.jpg"
            });
        }

        dispatch(updateProfile(formData));

        navigation.goBack();
    };

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={handleUpdate}
        >
            {({ handleSubmit }) => (
                <View style={styles.container}>
                    <StatusBar
                        barStyle="dark-content"
                        backgroundColor="transparent"
                        translucent
                    />

                    <ImageBackground
                        source={require("../../assets/images/bg1.png")}
                        style={styles.bg}
                        resizeMode="cover"
                    />

                    {/* HEADER */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Icon
                                name="arrow-back"
                                size={responsiveFont(22)}
                                color="#222"
                            />
                        </TouchableOpacity>

                        <Text style={styles.title}>
                            Edit Profile
                        </Text>

                        <View style={{ width: responsiveFont(22) }} />
                    </View>

                    {/* CONTENT */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContainer}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.card}>

                            {/* AVATAR */}
                            <View style={styles.avatarContainer}>
                                <Image
                                    source={
                                        selectedImage
                                            ? { uri: selectedImage.uri }
                                            : user?.profileimage
                                                ? { uri: user.profileimage }
                                                : {
                                                    uri: "https://i.pravatar.cc/300"
                                                }
                                    }
                                    style={styles.avatar}
                                />

                                <TouchableOpacity
                                    style={styles.cameraBtn}
                                    onPress={pickImage}
                                >
                                    <Icon
                                        name="camera"
                                        size={responsiveFont(14)}
                                        color="#fff"
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* FIRM */}
                            {user?.role !== "B2C" && (
                                <>
                                    <Text style={styles.label}>
                                        Firm Name
                                    </Text>

                                    <FormikInput
                                        name="firmName"
                                        placeholder="Firm Name"
                                    />
                                </>
                            )}

                            {/* NAME */}
                            <Text style={styles.label}>
                               {user?.role !== "B2C" ?  "Proprietor Name" : 'Farmer name' }
                            </Text>

                            <FormikInput
                                name="proprietorName"
                                placeholder={user?.role !== "B2C" ?  "Proprietor Name" : 'Farmer name' }
                            />

                            {/* MOBILE */}
                            <Text style={styles.label}>
                                Mobile
                            </Text>

                            <View style={styles.disabledInput}>
                                <Text style={styles.disabledText}>
                                    {user?.mobile || "Not Available"}
                                </Text>
                            </View>

                            {/* LOCATION */}
                            <View style={styles.locationBox}>

                                <Text style={styles.locationTitle}>
                                    📍 Location
                                </Text>

                                {/* ROW 1 */}
                                <View style={styles.row}>

                                    <View style={styles.inputWrapper}>
                                        <FormikInput
                                            name="state"
                                            placeholder="State"
                                        />
                                    </View>

                                    <View style={styles.inputWrapper}>
                                        <FormikInput
                                            name="district"
                                            placeholder="District"
                                        />
                                    </View>

                                </View>

                                {/* ROW 2 */}
                                <View style={styles.row}>

                                    <View style={styles.inputWrapper}>
                                        <FormikInput
                                            name="village"
                                            placeholder="City/Village"
                                        />
                                    </View>

                                    <View style={styles.inputWrapper}>
                                        <FormikInput
                                            name="pincode"
                                            placeholder="Pincode"
                                            keyboardType="number-pad"
                                        />
                                    </View>

                                </View>

                            </View>
                        </View>

                        {/* EXTRA SPACE FOR SMALL DEVICES */}
                        <View style={{ height: isSmallDevice ? 120 : 80 }} />
                    </ScrollView>

                    {/* UPDATE BUTTON */}
                    <View style={styles.bottomContainer}>
                        <TouchableOpacity
                            style={styles.updateBtn}
                            onPress={handleSubmit}
                            activeOpacity={0.8}
                        >
                            {loading ? (
                                <ActivityIndicator
                                    size="small"
                                    color="#fff"
                                />
                            ) : (
                                <Text style={styles.updateText}>
                                    Update Profile
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </Formik>
    );
};

export default EditProfileScreen;

const AVATAR_SIZE = isTablet
    ? width * 0.16
    : width * 0.28;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EDF2E9",
    },

    bg: {
        position: "absolute",
        width: "100%",
        height: height * 0.30,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: width * 0.05,
        marginTop:
            Platform.OS === "ios"
                ? height * 0.07
                : height * 0.06,
    },

    title: {
        fontSize: responsiveFont(isTablet ? 22 : 20),
        fontWeight: "700",
        color: "#333",
    },

    scrollContainer: {
        paddingBottom: 30,
    },

    card: {
        marginTop: height * 0.14,
        backgroundColor: "#fff",
        borderRadius: scale(22),
        paddingTop: AVATAR_SIZE * 0.65,
        paddingHorizontal: width * 0.055,
        paddingBottom: scale(28),
        marginHorizontal: width * 0.05,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 3,
        },
    },

    avatarContainer: {
        position: "absolute",
        top: -(AVATAR_SIZE / 2),
        alignSelf: "center",
    },

    avatar: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        borderWidth: 5,
        borderColor: "#fff",
    },

    cameraBtn: {
        position: "absolute",
        bottom: 4,
        right: 2,
        backgroundColor: "#4C7A1E",
        width: scale(isTablet ? 38 : 32),
        height: scale(isTablet ? 38 : 32),
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
    },

    label: {
        fontSize: responsiveFont(isTablet ? 16 : 14),
        color: "#555",
        marginTop: scale(14),
        marginBottom: scale(6),
        fontWeight: "600",
    },

    disabledInput: {
        backgroundColor: "#F1F1F1",
        borderRadius: scale(14),
        paddingHorizontal: scale(16),
        paddingVertical: scale(16),
        borderWidth: 1,
        borderColor: "#E4E4E4",
        opacity: 0.85,
    },

    disabledText: {
        fontSize: responsiveFont(14),
        color: "#666",
    },

    locationBox: {
        backgroundColor: "#F9F9FA",
        padding: scale(12),
        borderRadius: scale(14),
        marginTop: scale(20),
    },

    locationTitle: {
        fontSize: responsiveFont(15),
        marginBottom: scale(10),
        fontWeight: "700",
        color: "#222",
    },

    row: {
        flexDirection: width < 350 ? "column" : "row",
        justifyContent: "space-between",
    },

    inputWrapper: {
        flex: 1,
        marginRight: width < 350 ? 0 : scale(10),
        marginBottom: width < 350 ? scale(10) : 0,
    },

    bottomContainer: {
        paddingHorizontal: width * 0.05,
        paddingBottom:
            Platform.OS === "ios"
                ? scale(24)
                : scale(18),
        paddingTop: scale(10),
        backgroundColor: "#EDF2E9",
    },

    updateBtn: {
        backgroundColor: "#4C7A1E",
        paddingVertical: scale(isTablet ? 18 : 16),
        borderRadius: scale(18),
        alignItems: "center",
        justifyContent: "center",
        elevation: 3,
    },

    updateText: {
        color: "#fff",
        fontSize: responsiveFont(isTablet ? 18 : 16),
        fontWeight: "700",
    },
});