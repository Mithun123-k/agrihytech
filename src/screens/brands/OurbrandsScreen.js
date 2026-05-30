import React, { useMemo, useState, useEffect } from 'react';
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
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import ProductHeader from '../../components/product/ProductHeader';
import AddBrandModal from './AddBrandModal';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMyBrands,
  createBrand,
  updateBrand
} from '../../features/brands/brandSlice';
import { getCategories } from '../../features/category/categorySlice';

const { width, height } = Dimensions.get('window');

const productsData = [
  {
    id: '1',
    name: 'Teak Seeds',
    cat: 'fertilizer',
    image: require('../../assets/images/prolist.png'),
  },
  {
    id: '2',
    name: 'African Mahogany Seeds',
    cat: 'fertilizer',
    image: require('../../assets/images/prolist.png'),
  },
  {
    id: '3',
    name: 'Super Napier Grass Seeds',
    cat: 'fertilizer',
    image: require('../../assets/images/prolist.png'),
  },
  {
    id: '4',
    name: 'Gliricidia Sepium Seeds',
    cat: 'fertilizer',
    image: require('../../assets/images/prolist.png'),
  },
  {
    id: '5',
    name: 'Subabul Seeds',
    cat: 'fertilizer',
    image: require('../../assets/images/prolist.png'),
  },
  {
    id: '6',
    name: 'Drumstick Seeds',
    cat: 'fertilizer',
    image: require('../../assets/images/prolist.png'),
  },
];

const CATEGORY_OPTIONS = [
  { label: 'Seeds', value: 'Seeds' },
  { label: 'Fertilizers', value: 'Fertilizers' },
  { label: 'Pesticides', value: 'Pesticides' },
  { label: 'Equipment', value: 'Equipment' },
];

// ADD THIS near CATEGORY_OPTIONS
const BRAND_OPTIONS = [
  { label: 'CropGuard', value: 'CropGuard' },
  { label: 'AgriTech', value: 'AgriTech' },
  { label: 'Kisan Power', value: 'Kisan Power' },
  { label: '+ Add New Brand', value: '__add_new__' },
];

const OurbrandsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { brands: myBrands, loading } = useSelector(
    state => state.brand
  );
  const { categories } = useSelector((state) => state.category);
  const categoryOptions = categories?.map((item) => ({
    label: item.name,
    value: item._id
  })) || [];
  const [search, setSearch] = useState('');
  const [brandModal, setBrandModal] = useState(false);
  const [brands, setBrands] = useState(BRAND_OPTIONS);
  const [newBrand, setNewBrand] = useState({
    name: '',
    category: '',
    image: null,
  });
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [modalType, setModalType] = useState("create");

  // onPress={() => {
  //   setModalType("create");
  //   setSelectedBrand(null);
  //   setBrandModal(true);
  // }}

  const handleCreateBrand = async (brand, mode) => {
    try {
      if (mode === "edit") {
        await dispatch(
          updateBrand({
            id: brand._id,
            brandData: brand
          })
        ).unwrap();

      } else {
        await dispatch(createBrand(brand)).unwrap();
      }

      dispatch(getMyBrands({ page: 1, search: "" }));
      setBrandModal(false);

    } catch (error) {
      console.log(error);
    }
  };




  const filteredProducts = useMemo(() => {
    return myBrands || [];
  }, [myBrands]);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.leftSection}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
          </View>

          <View style={styles.textContainer}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={styles.productName}
            >
              {item.name}
            </Text>

            <Text style={styles.qtyText}>Category: {item.category?.name}</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.editButton}
          onPress={() => {
            setModalType("edit");
            setSelectedBrand(item);
            setBrandModal(true);
          }}
        >
          <Feather name="edit" size={22} color="#5E8E1A" />
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    dispatch(getMyBrands({ page: 1, search }));
    dispatch(getCategories());
  }, [dispatch, search]);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />



      <ProductHeader title='Our Brands' showShare={false} navigation={navigation} />

      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={22}
          color="#7F7F7F"
        />

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search brand name"
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
        onPress={() => {
          setModalType("create");
          setSelectedBrand(null);
          setBrandModal(true);
        }}
      >
        <Text style={styles.addButtonText}>Add New Brand</Text>
      </TouchableOpacity>

      <AddBrandModal
        visible={brandModal}
        mode={modalType}
        brandData={selectedBrand}
        onClose={() => setBrandModal(false)}
        categories={categoryOptions}
        onCreate={handleCreateBrand}
      />
    </View>
  );
};

export default OurbrandsScreen;

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
});

