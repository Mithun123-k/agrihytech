import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Platform,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useDispatch, useSelector } from "react-redux";
import { getAllBrands } from "../../features/brands/brandSlice";

const { width, height } = Dimensions.get("window");

// ✅ Responsive Layout
const HORIZONTAL_PADDING = 20;
const CARD_SPACING = 14;

const CARD_WIDTH =
  (width - HORIZONTAL_PADDING * 2 - CARD_SPACING) / 2;

const cropFilters = [
  {
    id: "1",
    name: "Wheat",
    icon: require("../../assets/icons/wheat.png"),
  },
  {
    id: "2",
    name: "Rice",
    icon: require("../../assets/icons/rice.png"),
  },
  {
    id: "3",
    name: "Fruits",
    icon: require("../../assets/icons/fruit.png"),
  },
  {
    id: "4",
    name: "Vegetables",
    icon: require("../../assets/icons/veg.png"),
  },
];

const BrandListing = ({ navigation }) => {
  const dispatch = useDispatch();

  const { brands, loading } = useSelector(
    (state) => state.brand
  );

  const [selectedCrop, setSelectedCrop] =
    useState("Wheat");

  const [searchText, setSearchText] = useState("");

  // ✅ Filter
  const filteredCategories = brands.filter((item) =>
    item.name
      ?.toLowerCase()
      .includes(searchText.toLowerCase())
  );

  // ✅ Render Card
  const renderCategory = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={() =>
        navigation.navigate("product", {
          brandId: item._id,
          brandName: item.name,
          brandImage: item.image,
        })
      }
    >
      {/* Image Section */}
      <View style={styles.imageWrapper}>
        <Image
          source={{
            uri: item.image
              ? item.image
              : "https://via.placeholder.com/150",
          }}
          style={styles.cardImage}
          resizeMode="contain"
        />
      </View>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <Text
          style={styles.cardTitle}
          numberOfLines={2}
        >
          {item.name}
        </Text>

        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {item.productCount || 0} Products
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // ✅ API Call
  useEffect(() => {
    dispatch(getAllBrands({ page: 1, search: "" }));
    console.log("Fetching brands...");
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* HEADER */}
      <ImageBackground
        source={require("../../assets/images/bg1.png")}
        style={styles.headerBg}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <SafeAreaView edges={["top"]}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon
                name="arrow-back"
                size={22}
                color="#111"
              />
            </TouchableOpacity>

            <Text
              style={styles.headerTitle}
              numberOfLines={1}
            >
              Choose a Brand
            </Text>

            <View style={{ width: 40 }} />
          </View>

          {/* Search Bar */}
          <View style={styles.searchBar}>
            <Icon
              name="search"
              size={18}
              color="#888"
            />

            <TextInput
              placeholder="Search brand"
              placeholderTextColor="#888"
              style={styles.input}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </SafeAreaView>
      </ImageBackground>

      {/* TITLE */}
      <View style={styles.titleContainer}>
        <Text style={styles.sectionTitle}>
          Product Brand
        </Text>
      </View>

      {/* LOADER */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            size="large"
            color="#4C7A1E"
          />
        </View>
      ) : (
        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item._id}
          numColumns={2}
          renderItem={renderCategory}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.listContainer
          }
          columnWrapperStyle={
            styles.columnWrapper
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No Brands Found
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default BrandListing;

const styles = StyleSheet.create({
  // ================= MAIN =================

  container: {
    flex: 1,
    backgroundColor: "#EDF2E9",
  },

  // ================= HEADER =================

  headerBg: {
    height: Platform.OS === "ios" ? 150 : 140,
    justifyContent: "center",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 5,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: width < 360 ? 17 : 20,
    fontWeight: "700",
    color: "#222",
    paddingHorizontal: 10,
  },

  // ================= SEARCH =================

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 18,
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 50,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  input: {
    marginLeft: 10,
    flex: 1,
    fontSize: 15,
    color: "#111",
    paddingVertical: 0,
  },

  // ================= TITLE =================

  titleContainer: {
    paddingHorizontal: 20,
    marginTop: 18,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: width < 360 ? 16 : 18,
    fontWeight: "700",
    color: "#222",
  },

  // ================= LIST =================

  listContainer: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingBottom: 30,
  },

  columnWrapper: {
    justifyContent: "space-between",
  },

  // ================= CARD =================

  card: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    marginBottom: 18,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },

  // ✅ Perfect Responsive Image
  imageWrapper: {
    width: "100%",
    height: width < 360 ? 130 : 150,
    backgroundColor: "#F7F7F7",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },

  cardImage: {
    width: "100%",
    height: "100%",
  },

  // ================= FOOTER =================

  cardFooter: {
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 16,
    alignItems: "center",
  },

  cardTitle: {
    fontSize: width < 360 ? 13 : 15,
    fontWeight: "600",
    color: "#222",
    textAlign: "center",
    minHeight: 40,
    marginBottom: 10,
  },

  countBadge: {
    backgroundColor: "#F6E7C8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
  },

  countText: {
    color: "#B57900",
    fontWeight: "700",
    fontSize: 11,
  },

  // ================= LOADER =================

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // ================= EMPTY =================

  emptyContainer: {
    marginTop: height * 0.15,
    alignItems: "center",
  },

  emptyText: {
    fontSize: 15,
    color: "#777",
    fontWeight: "500",
  },

  // ================= EXTRA =================

  chip: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  activeChip: {
    backgroundColor: "#4c8c2b",
  },

  chipText: {
    color: "#333",
    fontWeight: "400",
    fontSize: 14,
  },

  activeChipText: {
    color: "#fff",
  },

  sell: {
    borderWidth: 1,
    borderColor: "#4C7A1E",
    backgroundColor: "#4C7A1E",
    width: "50%",
    padding: "5%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },

  sellText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },

  buy: {
    borderWidth: 1,
    borderColor: "#4C7A1E",
    backgroundColor: "#EDF2E9",
    width: "50%",
    padding: "5%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },

  buyText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4C7A1E",
  },
});