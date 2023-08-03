import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Tasks, TasksDetail,PropertyVisit, GeoFencing,ECService,Images,Documents,EnterLocation} from '../screens';
import {ROUTES} from '../constants';

const Stack = createStackNavigator();

function TasksNavigator() {
  console.log(Stack);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={ROUTES.LOGIN}>
      <Stack.Screen name={ROUTES.TASKS} component={Tasks} />
      <Stack.Screen name={ROUTES.TASKS_DETAIL} component={TasksDetail} />
       <Stack.Screen name={ROUTES.PROPERTYVISIT} component={PropertyVisit} />
        <Stack.Screen name={ROUTES.ECSERVICE} component={ECService} />
       <Stack.Screen name={ROUTES.GEOFENCING} component={GeoFencing} />
       <Stack.Screen name={ROUTES.IMAGES} component={Images} />
       <Stack.Screen name={ROUTES.DOCUMENTS} component={Documents} />
       <Stack.Screen name={ROUTES.ENTERLOCATION} component={EnterLocation} />
       
    </Stack.Navigator>
  );
}

export default TasksNavigator;
