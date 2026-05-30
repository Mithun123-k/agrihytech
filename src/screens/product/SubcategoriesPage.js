import React, { useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProductHeader from '../../components/product/ProductHeader';
import { useDispatch, useSelector } from 'react-redux';
import { getBrandsByCategory, getMyBrandsByCategory } from '../../features/category/categorySlice';

const { width } = Dimensions.get('window');

const horizontalPadding = 24;
const cardGap = 16;
const cardWidth = (width - horizontalPadding * 2 - cardGap) / 2;

const BRANDS = [
  {
    id: '1',
    name: 'Shri Sai Forestry',
    products: 23,
    image: require('../../assets/images/brand.png'),
  },
  {
    id: '2',
    name: 'Eastwest',
    products: 13,
    image: require('../../assets/images/brand1.png'),
  },
  {
    id: '3',
    name: 'Seminis',
    products: 76,
    image: require('../../assets/images/brand.png'),
  },
  {
    id: '4',
    name: 'FGK',
    products: 11,
    image: require('../../assets/images/brand1.png'),
  },
  {
    id: '5',
    name: 'Sangram',
    products: 44,
    image: require('../../assets/images/brand.png'),
  },
  {
    id: '6',
    name: 'Sakata',
    products: 21,
    image: require('../../assets/images/brand1.png'),
  },
  {
    id: '7',
    name: 'Seminis',
    products: 21,
    image: require('../../assets/images/cat.png'),
  },
];

const BrandCard = ({ item, onPress }) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
      </View>

      <Text numberOfLines={2} style={styles.brandName}>
        {item.name}
      </Text>

      <Text style={styles.productCount}>{item.productCount} Products</Text>

      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.button}
        onPress={() => onPress(item)}
      >
        <Text style={styles.buttonText}>View All Product</Text>
      </TouchableOpacity>
    </View>
  );
};

const SubcategoriesPage = ({ navigation, route }) => {
  const { category, categoryId } = route.params;
  const dispatch = useDispatch();
  const { brands, loading } = useSelector((state) => state.category);

  console.log('Brands in SubcategoriesPage:', brands); // Debug log


  const handleBrandPress = (brand) => {
    navigation.navigate('ProductListScreen', {
      brandId: brand._id , brandName: brand.name
    });
  };


  useEffect(() => {
    dispatch(getMyBrandsByCategory({ categoryId }));
  }, [categoryId]);
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <ProductHeader title={category} showShare={false} navigation={navigation} />



      <View style={styles.topSection}>
        <Text style={styles.countText}>
          <Text style={styles.boldText}>{brands.length}</Text> Brands Listed
        </Text>
      </View>

      <FlatList
        data={brands}
        keyExtractor={(item) => item._id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <BrandCard item={item} onPress={handleBrandPress} />
        )}
      />
    </View>
  );
};

export default SubcategoriesPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF2EB',
  },

  header: {
    marginTop: 12,
    paddingHorizontal: horizontalPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
  },

  headerTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: '#202020',
    letterSpacing: 0.2,
  },

  placeholder: {
    width: 40,
  },

  topSection: {
    paddingHorizontal: horizontalPadding,
    // marginTop: 52,
    marginBottom: 22,
  },

  countText: {
    fontSize: 14,
    color: '#767676',
    fontWeight: '600',
  },

  boldText: {
    color: '#2A2A2A',
    fontWeight: '800',
    fontSize: 14,
  },

  listContent: {
    paddingHorizontal: horizontalPadding,
    paddingBottom: 40,
  },

  row: {
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  card: {
    width: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },

  imageWrapper: {
    width: '100%',
    height: cardWidth * 0.75,
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
  },

  image: {
    width: '82%',
    height: '82%',
  },

  brandName: {
    marginTop: 18,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#232323',
    // minHeight: 48,
  },

  productCount: {
    marginTop: 6,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#D38B18',
  },

  button: {
    marginTop: 18,
    height: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#5F8E2D',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5F8E2D',
  },
});

