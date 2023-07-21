import React, {useState} from 'react';
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
import {COLORS, ROUTES,IMGS} from '../../constants';
import {useNavigation} from '@react-navigation/native';
import { AuthStore,UserToken,UserFirstName,UserId,UserLastName,UserMobile } from "../../../store";
import axios from 'axios';
const Login = ({navigation}) => {
  //  const navigation = useNavigation();
  const [email, onChangeText] = useState('');
  const [password, onChangeNumber] = useState();


  function LoginFunction(){
    console.log(email, password)
   
    if(email != '' && password != ''){
    //  navigation.navigate(ROUTES.HOME)
    axios.post(`https://aagama2.adgrid.in/auth/customer-login`, {
      email: email,
      password: password
    })
 

    .then((response) => {
      console.log(response.data.user_type_id);
      UserToken.update((s) => {
        s.userToken = response.data.token;
      });

      UserId.update((s) => {
        s.userId = response.data.user_id;
      });

      UserFirstName.update((s) => {
        s.userFirstName = response.data.first_name;
      });

      UserLastName.update((s) => {
        s.userLastName = response.data.last_name;
      });

      UserMobile.update((s) => {
        s.userMobile = response.data.mobile;
      });
     
         console.log(response.data.user_type_id)

           if(response.data.user_type_id === 3 || response.data.user_type_id === 2){
            alert("Incorrect Email or Password")
           
             
           }
           else{
            navigation.navigate(ROUTES.HOME)

            AuthStore.update((s) => {
                s.isLoggedIn = true;
              });

           }
           
         
 
      
    } )
    .catch((error) => {
      
                    console.log(error);
                    alert("Incorrect Email or Password")
    });
    }
    else{
       alert("Please enter both Email and Password")
    } 
  }
  return (
    
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.container}>
        <View>
           <Image
                style={{
                  width: 256,
                  height: 128,marginBottom:20
                }}
                source={IMGS.LOGO}
                resizeMode="contain"
              />
        </View>
          <View style={{width:'100%', marginBottom: 30,alignItems:'center' }}>
          <Field value={email} onChangeText={onChangeText} placeholder="Email or Mobile Number" keyboardType={'email-address'}/>
          </View>
          <View style={{width:'100%',alignItems:'center' }}>
        <Field value={password} onChangeText={onChangeNumber} placeholder="Password" secureTextEntry={true}  />
          </View>
          <View style={{alignItems:'flex-end', width:'80%', paddingRight:16, marginBottom: 30}}>
          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.FORGOT_PASSWORD)}>
          <Text style={{color:'#808080',fontSize:16,fontWeight:'bold'}}>
            Forgot Password ?
          </Text>
          </TouchableOpacity>
          
        </View>
        <Button textColor="white" bgColor="#34447d" btnLabel="Login" Press={LoginFunction}/>

       
         {/* <View style={{display:'flex',justifyContent:'center', flexDirection:'row',marginTop:30}}>
          <Text style={{marginRight:5}}>
            Don't have an account ? 
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.SIGNUP)}>
            <Text style={{color:'#34447d', fontWeight:'bold'}}>
              Signup
            </Text>
          </TouchableOpacity>
        </View>  */}
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
export default Login;
