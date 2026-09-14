import AppText from '../common/AppText';
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const ProductInfoCard = ({ data }) => {
  const proddata = data?.product
  console.log("data", data)
  return (
    <View style={styles.card}>
      <Image
        source={
          proddata?.images[0]?.url
            ? { uri: proddata.images[0]?.url }
            : require("../../assets/images/prod1.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.tagRow}>
        <AppText style={styles.category}>Insecticide</AppText>
        <View style={styles.govtContainer}>
          <Image
            source={require("../../assets/icons/check.png")}
            style={styles.govtIcon}
          />
          <AppText style={styles.govt}>Govt Approved</AppText>
        </View>
      </View>

      <AppText style={styles.name}>{proddata?.name}</AppText>

      <AppText style={styles.desc}>
        {proddata?.description}
      </AppText>

      {/* <View style={styles.cropsRow}>
        <View style={styles.cropItem}>
          <Image
            source={require("../../assets/icons/wheat.png")}
            style={styles.cropIcon}
          // tintColor={"red"}
          />
          <AppText style={styles.crop}>Wheat</AppText>
        </View>

        <View style={styles.cropItem}>
          <Image
            source={require("../../assets/icons/veg.png")}
            style={styles.cropIcon}
          />
          <AppText style={styles.crop}>Vegetables</AppText>
        </View>
      </View> */}

      <View style={{ marginTop: 10 }}>
        <AppText style={{ fontSize: 14, color: "#1363FF", marginRight: 20, fontWeight: "500", }}>
          Price Range: -  ₹{proddata?.price || "N/A"}
        </AppText>
        <AppText style={{ fontSize: 14, color: "#272727", marginTop:8 }}>
          <AppText style={{ fontWeight: "500" , color: "#7F7F7F"}}> </AppText>Qty: {proddata?.quantity || ""} {proddata?.unit || ""}
        </AppText>
      </View>

    </View>
  );
};

export default ProductInfoCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    margin: 20,
    borderRadius: 20,
    padding: 20,
    marginTop: 0
  },
  image: {
    width: "100%",
    height: 180,
    alignSelf: "center",
  },
  tagRow: {
    flexDirection: "row",
    marginVertical: 10,
    marginTop: '6%'
  },
  category: {
    backgroundColor: "#FAF3E7",
    padding: 6,
    borderRadius: 8,
    marginRight: 10,
    fontSize: 12,
    fontWeight: "500",
    color: "#D08A0F",
  },
  govtContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 5,
    // paddingVertical: 6,
    borderRadius: 8,
  },
  govtIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  govt: {
    backgroundColor: "#E7EFFF",
    padding: 6,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: "500",
    color: "#1363FF",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 6,
  },
  desc: {
    color: "#7F7F7F",
    fontSize: 12,
    fontWeight: "400",
    textAlign: 'justify',
    letterSpacing: -0.3,
  },
  cropsRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  crop: {
    fontSize: 12,
    fontWeight: "500",
    color: "#4C8C2B",
  },
  cropIcon: {
    width: 11,
    height: 11,
    marginRight: 6,
    tintColor: "#4C8C2B",
  },
  cropItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4C8C2B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },

});