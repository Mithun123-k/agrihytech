import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Image,
    FlatList,
    Dimensions,
    StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ProductHeader from '../../components/product/ProductHeader';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories, getMyCategories } from '../../features/category/categorySlice';
import { get } from 'react-native/Libraries/NativeComponent/NativeComponentRegistry';

const { width } = Dimensions.get('window');
const CARD_GAP = 16;
const CARD_WIDTH = (width - 48 - CARD_GAP) / 2;

const DATA = [
    {
        id: '1',
        title: 'Seeds',
        count: '35+',
        image: require('../../assets/images/cat.png'),
    },
    {
        id: '2',
        title: 'Pesticides',
        count: '15+',
        image: require('../../assets/images/cat1.png'),
    },
    {
        id: '3',
        title: 'Agricultural\nmachinery',
        count: '10+',
        image: require('../../assets/images/cat2.png'),
    },
    {
        id: '4',
        title: 'Irrigation\nEquipment',
        count: '5+',
        image: require('../../assets/images/cat3.png'),
    },
];

const ProductCard = ({ item, onPress }) => {

    return (
        <View style={styles.card}>
            <Image source={{uri: item.image}} style={styles.image} resizeMode="cover" />

            <View style={styles.contentRow}>
                <Text style={styles.cardTitle}>{item.name}</Text>

                <View style={styles.countBadge}>
                    <Text style={styles.countText}>{item.totalBrands || 0}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={() => onPress(item)} activeOpacity={0.85}>
                <Text style={styles.buttonText}>Add/Edit Products</Text>
            </TouchableOpacity>
        </View>
    );
};

const YourProductsScreen = ({ navigation, }) => {
    const handleCategoryPress = (item) => {
        navigation.navigate('SubcategoriesPage', {
            category: item.name,
            categoryId: item._id,
        });
    };
     const dispatch = useDispatch();

  const { categories, loading } = useSelector(
    (state) => state.category
  );

console.log("Categories in YourProductsScreen:", categories); // Debug log


  // 🔥 API CALL
    useEffect(() => {
      dispatch(getMyCategories());
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

            <ProductHeader
                navigation={navigation}
                title="Your Products"
                showShare={false}
                onShare={() => console.log("share clicked")}
            />

            <Text style={styles.sectionTitle}>Product Categories</Text>

            <FlatList
                data={categories}
                keyExtractor={(item) => item._id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <ProductCard item={item} onPress={handleCategoryPress} />
                )}
            />
        </View>
    );
};

export default YourProductsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEF2EB',
    },

    header: {
        marginTop: 12,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    backButton: {
        width: 42,
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
    },

    headerTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: '#1F1F1F',
        letterSpacing: 0.2,
    },

    headerSpacer: {
        width: 42,
    },

    sectionTitle: {
        // marginTop: 34,
        marginBottom: 22,
        paddingHorizontal: 24,
        fontSize: 14,
        fontWeight: '600',
        color: '#232323',
    },

    listContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },

    row: {
        justifyContent: 'space-between',
        marginBottom: 18,
    },

    card: {
        width: CARD_WIDTH,
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
    },

    image: {
        width: '100%',
        height: CARD_WIDTH * 0.68,
        borderRadius: 8,
        backgroundColor: '#E6E6E6',
    },

    contentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: 14,
        // minHeight: 72,
        width: '100%',
    },

    cardTitle: {
        // flex: 1,
        fontSize: 16,
        // lineHeight: width < 380 ? 23 : 26,
        fontWeight: '600',
        color: '#202020',
        paddingRight: 8,
        width: '70%',
    },

    countBadge: {
        // minWidth: 56,
        // height: 42,
        borderRadius: 8,
        backgroundColor: '#FAF3E7',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
    },

    countText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#D18C16',
    },

    button: {
        marginTop: 14,
        borderWidth: 1,
        borderColor: '#5B8F2D',
        borderRadius: 10,
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EDF2E9',
    },

    buttonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#5B8F2D',
    },
});
