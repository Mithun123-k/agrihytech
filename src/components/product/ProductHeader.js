{/* <Text style={styles.title}>CropGuard Pro Insecticide</Text> */}

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const ProductHeader = ({
  navigation,
  title = "CropGuard Pro Insecticide",
  showShare = false,
  onShare,
  backgroundImage = require("../../assets/images/bg1.png"),
}) => {
  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.header}
      resizeMode="cover"
    >
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text
          style={styles.title}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>

        {showShare ? (
          <TouchableOpacity onPress={onShare}>
            <Icon name="share-social-outline" size={22} color="#000" />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </ImageBackground>
  );
};

export default ProductHeader;

const styles = StyleSheet.create({
  header: {
    height: 120,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "10%",
  },
  title: {
    flex: 1,
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 12,
    color: "#000",
  },
  placeholder: {
    width: 22, // same width as share icon to keep title centered
  },
});