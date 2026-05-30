import React from "react";
import { View, Text, StyleSheet } from "react-native";



const SpecificationSection = ({ data }) => {
  const prodSpecs = data?.product?.specifications;

  const specs = [
  { label: "Active Ingredient", value: prodSpecs?.activeIngredient || "" },
  { label: "Target Pests", value: prodSpecs?.targetPests || "" },
  { label: "Safety Period", value: prodSpecs?.safetyPeriod || "" },
  { label: "Pack Size", value: prodSpecs?.packSize || "" },
  { label: "Storage", value: prodSpecs?.storage || "" },
];

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Specifications</Text>

      {specs?.map((item, index) => (
        <View key={index} style={styles.item}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.value}>{item.value}</Text>
          {index !== specs.length - 1 && <View style={styles.divider} />}
        </View>
      ))}
    </View>
  );
};

export default SpecificationSection;

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
    marginBottom: 15,
  },
  item: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: "400",
    color: "#7F7F7F",
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 3,
    color: "#272727",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginTop: 10,
  },
});