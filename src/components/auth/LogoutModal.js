import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Platform,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

const isSmallDevice = width < 360;
const isTablet = width >= 768;

const scale = (size) => (width / 375) * size;

const responsiveFont = (size) => {
    const newSize = scale(size);

    if (isTablet) {
        return Math.round(newSize * 1.1);
    }

    return Math.round(newSize);
};

const LogoutModal = ({
    visible,
    onCancel,
    onLogout
}) => {
    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
        >
            <View style={styles.overlay}>

                <View style={styles.modalContainer}>

                    {/* ICON */}
                    <View style={styles.iconWrapper}>
                        <Icon
                            name="log-out-outline"
                            size={responsiveFont(
                                isTablet ? 42 : 36
                            )}
                            color="#4C7F1E"
                        />
                    </View>

                    {/* TITLE */}
                    <Text style={styles.title}>
                        Are you sure you want to{"\n"}log out?
                    </Text>

                    {/* BUTTONS */}
                    <View style={styles.buttonRow}>

                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={onCancel}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.cancelText}>
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.logoutBtn}
                            onPress={onLogout}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.logoutText}>
                                Log Out
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>

            </View>
        </Modal>
    );
};

export default LogoutModal;

const styles = StyleSheet.create({

    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: width * 0.05,
    },

    modalContainer: {
        width: isTablet ? "65%" : "100%",
        maxWidth: 500,
        backgroundColor: "#F4F4F4",
        borderRadius: scale(isTablet ? 36 : 28),
        paddingVertical: scale(isTablet ? 38 : 30),
        paddingHorizontal: scale(isTablet ? 30 : 22),
        alignItems: "center",

        elevation: 8,

        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 4,
        },
    },

    iconWrapper: {
        width: scale(isTablet ? 90 : 74),
        height: scale(isTablet ? 90 : 74),
        borderRadius: 100,
        backgroundColor: "#E2E6DD",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: scale(18),
    },

    title: {
        fontSize: responsiveFont(
            isTablet ? 22 : 18
        ),
        fontWeight: "700",
        textAlign: "center",
        color: "#333",
        marginBottom: scale(26),
        lineHeight: responsiveFont(
            isTablet ? 32 : 26
        ),
        paddingHorizontal: scale(6),
    },

    buttonRow: {
        flexDirection: isSmallDevice
            ? "column"
            : "row",

        justifyContent: "space-between",
        width: "100%",
    },

    cancelBtn: {
        flex: isSmallDevice ? 0 : 1,

        borderWidth: 1.5,
        borderColor: "#D3D3D3",

        paddingVertical: scale(
            isTablet ? 16 : 14
        ),

        borderRadius: scale(18),

        alignItems: "center",
        justifyContent: "center",

        marginRight: isSmallDevice ? 0 : 8,
        marginBottom: isSmallDevice ? 12 : 0,

        backgroundColor: "#FFFFFF",
    },

    cancelText: {
        fontSize: responsiveFont(15),
        color: "#777",
        fontWeight: "600",
    },

    logoutBtn: {
        flex: isSmallDevice ? 0 : 1,

        backgroundColor: "#4C7F1E",

        paddingVertical: scale(
            isTablet ? 16 : 14
        ),

        borderRadius: scale(18),

        alignItems: "center",
        justifyContent: "center",

        marginLeft: isSmallDevice ? 0 : 8,
    },

    logoutText: {
        fontSize: responsiveFont(15),
        color: "#fff",
        fontWeight: "700",
    },

});