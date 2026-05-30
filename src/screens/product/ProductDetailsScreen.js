import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, StatusBar, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductHeader from "../../components/product/ProductHeader";
import ProductInfoCard from "../../components/product/ProductInfoCard";
import UsageSection from "../../components/product/UsageSection";
import BenefitsSection from "../../components/product/BenefitsSection.js";
import SuitableCropsSection from "../../components/product/SuitableCropsSection.js";
import SpecificationSection from "../../components/product/SpecificationSection.js";
import SafetySection from "../../components/product/SafetySection.js";
import StoreCard from "../../components/product/StoreCard.js";
import Icon from "react-native-vector-icons/Feather";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "../../features/product/productSlice.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProductDetailsScreen = ({ navigation, route }) => {
  const productId = route?.params?.productId;
  const dispatch = useDispatch();
  const { productDetails, loading } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });

  const getSavedLocation = async () => {
    try {

      const savedLocation =
        await AsyncStorage.getItem("USER_LOCATION");

      if (savedLocation) {

        const parsedLocation =
          JSON.parse(savedLocation);

        setLocation({
          latitude: parsedLocation?.latitude,
          longitude: parsedLocation?.longitude,
        });

      }

    } catch (error) {
      console.log("LOCATION FETCH ERROR:", error);
    }
  };


  console.log("========>",productDetails)

  useEffect(() => {
    getSavedLocation();
  }, []);


  useEffect(() => {

    if (
      productId &&
      location?.latitude !== null &&
      location?.longitude !== null
    ) {

      dispatch(
        getProductById({
          productId,
          role: user?.role,
          lat: location.latitude,
          lng: location.longitude,
        })
      );

    }

  }, [productId, location]);

  if (loading || !productDetails) {
    return <Text style={{ textAlign: "center", marginTop: 50 }}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <ProductHeader navigation={navigation} />

      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListHeaderComponent={
          <>
            {/* <SafeAreaView> */}
            {/* </SafeAreaView> */}

            <ProductInfoCard data={productDetails} />
            {
              user?.role !== "B2B" && <>
                <UsageSection data={productDetails} />
                <BenefitsSection data={productDetails} />
                <SuitableCropsSection data={productDetails} />
                <SpecificationSection data={productDetails} />
                <SafetySection data={productDetails} />
              </>
            }


            <StoreCard data={productDetails} role={user?.role} />

          </>
        }
      />

      {/* Bottom Fixed Button */}
      <View style={styles.bottomBar}>
        <View style={styles.connectBtn}>
          <Icon name="phone-call" size={18} color="#FFFFFF" />
          <Text style={styles.callText}>Connect to Nearest Seller</Text>
        </View>
      </View>
    </View>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9EFE3",
  },
  bottomBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  connectBtn: {
    backgroundColor: "#4C8C2B",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  callText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
  }
});