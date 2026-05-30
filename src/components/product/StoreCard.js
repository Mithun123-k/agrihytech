import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Octicons from "react-native-vector-icons/Octicons";

const AvailableStoresSection = ( {data , role}) => {
  
console.log("shops", data?.productOwner?.mobile)

const handleCall = async (phoneNumber) => {

  if (!phoneNumber) return;

  const phoneUrl = `tel:${phoneNumber}`;

  const supported =
    await Linking.canOpenURL(phoneUrl);

  if (supported) {
    await Linking.openURL(phoneUrl);
  }
};

  const stores = {
    B2C: [
      { firmName: "Green Agro Store", distanceInKm: "2.5", mobile:'9934435748' },
      { firmName: "Krishi Seva Kendra", distanceInKm: "3.8" , mobile:'9934435748'},
      { firmName: "Farmers Choice Center", distanceInKm: "3.5", mobile:'9934435748'  },
    ],
    B2B: [{ firmName: "Green Agro Store", distanceInKm: "2.5", mobile:'9934435748' }],
  };

  const storeList = useMemo(() => {

  if (role === "B2C") {
    return data?.nearestShops || [];
  }

  
  return [data?.productOwner] || [];

}, [role, data]);

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Available Near You</Text>

      {storeList.map((store, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.topRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.storeName}>{store.firmName}</Text>

              <View style={styles.locationRow}>
                <Octicons name="location" size={13} color="#4E7D1F" />
                <Text style={styles.distance}><Text style={{color: "#4E7D1F",fontSize: 12,fontWeight: "700",}}>{store?.distanceInKm}</Text>{` km away`}</Text>
              </View>
            </View>

            <View style={styles.stockBadge}>
              <Text style={styles.stockText}>In Stock</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.callButton} onPress={() => handleCall(store?.mobile)} >
            <Icon name="phone-call" size={13} color="#4E7D1F" />
            <Text style={styles.callText}> Call Now</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default React.memo(AvailableStoresSection);

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 10,
    borderRadius: 26,
    marginHorizontal: 16,
    marginBottom: 20,
  },

  heading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 18,
    color: "#272727",
  },

  card: {
    backgroundColor: "#F9F9FA",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  storeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#272727",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  distance: {
    fontSize: 12,
    fontWeight: "400",
    color: "#7A7A7A",
    marginLeft: 4,
  },

  stockBadge: {
    backgroundColor: "#E3EADF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: "flex-start",
  },

  stockText: {
    color: "#4E7D1F",
    fontSize: 12,
    fontWeight: "500",
  },

  callButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EDF2E9",
    borderWidth: 1.5,
    borderColor: "#4C7A1E",
    paddingVertical: 8,
    borderRadius: 10,
  },

  callText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4E7D1F",
    marginLeft: 8,
  },
});