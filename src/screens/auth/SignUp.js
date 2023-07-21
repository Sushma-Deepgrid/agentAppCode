/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-native/no-inline-styles */
import Raect from 'react'
import Field from '../../components/Field'
import Button from '../../components/Button'
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  Image
} from 'react-native'

const SignUp = (props) => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        
        <View style={{ width: '100%', marginBottom: 30, alignItems: 'center' }}>
          <Field placeholder="Email/ Username" keyboardType={'email-address'} />
        </View>
        <View style={{ width: '100%', alignItems: 'center' }}>
          <Field placeholder="Password" secureTextEntry={true} />
        </View>
        <View
          style={{
            alignItems: 'flex-end',
            width: '80%',
            paddingRight: 16,
            marginBottom: 30
          }}
        >
          <Text style={{ color: '#808080', fontSize: 16, fontWeight: 'bold' }}>
            Forgot Password ?
          </Text>
        </View>
        <Button textColor="white" bgColor="#34447d" btnLabel="SignUp" />
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row',
            marginTop: 30
          }}
        >
          <Text style={{ marginRight: 5 }}>Already have an account ?</Text>
          <TouchableOpacity onPress={() => props.navigation.navigate('Login')}>
            <Text style={{ color: '#34447d', fontWeight: 'bold' }}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
export default SignUp
