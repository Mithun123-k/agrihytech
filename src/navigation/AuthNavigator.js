import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import OtpScreen from '../screens/auth/OtpScreen';
import IntroScreen from '../screens/auth/IntroScreen';
import RegisterScreen from '../screens/auth/RegisterScreen'
import PremiumScreen from '../screens/auth/PremiumScreen'
import YourProductsScreen from '../screens/product/YourProductsScreen'
import { useSelector } from 'react-redux';
import { CompanySubscription } from '../screens/company/CompanyAccount';


const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  const isCompany = useSelector(state => state.auth.user?.role === 'COMPANY');
  return (
    <Stack.Navigator initialRouteName="Intro" screenOptions={{headerShown: false, animation: 'slide_from_right',}}>
      <Stack.Screen name="Intro" component={IntroScreen} />
      {/* <Stack.Screen name="YourProductsScreen" component={YourProductsScreen} /> */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name='RegisterScreen' component={RegisterScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen name='PremiumScreen' component={isCompany ? CompanySubscription : PremiumScreen} />

    </Stack.Navigator>
  );
};

export default AuthNavigator;
