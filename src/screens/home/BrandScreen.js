import React, { useEffect, useState } from "react";
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
import { getBrandsByCategory } from "../../features/category/categorySlice";

const { width, height } = Dimensions.get("window");

// ✅ Responsive Card Width
const HORIZONTAL_PADDING = 20;
const CARD_GAP = 14;
const CARD_WIDTH =
    (width - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

const BrandScreen = ({ navigation, route }) => {
    const { categoryId } = route.params;

    const [searchText, setSearchText] = useState("");

    const dispatch = useDispatch();

    const { brands, loading } = useSelector(
        (state) => state.category
    );

    // ✅ Filter Brands
    const filteredBrand = brands.filter((item) =>
        item.name
            ?.toLowerCase()
            .includes(searchText.toLowerCase())
    );

    // ✅ Render Brand Card
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
            {/* Image Container */}
            <View style={styles.imageWrapper}>
                <Image
                    source={{ uri: item.image }}
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
                        {item?.productCount || 0} Products
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    useEffect(() => {
        dispatch(getBrandsByCategory({ categoryId }));
    }, [categoryId]);

    return (
        <View style={styles.container}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />

            {/* Header */}
            <ImageBackground
                source={require("../../assets/images/bg1.png")}
                style={styles.headerBg}
                resizeMode="cover"
            >
                <View style={styles.overlay} />

                <SafeAreaView edges={["top"]}>
                    {/* Top Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}
                        >
                            <Icon
                                name="arrow-back"
                                size={22}
                                color="#111"
                            />
                        </TouchableOpacity>

                        <Text
                            style={styles.headerTitle}
                            numberOfLines={2}
                        >
                            Select the brand you like the most
                        </Text>

                        <View style={{ width: 40 }} />
                    </View>

                    {/* Search */}
                    <View style={styles.searchBar}>
                        <Icon
                            name="search"
                            size={18}
                            color="#888"
                        />

                        <TextInput
                            placeholder="Search brand name"
                            placeholderTextColor="#888"
                            style={styles.input}
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                    </View>
                </SafeAreaView>
            </ImageBackground>

            {/* Title */}
            <View style={styles.titleContainer}>
                <Text style={styles.sectionTitle}>
                    {filteredBrand.length} Brands Available
                </Text>
            </View>

            {/* Loader */}
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator
                        size="large"
                        color="#4c8c2b"
                    />
                </View>
            ) : (
                <FlatList
                    data={filteredBrand}
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
                                No brands found
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

export default BrandScreen;

const styles = StyleSheet.create({
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
        marginTop: 6,
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
        fontSize: width < 360 ? 14 : 16,
        fontWeight: "700",
        color: "#111",
        paddingHorizontal: 10,
        lineHeight: 22,
    },

    // ================= SEARCH =================

    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
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
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: "#111",
        paddingVertical: 0,
    },

    // ================= TITLE =================

    titleContainer: {
        paddingHorizontal: 20,
        marginTop: 18,
        marginBottom: 10,
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
        backgroundColor: "#fff",
        borderRadius: 22,
        marginBottom: 16,
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

    // ✅ Image perfectly responsive
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
        paddingVertical: 14,
        alignItems: "center",
    },

    cardTitle: {
        fontSize: width < 360 ? 13 : 14,
        fontWeight: "600",
        color: "#222",
        textAlign: "center",
        minHeight: 38,
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
});