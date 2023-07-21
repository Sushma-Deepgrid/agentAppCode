import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Login, ForgotPassword} from '../screens';
import {COLORS, ROUTES} from '../constants/index';
import DrawerNavigator from './DrawerNavigator';
import {SafeAreaView,StatusBar,Platform} from 'react-native';
const Stack = createStackNavigator();
// Navigator, Screen, Group

function AuthNavigator() {
  console.log(Stack);
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, backgroundColor:'white' }}>
    <Stack.Navigator screenOptions={{}} initialRouteName={ROUTES.LOGIN}>
    
      <Stack.Screen
        name={ROUTES.FORGOT_PASSWORD}
        component={ForgotPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ROUTES.LOGIN}
        component={Login}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen name={ROUTES.REGISTER} component={Register} /> */}
      <Stack.Screen
        name={ROUTES.HOME}
        component={DrawerNavigator}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
    </SafeAreaView>
  );
}

export default AuthNavigator;
