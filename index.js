import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { enableScreens } from 'react-native-screens';
enableScreens();

import {enableLatestRenderer} from 'react-native-maps';

enableLatestRenderer();
console.log("'BhuviRealtech'",appName);

AppRegistry.registerComponent('BhuviRealtech', () => App);
