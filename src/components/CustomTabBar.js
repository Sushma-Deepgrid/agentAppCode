import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {BottomTabBar} from '@react-navigation/bottom-tabs';
import {COLORS} from '../constants';

const CustomTabBar = props => {
  return (
    <View>
      <View style={styles.tabBar} />
      <BottomTabBar {...props} />
    </View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    right: 10,
    left: 10,
    bottom: 38,
    height: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    
    
  },
});
