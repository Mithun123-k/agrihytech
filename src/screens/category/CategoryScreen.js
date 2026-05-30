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
  PixelRatio,
  Platform,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../features/category/categorySlice";

const { width, height } = Dimensions.get("window");

// ==========================
// RESPONSIVE HELPERS
// ==========================
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = (size) =>
  (width / guidelineBaseWidth) * size;

const verticalScale = (size) =>
  (height / guidelineBaseHeight) * size;

const moderateScale = (
  size,
  factor = 0.5
) =>
  size +
  (scale(size) - size) * factor;

const normalize = (size) => {
  const newSize = moderateScale(size);

  return Math.round(
    PixelRatio.roundToNearestPixel(newSize)
  );
};

// ==========================
// CARD WIDTH
// ==========================
const horizontalPadding = scale(18);
const itemGap = scale(12);

const CARD_WIDTH =
  (width -
    horizontalPadding * 2 -
    itemGap) /
  2;

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

const CategoryScreen = ({
  navigation,
}) => {
  const dispatch = useDispatch();

  const { categories, loading } =
    useSelector(
      (state) => state.category
    );

  const { user } = useSelector(
    (state) => state.auth
  );

  const [selectedCrop, setSelectedCrop] =
    useState("Wheat");

  const [searchText, setSearchText] =
    useState("");

  // ==========================
  // API
  // ==========================
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // ==========================
  // FILTER
  // ==========================
  const filteredCategories =
    categories.filter((item) =>
      item.name
        ?.toLowerCase()
        .includes(
          searchText.toLowerCase()
        )
    );

  // ==========================
  // CATEGORY CARD
  // ==========================
  const renderCategory = ({
    item,
  }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={
        user?.role === "B2C"
          ? 0.5
          : 1
      }
      onPress={() =>
        user?.role === "B2C"
          ? navigation.navigate(
              "UserProduct",
              {
                categoryId: item._id,
                categoryName: item.name,
                categoryImage:
                  item.image,
              }
            )
          : null
      }
    >
      <Image
        source={{
          uri: item.image
            ? item.image
            : "https://via.placeholder.com/150",
        }}
        style={styles.cardImage}
        resizeMode="cover"
      />

      <View style={styles.cardFooter}>
        <Text
          style={styles.cardTitle}
          numberOfLines={2}
        >
          {item.name}
        </Text>

        <View style={styles.countBadge}>
          {user?.role === "B2C" ? (
            <Text style={styles.countText}>
              {item.productCount || 0}+
            </Text>
          ) : (
            <Text style={styles.countText}>
              {item.totalBrands || 0}+
            </Text>
          )}
        </View>
      </View>

      {user?.role === "B2B" && (
        <View
          style={[
            styles.cardFooter,
            {
              gap: scale(6),
              paddingTop: 0,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.sell}
            onPress={() =>
              navigation.navigate(
                "AddProductDetailsScreen"
              )
            }
          >
            <Text style={styles.sellText}>
              Sell
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buy}
            onPress={() =>
              navigation.navigate(
                "BrandScreen",
                {
                  categoryId:
                    item._id,
                }
              )
            }
          >
            <Text style={styles.buyText}>
              Buy
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

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
              onPress={() =>
                navigation.goBack()
              }
            >
              <Icon
                name="arrow-back"
                size={normalize(23)}
                color="#000"
              />
            </TouchableOpacity>

            <Text
              style={styles.headerTitle}
              numberOfLines={1}
            >
              Choose a Category
            </Text>

            <View
              style={{
                width: normalize(23),
              }}
            />
          </View>

          {/* SEARCH */}
          <View style={styles.searchBar}>
            <Icon
              name="search"
              size={normalize(18)}
              color="#888"
            />

            <TextInput
              placeholder="Search category"
              placeholderTextColor="#888"
              style={styles.input}
              value={searchText}
              onChangeText={
                setSearchText
              }
            />
          </View>
        </SafeAreaView>
      </ImageBackground>

      {/* MAIN CONTENT */}
      <FlatList
        data={filteredCategories}
        keyExtractor={(item) =>
          item._id
        }
        numColumns={2}
        renderItem={renderCategory}
        showsVerticalScrollIndicator={
          false
        }
        columnWrapperStyle={{
          justifyContent:
            "space-between",
          paddingHorizontal:
            horizontalPadding,
        }}
        ListHeaderComponent={
          <>
            {/* FILTER */}
            {/* <View
              style={styles.cropContainer}
            >
              <Text
                style={styles.sectionTitle}
              >
                Browse by crops
              </Text>

              <FlatList
                horizontal
                data={cropFilters}
                keyExtractor={(
                  item
                ) => item.id}
                showsHorizontalScrollIndicator={
                  false
                }
                contentContainerStyle={{
                  paddingHorizontal:
                    horizontalPadding,
                  paddingRight:
                    scale(10),
                }}
                renderItem={({
                  item,
                }) => {
                  const isActive =
                    selectedCrop ===
                    item.name;

                  return (
                    <TouchableOpacity
                      style={[
                        styles.chip,
                        isActive &&
                          styles.activeChip,
                      ]}
                      onPress={() =>
                        setSelectedCrop(
                          item.name
                        )
                      }
                    >
                      <Image
                        source={
                          item.icon
                        }
                        style={[
                          styles.chipIcon,
                          {
                            tintColor:
                              isActive
                                ? "#fff"
                                : "#000",
                          },
                        ]}
                        resizeMode="contain"
                      />

                      <Text
                        style={[
                          styles.chipText,
                          isActive &&
                            styles.activeChipText,
                        ]}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View> */}

            {/* SECTION TITLE */}
            <Text
              style={[
                styles.sectionTitle,
                {
                  marginTop:
                    verticalScale(
                      10
                    ),
                  marginBottom:
                    verticalScale(
                      14
                    ),
                  paddingHorizontal:
                    horizontalPadding,
                },
              ]}
            >
              Product Categories
            </Text>
          </>
        }
        ListEmptyComponent={
          !loading && (
            <Text
              style={{
                textAlign:
                  "center",
                marginTop:
                  verticalScale(
                    40
                  ),
                fontSize:
                  normalize(15),
              }}
            >
              No categories found
            </Text>
          )
        }
        ListFooterComponent={
          <View
            style={{
              height:
                verticalScale(120),
            }}
          />
        }
        contentContainerStyle={{
          paddingTop:
            verticalScale(10),
          paddingBottom:
            verticalScale(80),
        }}
      />

      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator
            size="large"
            color="#4c8c2b"
          />
        </View>
      )}
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDF2E9",
  },

  headerBg: {
    height:
      Platform.OS === "ios"
        ? verticalScale(145)
        : verticalScale(135),
    minHeight: 125,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
    paddingHorizontal:
      horizontalPadding,
    marginTop: verticalScale(6),
  },

  headerTitle: {
    fontSize: normalize(20),
    fontWeight: "700",
    color: "#222",
    maxWidth: "75%",
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginHorizontal:
      horizontalPadding,
    marginTop: verticalScale(16),
    borderRadius: scale(14),
    paddingHorizontal:
      scale(15),
    height: verticalScale(48),
    minHeight: 46,
  },

  input: {
    marginLeft: scale(10),
    flex: 1,
    fontSize: normalize(15),
    color: "#222",
    paddingVertical: 0,
  },

  cropContainer: {
    marginTop: verticalScale(1),
  },

  sectionTitle: {
    fontSize: normalize(18),
    fontWeight: "700",
    color: "#222",
    marginBottom:
      verticalScale(12),
  },

  chip: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal:
      scale(14),
    paddingVertical:
      verticalScale(10),
    borderRadius: scale(25),
    marginRight: scale(12),
    flexDirection: "row",
    alignItems: "center",
    minHeight: verticalScale(42),
  },

  activeChip: {
    backgroundColor: "#4c8c2b",
  },

  chipIcon: {
    width: scale(16),
    height: scale(16),
    marginRight: scale(6),
  },

  chipText: {
    color: "#333",
    fontWeight: "500",
    fontSize: normalize(13),
  },

  activeChipText: {
    color: "#fff",
  },

  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: scale(18),
    marginBottom:
      verticalScale(16),
    overflow: "hidden",
    paddingBottom:
      verticalScale(10),

    elevation: 3,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  cardImage: {
    width: "100%",
    height: verticalScale(125),
    minHeight: 110,
  },

  cardFooter: {
    paddingHorizontal:
      scale(12),
    paddingVertical:
      verticalScale(10),
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: normalize(14),
    fontWeight: "600",
    width: "68%",
    color: "#222",
    lineHeight: normalize(18),
  },

  countBadge: {
    backgroundColor: "#f3e3c3",
    paddingHorizontal:
      scale(10),
    paddingVertical:
      verticalScale(4),
    borderRadius: scale(8),
    alignItems: "center",
    justifyContent: "center",
    minWidth: scale(44),
  },

  countText: {
    color: "#b57900",
    fontWeight: "700",
    fontSize: normalize(12),
  },

  sell: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#4C7A1E",
    backgroundColor: "#4C7A1E",
    paddingVertical:
      verticalScale(9),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scale(8),
  },

  sellText: {
    fontSize: normalize(13),
    fontWeight: "600",
    color: "#FFFFFF",
  },

  buy: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#4C7A1E",
    backgroundColor: "#EDF2E9",
    paddingVertical:
      verticalScale(9),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scale(8),
  },

  buyText: {
    fontSize: normalize(13),
    fontWeight: "600",
    color: "#4C7A1E",
  },

  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});