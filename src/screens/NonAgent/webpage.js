import * as React from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';

export default function Webpage({navigation}) {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'https://bhuvi.deepgrid.in/authentication/login' }}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
