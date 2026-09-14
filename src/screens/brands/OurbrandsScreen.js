import AppTextInput from '../../components/common/AppTextInput';
import AppText from '../../components/common/AppText';
import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  StatusBar,
  Dimensions,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import ProductHeader from '../../components/product/ProductHeader';
import {
  getAssignedBrandsAPI,
  getAssignableBrandsAPI,
  updateAssignedBrandsAPI,
} from '../../features/brands/brandAPI';

const { width, height } = Dimensions.get('window');

const OurbrandsScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [myBrands, setMyBrands] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [brandModal, setBrandModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadBrands = async () => {
    setLoading(true);
    try {
      const [assignedResponse, availableResponse] = await Promise.all([
        getAssignedBrandsAPI(),
        getAssignableBrandsAPI(),
      ]);
      const user = assignedResponse.data?.user || {};
      const assigned = (user.dealerBrands || []).filter(Boolean);
      const registeredCategories = (user.categories || []).map(name => name.toLowerCase());
      const eligibleBrands = (availableResponse.data?.brands || []).filter(brand =>
        !registeredCategories.length ||
        (brand.category?.name && registeredCategories.includes(brand.category.name.toLowerCase())),
      );
      setMyBrands(assigned);
      setAvailableBrands(eligibleBrands);
      setSelectedIds(assigned.map(brand => brand._id));
    } catch (error) {
      Alert.alert(
        'Unable to load brands',
        error.response?.data?.error || error.response?.data?.message || 'Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const value = search.trim().toLowerCase();
    return value
      ? myBrands.filter(item => item.name?.toLowerCase().includes(value))
      : myBrands;
  }, [myBrands, search]);

  const saveAssignments = async () => {
    setSaving(true);
    try {
      await updateAssignedBrandsAPI(selectedIds);
      const assigned = availableBrands.filter(brand => selectedIds.includes(brand._id));
      setMyBrands(assigned);
      setBrandModal(false);
    } catch (error) {
      Alert.alert(
        'Unable to update brands',
        error.response?.data?.error || error.response?.data?.message || 'Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.leftSection}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
          </View>

          <View style={styles.textContainer}>
            <AppText
              numberOfLines={1}
              adjustsFontSizeToFit
              style={styles.productName}
            >
              {item.name}
            </AppText>

            <AppText style={styles.qtyText}>Category: {item.category?.name}</AppText>
          </View>
        </View>

        <View style={styles.assignedBadge}>
          <Feather name="check" size={15} color="#5E8E1A" />
          <AppText style={styles.assignedText}>Selected</AppText>
        </View>
      </View>
    );
  };

  useEffect(() => {
    loadBrands();
  }, []);

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

        <AppTextInput
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
          ListEmptyComponent={
            loading ? (
              <ActivityIndicator size="large" color="#4C7A1E" style={styles.loader} />
            ) : (
              <View style={styles.emptyState}>
                <Feather name="briefcase" size={36} color="#A4AFA0" />
                <AppText style={styles.emptyTitle}>No brands selected</AppText>
                <AppText style={styles.emptyText}>Select brands available for your registered categories.</AppText>
              </View>
            )
          }
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.addButton}
        onPress={() => {
          setSelectedIds(myBrands.map(brand => brand._id));
          setBrandModal(true);
        }}
      >
        <AppText style={styles.addButtonText}>Manage Brands</AppText>
      </TouchableOpacity>

      <Modal visible={brandModal} transparent animationType="slide" onRequestClose={() => setBrandModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <AppText style={styles.modalTitle}>Select Brands</AppText>
                <AppText style={styles.modalSubtitle}>Choose Company and Admin brands.</AppText>
              </View>
              <TouchableOpacity onPress={() => setBrandModal(false)}>
                <Feather name="x" size={24} color="#202020" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={availableBrands}
              keyExtractor={item => item._id}
              contentContainerStyle={styles.optionList}
              renderItem={({ item }) => {
                const selected = selectedIds.includes(item._id);
                return (
                  <TouchableOpacity
                    style={[styles.brandOption, selected && styles.brandOptionSelected]}
                    onPress={() => setSelectedIds(current => selected
                      ? current.filter(id => id !== item._id)
                      : [...current, item._id])}
                  >
                    <Image source={{ uri: item.image }} style={styles.optionImage} />
                    <View style={styles.optionText}>
                      <AppText style={styles.optionName}>{item.name}</AppText>
                      <AppText style={styles.optionCategory}>{item.category?.name || 'Uncategorized'}</AppText>
                    </View>
                    <Feather name={selected ? 'check-square' : 'square'} size={22} color={selected ? '#4C7A1E' : '#9B9B9B'} />
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={<AppText style={styles.noOptions}>No Company or Admin brands are available.</AppText>}
            />
            <TouchableOpacity disabled={saving} style={styles.saveButton} onPress={saveAssignments}>
              {saving ? <ActivityIndicator color="#FFFFFF" /> : <AppText style={styles.saveButtonText}>Save Selection</AppText>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    flexGrow: 1,
  },

  loader: {
    marginTop: 60,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#202020',
  },

  emptyText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: '#707070',
    textAlign: 'center',
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

  assignedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF5E6',
    borderRadius: 14,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },

  assignedText: {
    marginLeft: 4,
    fontSize: 11,
    fontWeight: '600',
    color: '#5E8E1A',
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    maxHeight: '78%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#202020',
  },

  modalSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#707070',
  },

  optionList: {
    paddingBottom: 8,
  },

  brandOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },

  brandOptionSelected: {
    borderColor: '#5E8E1A',
    backgroundColor: '#F5FAF0',
  },

  optionImage: {
    width: 48,
    height: 48,
    borderRadius: 9,
    backgroundColor: '#F3F3F3',
    resizeMode: 'contain',
  },

  optionText: {
    flex: 1,
    marginHorizontal: 12,
  },

  optionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202020',
  },

  optionCategory: {
    marginTop: 3,
    fontSize: 12,
    color: '#707070',
  },

  noOptions: {
    paddingVertical: 40,
    textAlign: 'center',
    color: '#707070',
  },

  saveButton: {
    minHeight: 52,
    marginTop: 10,
    borderRadius: 14,
    backgroundColor: '#4C7A1E',
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

