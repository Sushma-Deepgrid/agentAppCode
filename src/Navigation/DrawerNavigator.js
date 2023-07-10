import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {COLORS, ROUTES,IMGS} from '../constants';
import {Tasks, Notifications,Profile,Login} from '../screens';
import BottomTabNavigator from './BottomTabNavigator';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import CustomDrawer from '../components/CustomDrawer';
import { Image, Text, TouchableOpacity,View,Platform} from 'react-native';
import TasksNavigator from './TasksNavigator';
import ProfileNavigator from './ProfileNavigator';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import AuthNavigator from './AuthNavigator';
const Drawer = createDrawerNavigator();

function DrawerNavigator({navigation}) {
  return (

    
    <Drawer.Navigator useLegacyImplementation
      drawerContent={props => <CustomDrawer {...props} />}
         screenOptions={({ navigation }) => ({
       drawerActiveBackgroundColor: COLORS.primary,
        drawerActiveTintColor: COLORS.white,
        headerStyle: {
          backgroundColor: COLORS.primary,
          height: 50,
          borderRadius:30
        },
         headerLeft: () => (
              // App Logo
              <Image
                style={{
                  width: 100,
                  height: 50,
                  margin:20
                }}
                source={IMGS.LOGO}
                resizeMode="contain"
              />
            ),
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.toggleDrawer()} >
            <FontIcon name="bars" size={20} color={COLORS.dark} style={{marginRight:15}} />
          </TouchableOpacity>
        ),
        headerTitle: () =>(
          <View>
          </View>
        )
      })}
      >
      <Drawer.Screen
        name={ROUTES.HOME_DRAWER}
        component={BottomTabNavigator}
          
        options={{
          title: 'Home',
          drawerIcon: ({focused, color, size}) => (
            <Icon name="home-sharp" size={18} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name={ROUTES.TASKS_DRAWER}
        component={TasksNavigator}
        options={{
          title: 'Tasks',
          drawerIcon: ({focused, color, size}) => (
            <IconFontAwesome5 name="tasks" size={18} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name={ROUTES.PROFILE_DRAWER}
        component={ProfileNavigator}
        options={{
          title: 'Profile',
          drawerIcon: ({focused, color, size}) => (
             <IconFontAwesome5 name="user-circle" size={18} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name={ROUTES.NOTIFICATIONS_DRAWER}
        component={Notifications}
        options={{
          title: 'Notifications',
          drawerIcon: ({focused, color, size}) => (
            <Icon name="notifications" size={18} color={color} />
          ),
        }}
      />

      <Drawer.Screen
      name={ROUTES.LOGIN}
        component={AuthNavigator}
        
        options={{
          headerShown: false,
          title: 'Logout',
          drawerIcon: ({focused, color, size}) => (
           <TouchableOpacity
        onPress={() => navigation.navigate(ROUTES.LOGIN)}
       
        activeOpacity={0.8}>
        <IconMaterialCommunityIcons name="logout" size={18} color={color} />
      </TouchableOpacity>
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
