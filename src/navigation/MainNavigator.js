import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import SakataProductsScreen from '../screens/product/ProductScreen';
import UserProductsScreen from '../screens/product/UserProductScreen';
import BrandScreen from '../screens/home/BrandScreen';
import UserBrandScreen from '../screens/home/UserBrandScreen';
import ProductDetailsScreen from '../screens/product/ProductDetailsScreen';
import NotificationsScreen from '../screens/home/NotificationsScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen'  ;
import InfoScreen from '../screens/profile/InfoScreen'
import AddProductDetailsScreen from '../screens/product/AddProductDetailsScreen';
import YourProductsScreen from '../screens/product/YourProductsScreen';
import SubcategoriesPage from '../screens/product/SubcategoriesPage';
import ProductListScreen from '../screens/product/ProductListScreen';
import OurbrandsScreen from '../screens/brands/OurbrandsScreen';
import BrandListing from '../screens/brands/BrandListing';
import SelectLocationScreen from '../screens/mandibhav/SelectLocationScreen'
import SelectMandiScreen from '../screens/mandibhav/SelectMandiScreen'
import MandiBhavScreen from '../screens/mandibhav/MandiBhavScreen'
import PremiumScreen from '../screens/auth/PremiumScreen';
import DeleteAccountScreen from '../screens/profile/DeleteAccountScreen';



const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right', }}>
      <Stack.Screen name="Tabs" component={BottomTabs} />
      <Stack.Screen name="product" component={SakataProductsScreen} />
      <Stack.Screen name="UserProduct" component={UserProductsScreen} />
      <Stack.Screen name="BrandScreen" component={BrandScreen} />
      <Stack.Screen name="UserBrandScreen" component={UserBrandScreen} />
      <Stack.Screen name="ProductDetailsScreen" component={ProductDetailsScreen} />
      <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
      <Stack.Screen name='EditProfileScreen' component={EditProfileScreen} />
      <Stack.Screen name='InfoScreen' component={InfoScreen} />
      <Stack.Screen name="AddProductDetailsScreen" component={AddProductDetailsScreen} />
      <Stack.Screen name="YourProductsScreen" component={YourProductsScreen} />
      <Stack.Screen name="SubcategoriesPage" component={SubcategoriesPage} />
      <Stack.Screen name="ProductListScreen" component={ProductListScreen} />
      <Stack.Screen name="OurbrandsScreen" component={OurbrandsScreen} />
      <Stack.Screen name='BrandListing' component={BrandListing} />
      <Stack.Screen name='SelectLocationScreen' component={SelectLocationScreen} />
      <Stack.Screen name='SelectMandiScreen' component={SelectMandiScreen} />
      <Stack.Screen name='MandiBhavScreen' component={MandiBhavScreen} />
      <Stack.Screen name='PremiumScreen' component={PremiumScreen} />
      <Stack.Screen name='DeleteAccountScreen' component={DeleteAccountScreen} />
      


    </Stack.Navigator>
  );
};

export default MainNavigator;