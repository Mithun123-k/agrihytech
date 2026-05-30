import React, { useEffect } from "react";
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
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { getProductsByBrand, getProductsByCategory } from "../../features/brands/brandSlice";

const products = [
  { id: "1" },
  { id: "2" },
  { id: "3" },
];

const ProductsScreen = ({ navigation, route }) => {
  const { brandId, brandName, brandImage, categoryId } = route.params;
  const dispatch = useDispatch();
  const { products, loading, total } = useSelector((state) => state.brand);
  const { user } = useSelector((state) => state.auth);
  // const role = user?.role;

  console.log("Products for brandId:", brandId);


  const renderItem1 = () => (
    <TouchableOpacity activeOpacity={0.5} style={styles.card} onPress={() => navigation.navigate("ProductDetailsScreen")}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🔥 Bestseller</Text>
        </View>

        <Image
          source={require("../../assets/images/prod.png")}
          style={styles.productImage}
          resizeMode="contain"
        />
      </View>

      {/* Category */}
      <View style={styles.categoryChip}>
        <Text style={styles.categoryText}>Insecticide</Text>
      </View>

      {/* Price */}
      <Text style={styles.price}>
        Price Range: - ₹200 - ₹250
      </Text>

      {/* Title */}
      <Text style={styles.title}>
        CropGuard Pro Insecticide
      </Text>

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>
        A high-performance, broad-spectrum insecticide designed to
        eliminate resilient pests while remaining gentle on your crops.
      </Text>

      {/* Tags */}
      <View style={styles.tagsRow}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>🌾 Wheat</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>🥕 Vegetables</Text>
        </View>
      </View>
    </TouchableOpacity>
  );


  const renderItem = ({ item }) => (
  <TouchableOpacity
    style={styles.card}
    key={item._id}
    onPress={() => navigation.navigate("ProductDetailsScreen", { productId: item._id })}
  >

    <View style={styles.imageContainer}>
      <Image
        source={{ uri: item.images[0]?.url }}
        style={styles.productImage}
        resizeMode="contain"
      />
    </View>

    <View style={styles.categoryChip}>
      <Text style={styles.categoryText}>
        {item.category?.name || "Category"}
      </Text>
    </View>

    <Text style={styles.price}>
      ₹{item.price || 0}
    </Text>

    <Text style={styles.title}>
      {item.name}
    </Text>

    <Text style={styles.description} numberOfLines={2}>
      {item.description}
    </Text>

  </TouchableOpacity>
);


  useEffect(() => {
  if (!brandId) {
    dispatch(getProductsByCategory({ categoryId }));
  } else {
    dispatch(getProductsByBrand({ brandId }));
  }
}, [dispatch, user?.role, brandId, categoryId]);


  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListHeaderComponent={
          <>
            {/* HEADER */}
            <ImageBackground
              source={require("../../assets/images/bg1.png")}
              style={styles.headerBg}
              resizeMode="cover"
            >
              <SafeAreaView>
                <View style={styles.headerRow}>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="#000" />
                  </TouchableOpacity>

                  <Text style={styles.headerTitle}>
                    {brandName}
                  </Text>

                  <Image
                    source={{uri:brandImage}}
                    style={styles.logo}
                  />
                </View>

                {/* Search */}
                <View style={styles.searchBar}>
                  <Icon name="search" size={18} color="#999" />
                  <TextInput
                    placeholder="Search products name or crop problems"
                    placeholderTextColor="#999"
                    style={styles.searchInput}
                  />
                </View>
              </SafeAreaView>
            </ImageBackground>

            {/* Count */}
            <Text style={styles.countText}>
              Showing <Text style={{ fontWeight: "700" }}>{products?.length}</Text> products
            </Text>
          </>
        }
        renderItem={renderItem}
      />
    </View>
  );
};

export default ProductsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9EFE3",
  },

  headerBg: {
    height: 180,
    paddingHorizontal: 20,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },

  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: 20,
    borderRadius: 18,
    paddingHorizontal: 15,
    height: 48,
  },

  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 15,
  },

  countText: {
    fontSize: 16,
    color: "#555",
    marginHorizontal: 20,
    marginVertical: 15,
  },

  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },

  imageContainer: {
    backgroundColor: "#F5F5F5",
    // borderRadius: 15,
    // height: 170,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderRadius: 8
  },

  badge: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#FFE5E5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 1,
    overflow: "hidden",

  },

  badgeText: {
    color: "#FF3B30",
    fontWeight: "600",
    fontSize: 12,
  },

  productImage: {
    width: '100%',
    height: 128,
  },

  categoryChip: {
    alignSelf: "flex-start",
    backgroundColor: "#F4E4C8",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 8,
  },

  categoryText: {
    color: "#C17A00",
    fontWeight: "600",
    fontSize: 13,
  },

  price: {
    color: "#2563EB",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginBottom: 6,
  },

  description: {
    color: "#777",
    fontSize: 14,
    lineHeight: 20,
  },

  tagsRow: {
    flexDirection: "row",
    marginTop: 12,
  },

  tag: {
    borderWidth: 1,
    borderColor: "#4C8C2B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },

  tagText: {
    color: "#4C8C2B",
    fontWeight: "600",
    fontSize: 13,
  },
});