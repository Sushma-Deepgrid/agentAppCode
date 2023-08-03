import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Profile, SettingsDetail} from '../screens';
import {ROUTES} from '../constants';

const Stack = createStackNavigator();

function ProfileNavigator() {
  console.log(Stack);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={ROUTES.LOGIN}>
      <Stack.Screen name={ROUTES.PROFILE} component={Profile} />
      <Stack.Screen name={ROUTES.PROFILE_DETAIL} component={SettingsDetail} />
    </Stack.Navigator>
  );
}

export default ProfileNavigator;
