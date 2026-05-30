import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  StatusBar,
  Alert,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ProductHeader from '../../components/product/ProductHeader';
import { useDispatch, useSelector } from 'react-redux';
import { getMyProductsByBrand, deleteProduct } from '../../features/brands/brandSlice';
import { useFocusEffect } from '@react-navigation/native';


const { width, height } = Dimensions.get('window');

const productsData = [
  {
    id: '1',
    name: 'Teak Seeds 1',
    qty: '1 kg / 25 kg / 50 kg',
    image: require('../../assets/images/prolist.png'),
  },
  {
    id: '2',
    name: 'African Mahogany Seeds',
    qty: '1 kg / 25 kg / 50 kg',
    image: require('../../assets/images/prolist.png'),
  },
  {
    id: '3',
    name: 'Super Napier Grass Seeds',
    qty: '1 kg / 25 kg / 50 kg',
    image: require('../../assets/images/prolist.png'),
  },
  {
    id: '4',
    name: 'Gliricidia Sepium Seeds',
    qty: '1 kg / 25 kg / 50 kg',
    image: require('../../assets/images/prolist.png'),
  },
  {
    id: '5',
    name: 'Subabul Seeds',
    qty: '1 kg / 25 kg / 50 kg',
    image: require('../../assets/images/prolist.png'),
  },
  {
    id: '6',
    name: 'Drumstick Seeds',
    qty: '1 kg / 25 kg / 50 kg',
    image: require('../../assets/images/prolist.png'),
  },
];

const ProductListScreen = ({ navigation, route }) => {
  const { brandId, brandName } = route.params;
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const { products, loading, total } = useSelector((state) => state.brand);
  console.log('Products from Redux:', products);

  // const filteredProducts = useMemo(() => {
  //   return products.filter(item =>
  //     item.name.toLowerCase().includes(search.toLowerCase()),
  //   );
  // }, [search]);


  const handleDelete = (productId) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteProduct(productId));
          },
        },
      ]
    );
  };

  const filteredProducts = products.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => {
    console.log('Rendering product:', item);
    return (
      <View style={styles.card}>
        <View style={styles.leftSection}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.images[0]?.url }} style={styles.productImage} />
          </View>

          <View style={styles.textContainer}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={styles.productName}
            >
              {item.name}
            </Text>

            <Text style={styles.qtyText}>Qty: {item.quantity} {item?.unit} </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.editButton}
            onPress={() => {
              navigation?.navigate('AddProductDetailsScreen', { product: item });
            }}
          >
            <Feather name="edit" size={22} color="#5E8E1A" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.deleteButton}
            onPress={() => handleDelete(item._id)}
          >
            <MaterialIcons name="delete-outline" size={22} color="#D32F2F" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };


  useFocusEffect(
    useCallback(() => {
      if (brandId) {
        dispatch(getMyProductsByBrand({ brandId }));
      }
    }, [dispatch, brandId])
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />



      <ProductHeader title='Shri Sai Forestry' showShare={false} navigation={navigation} />

      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={22}
          color="#7F7F7F"
        />

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search products name"
          placeholderTextColor="#9B9B9B"
          style={styles.searchInput}
        />
      </View>

      <View style={styles.listWrapper}>
        <FlatList
          data={filteredProducts}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.addButton}
        onPress={() => navigation?.navigate('AddProductDetailsScreen')}
      >
        <Text style={styles.addButtonText}>Add New Product</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProductListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF3EB',
    // paddingHorizontal: width * 0.04,
  },

  headerRow: {
    marginTop: height * 0.02,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height * 0.03,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: width * 0.055,
    fontWeight: '700',
    color: '#202020',
    textAlign: 'center',
  },

  searchContainer: {
    // width: '100%',
    marginHorizontal: width * 0.04,
    minHeight: height * 0.055,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.025,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 6,
    elevation: 2,
  },

  searchInput: {
    flex: 1,
    marginLeft: width * 0.03,
    fontSize: 14,
    color: '#202020',
    paddingVertical: 0,
    fontWeight: '400',
  },

  listWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingTop: 10,
    paddingHorizontal: 8,
    marginHorizontal: width * 0.04,
    // marginBottom: height * 0.02,
    overflow: 'hidden',
  },

  listContent: {
    paddingBottom: height * 0.02,
  },

  card: {
    backgroundColor: '#FBFBFB',
    borderWidth: 1.2,
    borderColor: '#D9D9D9',
    borderRadius: 12,
    paddingHorizontal: width * 0.025,
    paddingVertical: height * 0.008,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height * 0.016,
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },

  imageContainer: {
    width: width * 0.16,
    height: width * 0.16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  productImage: {
    width: '70%',
    height: '85%',
    resizeMode: 'contain',
  },

  textContainer: {
    flex: 1,
    marginLeft: width * 0.04,
  },

  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#202020',
    marginBottom: 4,
  },

  qtyText: {
    fontSize: 12,
    color: '#707070',
    fontWeight: '400',
  },

  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF5E6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addButton: {
    marginHorizontal: width * 0.04,
    // height: height * 0.078,
    backgroundColor: '#4C7A1E',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.025,
    marginBottom: height * 0.032,
    shadowColor: '#4C7A1E',
    shadowOpacity: 0.25,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 12,
    elevation: 5,
  },

  addButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    paddingVertical: height * 0.016,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FDECEC',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

