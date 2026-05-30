// UserBrandScreen.js

import React, {
    useState,
    useMemo,
    useCallback,
    useEffect,
} from "react";

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

import {
    getBrandsByProduct,
} from "../../features/category/categorySlice";

import {
    useDispatch,
    useSelector,
} from "react-redux";


// =====================================================
// RESPONSIVE HELPERS
// =====================================================

const { width, height } =
    Dimensions.get("window");

const guidelineBaseWidth = 390;
const guidelineBaseHeight = 844;

const scale = (size) =>
    (width / guidelineBaseWidth) *
    size;

const verticalScale = (size) =>
    (height / guidelineBaseHeight) *
    size;

const moderateScale = (
    size,
    factor = 0.5
) =>
    size +
    (scale(size) - size) * factor;

const isSmallDevice =
    width < 360 || height < 700;

const isTablet = width >= 768;

const CARD_WIDTH = isTablet
    ? width / 3.7
    : (width - moderateScale(52)) / 2;


// =====================================================
// MAIN SCREEN
// =====================================================

const UserBrandScreen = ({
    navigation,
    route,
}) => {

    const { productId } =
        route.params || {};

    const [searchText, setSearchText] =
        useState("");

    const dispatch = useDispatch();

    const {
        brands,
        loading,
    } = useSelector(
        (state) => state.category
    );


    // =====================================================
    // FETCH BRANDS
    // =====================================================

    useEffect(() => {

        if (productId) {

            dispatch(
                getBrandsByProduct(
                    productId
                )
            );

        }

    }, [productId, dispatch]);


    // =====================================================
    // FILTER BRANDS
    // =====================================================

    const filteredBrand = useMemo(() => {

        return brands.filter((item) =>
            item?.name
                ?.toLowerCase()
                ?.includes(
                    searchText.toLowerCase()
                )
        );

    }, [brands, searchText]);


    // =====================================================
    // RENDER CARD
    // =====================================================

    const renderCategory =
        useCallback(

            ({ item }) => (

                <TouchableOpacity
                    activeOpacity={0.88}
                    style={styles.card}
                    onPress={() =>
                        navigation.navigate(
                            "ProductDetailsScreen",
                            {
                                productId:
                                    productId,
                            }
                        )
                    }
                >

                    {/* IMAGE */}
                    <View
                        style={
                            styles.imageWrapper
                        }
                    >

                        <Image
                            source={{
                                uri: item.image,
                            }}
                            style={
                                styles.cardImage
                            }
                            resizeMode="contain"
                        />

                    </View>

                    {/* FOOTER */}
                    <View
                        style={
                            styles.cardFooter
                        }
                    >

                        <Text
                            numberOfLines={2}
                            style={
                                styles.cardTitle
                            }
                        >
                            {item.name}
                        </Text>

                    </View>

                </TouchableOpacity>

            ),

            [navigation]
        );


    // =====================================================
    // EMPTY COMPONENT
    // =====================================================

    const renderEmpty = () => (

        <View style={styles.emptyContainer}>

            <Icon
                name="cube-outline"
                size={moderateScale(55)}
                color="#B0B0B0"
            />

            <Text style={styles.emptyText}>
                No brands found
            </Text>

        </View>

    );


    // =====================================================
    // UI
    // =====================================================

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

                <SafeAreaView>

                    {/* TOP HEADER */}
                    <View style={styles.header}>

                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={
                                styles.backBtn
                            }
                            onPress={() =>
                                navigation.goBack()
                            }
                        >

                            <Icon
                                name="arrow-back"
                                size={moderateScale(
                                    22
                                )}
                                color="#111"
                            />

                        </TouchableOpacity>

                        <Text
                            style={
                                styles.headerTitle
                            }
                            numberOfLines={2}
                        >
                            Select the brand
                            you like the most
                        </Text>

                        <View
                            style={{
                                width:
                                    moderateScale(
                                        36
                                    ),
                            }}
                        />

                    </View>


                    {/* SEARCH BAR */}
                    <View
                        style={
                            styles.searchBar
                        }
                    >

                        <Icon
                            name="search"
                            size={moderateScale(
                                18
                            )}
                            color="#777"
                        />

                        <TextInput
                            placeholder="Search brand name"
                            placeholderTextColor="#999"
                            style={
                                styles.input
                            }
                            value={searchText}
                            onChangeText={
                                setSearchText
                            }
                        />

                    </View>

                </SafeAreaView>

            </ImageBackground>


            {/* BRAND COUNT */}
            <View
                style={
                    styles.titleContainer
                }
            >

                <Text
                    style={
                        styles.sectionTitle
                    }
                >
                    {filteredBrand.length}{" "}
                    Brands Available
                </Text>

            </View>


            {/* LOADER */}
            {loading ? (

                <View
                    style={
                        styles.loaderContainer
                    }
                >

                    <ActivityIndicator
                        size="large"
                        color="#4C7C1A"
                    />

                </View>

            ) : (

                <FlatList
                    data={filteredBrand}
                    keyExtractor={(item) =>
                        item._id
                    }
                    numColumns={2}
                    renderItem={
                        renderCategory
                    }
                    showsVerticalScrollIndicator={
                        false
                    }
                    ListEmptyComponent={
                        renderEmpty
                    }
                    contentContainerStyle={
                        styles.listContainer
                    }
                    columnWrapperStyle={{
                        justifyContent:
                            "space-between",
                    }}
                    initialNumToRender={
                        6
                    }
                    windowSize={5}
                    removeClippedSubviews
                />

            )}

        </View>

    );
};

