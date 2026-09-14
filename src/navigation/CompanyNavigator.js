import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/home/HomeScreen';
import SearchScreen from '../screens/search/SearchScreen';
import CategoryScreen from '../screens/category/CategoryScreen';
import { CompanyDealers, CompanyDealerDetails, CompanyProfile, CompanySettings, CompanySubscription } from '../screens/company/CompanyAccount';
import { CompanyProducts, CompanyProductForm, CompanyProductDetails } from '../screens/company/CompanyCatalog';
import AnudanYojanaScreen, { AnudanYojanaDetails } from '../screens/anudan/AnudanYojanaScreen';
import SelectLocationScreen from '../screens/mandibhav/SelectLocationScreen';
import SelectMandiScreen from '../screens/mandibhav/SelectMandiScreen';
import MandiBhavScreen from '../screens/mandibhav/MandiBhavScreen';
import UserProductsScreen from '../screens/product/UserProductScreen';
import UserBrandScreen from '../screens/home/UserBrandScreen';
import ProductDetailsScreen from '../screens/product/ProductDetailsScreen';
import { useLanguage } from '../i18n/LanguageContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const icons = { Home: 'home', Search: 'search', Category: 'grid', Profile: 'person' };
function CompanyTabs() {
  const { t } = useLanguage();
  return <Tab.Navigator screenOptions={({ route }) => ({
    headerShown: false, tabBarShowLabel: true, tabBarActiveTintColor: '#4A7C1C', tabBarInactiveTintColor: '#777',
    tabBarStyle: styles.tabBar, tabBarLabelStyle: styles.tabBarLabel, tabBarLabel: t(route.name),
    tabBarIcon: ({ focused, color }) => <Ionicons name={`${icons[route.name]}${focused ? '' : '-outline'}`} size={26} color={color} />,
  })}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="Category" component={CategoryScreen} />
    <Tab.Screen name="Profile" component={CompanyProfile} />
  </Tab.Navigator>;
}
export default function CompanyNavigator() {
  return <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="CompanyTabs" component={CompanyTabs} />
    <Stack.Screen name="CompanyProducts" component={CompanyProducts} />
    <Stack.Screen name="CompanyProductForm" component={CompanyProductForm} />
    <Stack.Screen name="CompanyProductDetails" component={CompanyProductDetails} />
    <Stack.Screen name="UserProduct" component={UserProductsScreen} />
    <Stack.Screen name="UserBrandScreen" component={UserBrandScreen} />
    <Stack.Screen name="ProductDetailsScreen" component={ProductDetailsScreen} />
    <Stack.Screen name="CompanyDealers" component={CompanyDealers} />
    <Stack.Screen name="CompanyDealerDetails" component={CompanyDealerDetails} />
    <Stack.Screen name="CompanySettings" component={CompanySettings} />
    <Stack.Screen name="CompanySubscription" component={CompanySubscription} />
    <Stack.Screen name="AnudanYojanaScreen" component={AnudanYojanaScreen} />
    <Stack.Screen name="AnudanYojanaDetails" component={AnudanYojanaDetails} />
    <Stack.Screen name="SelectLocationScreen" component={SelectLocationScreen} />
    <Stack.Screen name="SelectMandiScreen" component={SelectMandiScreen} />
    <Stack.Screen name="MandiBhavScreen" component={MandiBhavScreen} />
  </Stack.Navigator>;
}
const styles = StyleSheet.create({
  tabBar: { position: 'absolute', bottom: 20, left: 20, right: 20, elevation: 10, backgroundColor: '#fff', borderRadius: 25, height: 80, paddingBottom: 10, paddingTop: 10, marginHorizontal: 15 },
  tabBarLabel: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
});
