import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import SplashScreen from '../screens/auth/SplashScreen';

import { loadUser, logout } from '../features/auth/authSlice';
import { setLogoutHandler } from '../services/logoutHandler';

const AppNavigator = () => {
  const dispatch = useDispatch();

  const { isAuthenticated, appLoading, user } = useSelector(
    (state) => state.auth
  );
  console.log(user?.role)

 const [minTimeDone, setMinTimeDone] = useState(false);

useEffect(() => {
  dispatch(loadUser());

  setTimeout(() => {
    setMinTimeDone(true);
  }, 3000);

  setLogoutHandler(() => {
    dispatch(logout());
  });
}, []);


// 🔥 BOTH conditions must finish
if (appLoading || !minTimeDone) {
  return <SplashScreen />;
}

  return (
    <NavigationContainer>
     {isAuthenticated &&
    (
      user?.role !== "B2B" ||
      user?.subscription?.isActive === true
    ) ? (
      <MainNavigator />
    ) : (
      <AuthNavigator />
    )}
    </NavigationContainer>
  );
};

export default AppNavigator;