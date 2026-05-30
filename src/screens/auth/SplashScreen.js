import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const ICONS = [
  { icon: "🌱", label: "खेती की जानकारी" },
  { icon: "🌤️", label: "मौसम अपडेट" },
  { icon: "🛒", label: "बाजार भाव" },
  { icon: "📖", label: "किसान ज्ञान" },
];

export default function SplashScreen({  }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 2000 });

    const timer = setTimeout(() => {
      // onFinish(); // control from AppNavigator
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const progressStyle = useAnimatedStyle(() => ({
    width: progress.value * (width * 0.65),
  }));

  return (
    <ImageBackground
      source={require("../../assets/images/splash_bg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      {/* ICON SECTION */}
      {/* <View style={styles.iconContainer}>
        {ICONS.map((item, index) => (
          <View key={index} style={styles.iconItem}>
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </View>
        ))}
      </View> */}

      {/* LOADING */}
      <View style={styles.loaderContainer}>
        <Text style={styles.loadingText}>लोडिंग हो रहा है...</Text>

        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // ICON SECTION
  iconContainer: {
    position: "absolute",
    bottom: 170,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  iconItem: {
    width: 70, // 🔥 fixed width = perfect alignment
    alignItems: "center",
  },

  icon: {
    fontSize: 28,
    marginBottom: 6,
  },

  label: {
    fontSize: 11,
    color: "#2e7d32",
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 14, // 🔥 fixes Hindi wrapping
  },

  // LOADER
  loaderContainer: {
    position: "absolute",
    bottom: '30%',
    width: "100%",
    alignItems: "center",
  },

  loadingText: {
    fontSize: 18,
    color: "#2e7d32",
    marginBottom: 8,
    fontWeight: "700",
  },

  progressBar: {
    width: width * 0.65,
    height: 8,
    backgroundColor: "#ffffffcc",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#2e7d32",
    borderRadius: 10,
  },
});