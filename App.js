import React, {useEffect}  from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F6F2' }} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F6F2" translucent={false} />
      <LanguageProvider>
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      </LanguageProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  )

};

export default App;
