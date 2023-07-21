import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { COLORS, ROUTES, IMGS } from '../constants';
import { Home, Tasks, Notifications, Settings } from '../screens';
import Icon from 'react-native-vector-icons/Ionicons';
import ProfileNavigator from './ProfileNavigator';
import TasksNavigator from './TasksNavigator';
import DashboardNavigator from './DashboardNavigator';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, Text } from 'react-native';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarInactiveTintColor: COLORS.white,
          tabBarStyle: styles.tabBarStyle,
          tabBarActiveTintColor: COLORS.dark,
          tabBarIcon: ({ color, size, focused }) => {
            let iconName;

            if (route.name === ROUTES.HOME_TAB) {
              iconName = focused ? 'home' : 'home';
            } else if (route.name === ROUTES.PROFILE_NAVIGATOR) {
              iconName = focused ? 'user-circle' : 'user-circle';
            } else if (route.name === ROUTES.TASKS_NAVIGATOR) {
              iconName = focused ? 'tasks' : 'tasks';
            } else if (route.name === ROUTES.NOTIFICATIONS) {
              iconName = focused
                ? 'bell'
                : 'bell';
            }

            return <IconFontAwesome5 name={iconName} size={26} color={color} />;
          },
        })}>
        <Tab.Screen
          name={ROUTES.HOME_TAB}
          component={Home}
          options={{
            
            title: 'Home',
            headerStyle: {
              backgroundColor: COLORS.primary,
              borderRadius: 30,
              height: 60,
            },
            headerTitle: () => (
              // App Logo
              <Image
                style={{
                  width: 200,
                  height: 50,
                  marginLeft: Platform.OS === 'ios' ? 0 : 80,
                }}
                source={IMGS.LOGO}
                resizeMode="contain"
              />
            ),
            headerRight: () => {
              return (
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                  <Icon
                    name={Platform.OS === 'ios' ? 'ios-menu' : 'md-menu'}
                    size={30}
                    color={COLORS.dark}
                    style={{ marginRight: 10 }}
                  />
                </TouchableOpacity>
              );
            },
          }}
        />
        <Tab.Screen
          name={ROUTES.TASKS_NAVIGATOR}
          component={TasksNavigator}
          options={{
            tabBarLabel: 'Tasks',
            title: 'Tasks',
            
            headerStyle: {
              backgroundColor: COLORS.primary,
              borderRadius: 30,
              height: 60,
            },
            headerTitle: () => (
              // App Logo
              <Image
                style={{
                  width: 200,
                  height: 50,
                  marginLeft: Platform.OS === 'ios' ? 0 : 80,
                }}
                source={IMGS.LOGO}
                resizeMode="contain"
              />
            ),
            headerRight: () => {
              return (
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                  <IconFontAwesome5 name="tasks"
                    size={30}
                    color={COLORS.dark}
                    style={{ marginRight: 10 }}
                  />
                </TouchableOpacity>
              );
            },
          }}
        />

        <Tab.Screen
          name={ROUTES.PROFILE_NAVIGATOR}
          component={ProfileNavigator}
          options={{
            tabBarLabel: 'Profile',
            title: 'Profile',
            

            headerStyle: {
              backgroundColor: COLORS.primary,
              borderRadius: 30,
              height: 60,
            },
            headerTitle: () => (
              // App Logo
              <Image
                style={{
                  width: 200,
                  height: 50,
                  marginLeft: Platform.OS === 'ios' ? 0 : 80,
                }}
                source={IMGS.LOGO}
                resizeMode="contain"
              />
            ),
            headerRight: () => {
              return (
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                  <Icon
                    name={Platform.OS === 'ios' ? 'ios-menu' : 'md-menu'}
                    size={30}
                    color={COLORS.dark}
                    style={{ marginRight: 10 }}
                  />
                </TouchableOpacity>
              );
            },
          }}
        />
        <Tab.Screen
          name={ROUTES.NOTIFICATIONS}
          component={Notifications}
          options={{
            tabBarLabel: 'Notifications',
            title: 'Notifications',
            
            headerStyle: {
              backgroundColor: COLORS.primary,
              borderRadius: 30,
              height: 60,
            },
            headerTitle: () => (
              // App Logo
              <Image
                style={{
                  width: 200,
                  height: 50,
                  marginLeft: Platform.OS === 'ios' ? 0 : 80,
                }}
                source={IMGS.LOGO}
                resizeMode="contain"
              />
            ),
            headerRight: () => {
              return (
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                  <Icon
                    name={Platform.OS === 'ios' ? 'ios-menu' : 'md-menu'}
                    size={30}
                    color={COLORS.dark}
                    style={{ marginRight: 10 }}
                  />
                </TouchableOpacity>
              );
            },
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

export default BottomTabNavigator;

const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    backgroundColor: COLORS.primary,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 20,
    height: 70,
  },
});
