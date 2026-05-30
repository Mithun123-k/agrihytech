import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const points = [
  "Wear protective gloves and mask during application",
  "Keep away from children and pets",
  "Do not mix with other chemicals unless recommended",
  "Wash hands thoroughly after handling",
];

const SafetySection = () => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/icons/check.png")}
          style={styles.headerIcon}
        />
        <Text style={styles.heading}>Safety & Precautions</Text>
      </View>

      <View style={styles.inner}>
        {points.map((item, index) => (
          <View key={index} style={styles.pointRow}>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.pointText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default SafetySection;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  headerIcon: {
    width: 18,
    height: 18,
    tintColor: "#F04438",
    marginRight: 6,
  },

  heading: {
    fontSize: 18,
    fontWeight: "600",
  },

  inner: {
    backgroundColor: "#F9F9FA",
    padding: 16,
    borderRadius: 14,
  },

  pointRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },

  dot: {
    fontSize: 16,
    color: "#D08A0F",
    marginRight: 8,
    lineHeight: 20,
  },

  pointText: {
    flex: 1,
    fontSize: 14,
    color: "#D08A0F",
    lineHeight: 20,
  },
});