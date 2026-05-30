import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const benefits = [
  "Controls aphids, whiteflies and thrips effectively.",
  "Improves overall crop health and vigor.",
  "Increases yield by up to 25%",
  "Quick knockdown action within 24 hours",
];

const BenefitsSection = ({data}) => {
  const prodBenefits = data?.product?.keyBenefits;

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Key Benefits</Text>

      {prodBenefits?.map((item, index) => (
        <View key={index} style={styles.row}>
          <Icon name="checkmark-circle-outline" size={20} color="#4C8C2B" />
          <Text style={styles.text}>{item}</Text>
        </View>
      ))}
    </View>
  );
};

export default BenefitsSection;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  text: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "400",
    color: "#7F7F7F",
    flex: 1,
  },
}); 