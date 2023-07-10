import * as React from 'react';
import {SafeAreaView, Text} from 'react-native';
import {DrawerActions, NavigationContainer} from '@react-navigation/native';
import AuthNavigator from './src/Navigation/AuthNavigator';
import * as SplashScreen from 'expo-splash-screen';



export default function App() {
  SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 5000);
  // isAuthenticated = is...
  return (
    <NavigationContainer>
      {/* {isAuthenticated ? AuthNavigator : DrawerNavigator } */}
      <AuthNavigator />
    </NavigationContainer>
  );
}
