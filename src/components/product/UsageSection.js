import AppText from '../common/AppText';
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const StepItem = ({ number, title, subtitle }) => (
  <View style={styles.stepRow}>
    <View style={styles.circle}>
      <AppText style={styles.circleText}>{number}</AppText>
    </View>
    <View style={{ flex: 1 }}>
      <AppText style={styles.stepTitle}>{title}</AppText>
      <AppText style={styles.stepSubtitle}>{subtitle}</AppText>
    </View>
  </View>
);

const UsageSection = ({ data }) => {
  const prodUsedata = data?.product?.usageSteps

  return (
    <View style={styles.card}>
      <AppText style={styles.heading}>Usage & Dosage</AppText>

      {prodUsedata?.map((step, index) => (
        <StepItem
          key={index}
          number={index + 1}
          title={step.heading}
          subtitle={step.description}
        />
      ))}

      {/* Dosage per Acre Box */}
      <View style={styles.dosageBox}>
        <AppText style={styles.boxLabel}>Dosage per Acre</AppText>
        <AppText style={styles.dosageText}>500–750 ml per acre</AppText>
      </View>

      {/* Application Time Box */}
      <View style={styles.applicationBox}>
        <AppText style={styles.boxLabel}>Application Time</AppText>
        <AppText style={styles.applicationText}>
          Apply when pest infestation begins
        </AppText>
      </View>
    </View>
  );
};

export default UsageSection;

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
    marginBottom: 20,
    color: "#222",
  },

  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },

  circle: {
    width: 36,
    height: 36,
    borderRadius: 22,
    backgroundColor: "#E2E8DE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  circleText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4C7C2D",
  },

  stepTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#222",
  },

  stepSubtitle: {
    fontSize: 12,
    color: "#6E6E6E",
    marginTop: 3,
    fontWeight: "400",
  },

  dosageBox: {
    backgroundColor: "#FAF3E7",
    padding: 16,
    borderRadius: 14,
    marginTop: '3%',
  },

  boxLabel: {
    fontSize: 12,
    fontWeight: "400",
    color: "#7F7F7F",
    marginBottom: 6,
  },

  dosageText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#D08A0F",
  },

  applicationBox: {
    backgroundColor: "#D9E2F2",
    padding: 16,
    borderRadius: 14,
    marginTop: '3%',
  },

  applicationText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1363FF",
  },
});