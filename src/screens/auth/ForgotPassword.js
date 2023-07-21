/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */
import Raect from 'react';
import Field from '../../components/Field';
import Button from '../../components/Button';
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
import {useNavigation} from '@react-navigation/native';
import {COLORS, ROUTES} from '../../constants';
const ForgotPassword = (props) => {
  const navigation = useNavigation();
  return (
    
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.container}>
     

      <View style={{marginBottom: 20}}>
        <Text style={{color:'#808080', fontSize:18, fontWeight:'bold'}}>
          Forgot Password
        </Text>
      </View>
          <View style={{width:'100%', marginBottom: 30,alignItems:'center' }}>
          <Field  placeholder="Email" keyboardType={'email-address'}/>
          </View>
          
        <Button textColor="white" bgColor="#34447d" btnLabel="Reset Password" />
        <View style={{marginTop:30}}>
          <Text style={{color:'#808080',marginRight:5, fontSize:18}}>
            Already have an account 
          </Text>
          <TouchableOpacity style={{ display:'flex',justifyContent:'center',flexDirection:'row'}} onPress={() => navigation.navigate(ROUTES.LOGIN)}>
            <Text style={{borderBottomWidth:1,width:'50%',color:'#808080', fontWeight:'bold',textAlign:'center', fontSize:18}}>
              Click Here
            </Text>
          </TouchableOpacity>
        </View>
        </View>
       
      </SafeAreaView>
   
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center'
  },
});
export default ForgotPassword;
