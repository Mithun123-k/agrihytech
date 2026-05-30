import React, { useEffect, useState } from "react";
import {
  View,
  Text,
 StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  ActivityIndicator,
  Image,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import {
  searchItems,
  removeRecentSearch,
  clearRecentSearches,
} from "../../features/search/searchSlice";

const { width, height } = Dimensions.get("window");

// ✅ RESPONSIVE HELPERS
const isSmallDevice = width < 360;
const isTablet = width >= 768;

const HORIZONTAL_PADDING = isTablet ? 28 : 16;
const CARD_GAP = isTablet ? 20 : 14;

const CARD_WIDTH =
  (width - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

const SearchScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const { recentSearches, loading, results } = useSelector(
    (state) => state.search
  );

  const { user } = useSelector((state) => state.auth);

  const role = user?.role;

  const [search, setSearch] = useState("");

  // ✅ SAFE IMAGE SOURCE
  const getImageSource = (image, fallback) => {
    if (typeof image === "string" && image.trim() !== "") {
      return { uri: image };
    }

    return fallback;
  };

  // ✅ HANDLE SEARCH
  const handleSearch = () => {
    if (!search.trim()) return;

    dispatch(searchItems(search));
  };

  // ✅ REMOVE SEARCH
  const handleRemove = (item) => {
    dispatch(removeRecentSearch(item));
  };

  // ✅ AUTO SEARCH
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim()) {
        dispatch(searchItems(search));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // ✅ RENDER CARD
  const renderCard = (
    item,
    fallbackImage,
    onPress
  ) => (
    <TouchableOpacity
      key={item._id}
      activeOpacity={0.88}
      style={styles.gridCard}
      onPress={onPress}
    >
      {/* IMAGE */}
      <View style={styles.imageWrapper}>
        <Image
          source={getImageSource(
            item?.image || item?.images?.[0],
            fallbackImage
          )}
          style={styles.gridImage}
          resizeMode="contain"
        />
      </View>

      {/* TITLE */}
      <Text style={styles.gridName} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* ================= HEADER ================= */}

      <ImageBackground
        source={require("../../assets/images/bg1.png")}
        style={styles.imageBg}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <SafeAreaView edges={["top"]}>
          <View style={styles.header}>
            {/* BACK */}
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

            {/* SEARCH BAR */}
            <View style={styles.searchBar}>
              <Icon
                name="search"
                size={18}
                color="#999"
              />

              <TextInput
                placeholder="Search for Product, Brand..."
                placeholderTextColor="#999"
                style={styles.input}
                value={search}
                onChangeText={setSearch}
                returnKeyType="search"
                onSubmitEditing={handleSearch}
              />

              {loading && (
                <ActivityIndicator
                  size="small"
                  color="#4c8c2b"
                />
              )}
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>

      {/* ================= BODY ================= */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* ================= RECENT SEARCH ================= */}

        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.title}>
              Recent Search
            </Text>

            {recentSearches?.length > 0 && (
              <TouchableOpacity
                onPress={() =>
                  dispatch(clearRecentSearches())
                }
              >
                <Text style={styles.clearText}>
                  Clear
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.chipsContainer}>
            {recentSearches?.map((item, index) => (
              <View key={index} style={styles.chip}>
                <TouchableOpacity
                  onPress={() => handleRemove(item)}
                >
                  <Icon
                    name="close"
                    size={14}
                    color="#777"
                  />
                </TouchableOpacity>

                <Text style={styles.chipText}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ================= RESULTS ================= */}

        {search.trim() && (
          <View style={styles.resultsContainer}>
            {/* PRODUCTS */}
            {results?.data?.products?.length >
              0 && (
              <>
                <Text style={styles.sectionTitle}>
                  Products
                </Text>

                <View style={styles.grid}>
                  {results.data.products.map(
                    (item) =>
                      renderCard(
                        item,
                        require("../../assets/images/brand.png"),
                        () =>
                          navigation.navigate(
                            "ProductDetailsScreen",
                            {
                              productId: item._id,
                            }
                          )
                      )
                  )}
                </View>
              </>
            )}

            {/* BRANDS */}
            {results?.data?.brands?.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>
                  Brands
                </Text>

                <View style={styles.grid}>
                  {results.data.brands.map((item) =>
                    renderCard(
                      item,
                      require("../../assets/images/brand.png"),
                      () =>
                        navigation.navigate(
                          "product",
                          {
                            brandId: item._id,
                          }
                        )
                    )
                  )}
                </View>
              </>
            )}

            {/* CATEGORIES */}
            {results?.data?.categories?.length >
              0 && (
              <>
                <Text style={styles.sectionTitle}>
                  Categories
                </Text>

                <View style={styles.grid}>
                  {results.data.categories.map(
                    (item) =>
                      renderCard(
                        item,
                        require("../../assets/images/cat.png"),
                        () =>
                          role === "B2C"
                            ? navigation.navigate(
                                "UserProduct",
                                {
                                  categoryId:
                                    item._id,
                                  categoryName:
                                    item.name,
                                  categoryImage:
                                    item.image,
                                }
                              )
                            : navigation.navigate(
                                "BrandScreen",
                                {
                                  categoryId:
                                    item._id,
                                }
                              )
                      )
                  )}
                </View>
              </>
            )}

            {/* NO RESULT */}
            {!loading &&
              !results?.data?.products?.length &&
              !results?.data?.brands?.length &&
              !results?.data?.categories
                ?.length && (
                <Text style={styles.noResult}>
                  No results found
                </Text>
              )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  // ================= MAIN =================

  container: {
    flex: 1,
    backgroundColor: "#EDF2E9",
  },

  scrollContainer: {
    paddingBottom: 120,
  },

  // ================= HEADER =================

  imageBg: {
    height: Platform.OS === "ios" ? 145 : 130,
    width: "100%",
    justifyContent: "center",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: HORIZONTAL_PADDING,
    marginTop: Platform.OS === "ios" ? 8 : 10,
  },

  backButton: {
    width: isTablet ? 50 : 42,
    height: isTablet ? 50 : 42,
    justifyContent: "center",
    alignItems: "center",
  },

  // ================= SEARCH =================

  searchBar: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#fff",

    flex: 1,
    marginLeft: 10,

    borderRadius: isTablet ? 22 : 16,

    paddingHorizontal: isTablet ? 18 : 14,

    height: isTablet ? 60 : 50,

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
    marginLeft: 8,
    flex: 1,

    fontSize: isTablet
      ? 18
      : isSmallDevice
      ? 14
      : 15,

    color: "#333",

    paddingVertical: 0,
  },

  // ================= SECTION =================

  section: {
    marginTop: 20,
    paddingHorizontal: HORIZONTAL_PADDING,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: isTablet
      ? 24
      : isSmallDevice
      ? 17
      : 18,

    fontWeight: "700",
    color: "#222",
  },

  clearText: {
    color: "#4c8c2b",

    fontSize: isTablet ? 18 : 15,

    fontWeight: "600",
  },

  // ================= CHIPS =================

  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 15,
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#F4F4F4",

    paddingHorizontal: isTablet ? 18 : 14,
    paddingVertical: isTablet ? 12 : 9,

    borderRadius: 22,

    marginRight: 10,
    marginBottom: 12,
  },

  chipText: {
    marginLeft: 6,

    fontSize: isTablet ? 16 : 14,

    color: "#555",
    fontWeight: "500",
  },

  // ================= RESULTS =================

  resultsContainer: {
    paddingHorizontal: HORIZONTAL_PADDING,
    marginTop: 10,
  },

  sectionTitle: {
    fontSize: isTablet
      ? 22
      : isSmallDevice
      ? 16
      : 18,

    fontWeight: "700",
    color: "#222",

    marginBottom: 14,
    marginTop: 20,
  },

  // ================= GRID =================

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  gridCard: {
    width: CARD_WIDTH,

    backgroundColor: "#FFFFFF",

    borderRadius: isTablet ? 26 : 20,

    marginBottom: isTablet ? 22 : 16,

    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,

    elevation: 4,
  },

  // ================= IMAGE =================

  imageWrapper: {
    width: "100%",

    height: isTablet
      ? 220
      : isSmallDevice
      ? 125
      : 155,

    backgroundColor: "#F8F8F8",

    justifyContent: "center",
    alignItems: "center",

    padding: isTablet ? 18 : 12,
  },

  gridImage: {
    width: "100%",
    height: "100%",
  },

  // ================= TEXT =================

  gridName: {
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 16,

    fontSize: isTablet
      ? 18
      : isSmallDevice
      ? 13
      : 14,

    fontWeight: "600",
    color: "#222",

    textAlign: "center",

    minHeight: isTablet ? 70 : 52,
  },

  // ================= EMPTY =================

  noResult: {
    textAlign: "center",

    marginTop: height * 0.08,

    color: "#888",

    fontSize: isTablet ? 18 : 15,

    fontWeight: "500",
  },
});