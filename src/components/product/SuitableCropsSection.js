import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const crops = [
  { name: "Wheat", icon: require("../../assets/icons/wheat.png") },
  { name: "Vegetables", icon: require("../../assets/icons/veg.png") },
  { name: "Rice", icon: require("../../assets/icons/rice.png") },
  { name: "Fruits", icon: require("../../assets/icons/fruit.png") },
];

const SuitableCropsSection = ({ data }) => {
  const prodCrops = data?.product?.suitableCrops;

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Suitable for Crops</Text>

      <View style={styles.wrap}>
        {prodCrops.map((item, index) => (
          <View key={index} style={styles.chip}>
            {/* <Image source={item.icon} style={styles.icon} /> */}
            <Text style={styles.chipText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default SuitableCropsSection;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 22,
    padding: 20,
    marginBottom: 20,
  },

  heading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 18,
    color: "#222",
  },

  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#D08A0F",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 28,
    marginRight: 14,
    marginBottom: 14,
    backgroundColor: "transparent",
  },

  icon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
    marginRight: 8,
    tintColor: "#D08A0F", // remove if your icons already orange
  },

  chipText: {
    color: "#D08A0F",
    fontWeight: "500",
    fontSize: 12,
  },
});