export default UserBrandScreen;


// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#EDF2E9",
    },

    headerBg: {
        height: verticalScale(
            isSmallDevice
                ? 155
                : 180
        ),
    },

    header: {
        flexDirection: "row",

        alignItems: "center",

        justifyContent:
            "space-between",

        paddingHorizontal:
            moderateScale(18),

        marginTop:
            Platform.OS === "android"
                ? verticalScale(6)
                : verticalScale(2),
    },

    backBtn: {
        width: moderateScale(38),

        height:
            moderateScale(38),

        borderRadius:
            moderateScale(19),

        backgroundColor:
            "rgba(255,255,255,0.94)",

        justifyContent:
            "center",

        alignItems: "center",

        elevation: 2,
    },

    headerTitle: {
        flex: 1,

        textAlign: "center",

        fontSize: isSmallDevice
            ? moderateScale(15)
            : moderateScale(17),

        fontWeight: "700",

        color: "#111827",

        marginHorizontal:
            moderateScale(12),

        lineHeight:
            verticalScale(24),
    },

    searchBar: {
        flexDirection: "row",

        alignItems: "center",

        backgroundColor: "#fff",

        marginHorizontal:
            moderateScale(20),

        marginTop:
            verticalScale(24),

        borderRadius:
            moderateScale(16),

        paddingHorizontal:
            moderateScale(16),

        height: verticalScale(52),

        elevation: 5,

        shadowColor: "#000",

        shadowOpacity: 0.05,

        shadowRadius: 8,

        shadowOffset: {
            width: 0,
            height: 3,
        },
    },

    input: {
        marginLeft:
            moderateScale(10),

        flex: 1,

        fontSize:
            moderateScale(14),

        color: "#111",
    },

    titleContainer: {
        marginTop:
            verticalScale(14),

        marginBottom:
            verticalScale(10),

        paddingHorizontal:
            moderateScale(20),
    },

    sectionTitle: {
        fontSize:
            moderateScale(18),

        fontWeight: "700",

        color: "#1F2937",
    },

    listContainer: {
        paddingHorizontal:
            moderateScale(18),

        paddingBottom:
            verticalScale(50),
    },

    // =====================================================
    // CARD
    // =====================================================

    card: {
        width: CARD_WIDTH,

        backgroundColor: "#fff",

        borderRadius:
            moderateScale(22),

        marginBottom:
            verticalScale(18),

        overflow: "hidden",

        elevation: 5,

        shadowColor: "#000",

        shadowOpacity: 0.06,

        shadowRadius: 8,

        shadowOffset: {
            width: 0,
            height: 3,
        },

        borderWidth: 1,

        borderColor: "#F0F0F0",
    },


    // =====================================================
    // IMAGE WRAPPER
    // =====================================================

    imageWrapper: {

        width: "100%",

        aspectRatio: 1,

        backgroundColor: "#F8F8F8",

        justifyContent: "center",

        alignItems: "center",

        padding:
            moderateScale(12),

        overflow: "hidden",
    },


    // =====================================================
    // IMAGE
    // =====================================================

    cardImage: {

        width: "100%",

        height: "100%",

        borderRadius:
            moderateScale(16),
    },


    // =====================================================
    // FOOTER
    // =====================================================

    cardFooter: {

        paddingHorizontal:
            moderateScale(12),

        paddingVertical:
            verticalScale(14),

        alignItems: "center",

        justifyContent:
            "center",

        minHeight:
            verticalScale(60),
    },


    // =====================================================
    // TITLE
    // =====================================================

    cardTitle: {

        fontSize:
            moderateScale(14),

        fontWeight: "600",

        color: "#1F2937",

        textAlign: "center",

        lineHeight:
            verticalScale(20),
    },

    emptyContainer: {
        flex: 1,

        alignItems: "center",

        justifyContent:
            "center",

        marginTop:
            verticalScale(80),
    },

    emptyText: {
        marginTop:
            verticalScale(12),

        textAlign: "center",

        fontSize:
            moderateScale(15),

        color: "#777",

        fontWeight: "500",
    },

    loaderContainer: {
        flex: 1,

        justifyContent:
            "center",

        alignItems: "center",
    },

});