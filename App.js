import React, {useEffect}  from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaView, Text } from 'react-native';
import RNBootSplash from "react-native-bootsplash";
import { Provider } from 'react-redux';
import { store } from './src/apps/store';
import { LanguageProvider } from './src/i18n/LanguageContext';

const App = () => {

  useEffect(()=>{
  setTimeout(()=>{
    RNBootSplash.hide({fade:true});
  },2000);
},[]);

  return (
    // <SafeAreaView style={{ flex: 1 }}>
      <LanguageProvider>
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      </LanguageProvider>
    // </SafeAreaView>
  )

};

export default App;
