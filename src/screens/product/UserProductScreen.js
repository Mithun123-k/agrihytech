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
import {
  getProductsByBrand,
  getProductsByCategory,
} from "../../features/brands/brandSlice";

const UserProductsScreen = ({ navigation, route }) => {
  const { brandId, categoryName, categoryImage, categoryId } = route.params;
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.brand);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!brandId) {
      dispatch(getProductsByCategory({ categoryId }));
    } else {
      dispatch(getProductsByBrand({ brandId }));
    }
  }, [dispatch, user?.role, brandId, categoryId]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("UserBrandScreen", {
          items: item?.brand,
          productId: item._id,
        })
      }
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.images?.[0]?.url }}
          style={styles.productImage}
          resizeMode="contain"
        />
      </View>

      {/* <View style={styles.categoryChip}>
        <Text style={styles.categoryText}>
          {item.category?.name || "Category"}
        </Text>
      </View> */}

     

      <Text style={styles.title} numberOfLines={2}>
        {item.name}
      </Text>
       {/* <Text style={styles.price}>₹{item.price || 0}</Text> */}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        numColumns={3}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListHeaderComponent={
          <>
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
                    {categoryName || "Seed"}
                  </Text>

                  <Image source={{ uri: categoryImage }} style={styles.logo} />
                </View>

                <View style={styles.searchBar}>
                  <Icon name="search" size={18} color="#999" />
                  <TextInput
                    placeholder="Search products"
                    placeholderTextColor="#999"
                    style={styles.searchInput}
                  />
                </View>
              </SafeAreaView>
            </ImageBackground>

            <Text style={styles.countText}>
              Showing{" "}
              <Text style={{ fontWeight: "700" }}>
                {products?.length}
              </Text>{" "}
              products
            </Text>
          </>
        }
      />
    </View>
  );
};

export default UserProductsScreen;

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

  row: {
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    width: "31%",
    borderRadius: 14,
    padding: 8,
    marginBottom: 15,
  },

  imageContainer: {
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 8,
    padding: 8,
  },

  productImage: {
    width: "100%",
    height: 70,
  },

  categoryChip: {
    alignSelf: "flex-start",
    backgroundColor: "#F4E4C8",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },

  categoryText: {
    color: "#C17A00",
    fontWeight: "600",
    fontSize: 10,
  },

  price: {
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
  },

  title: {
    fontSize: 12,
    fontWeight: "700",
    color: "#222",
  },
});