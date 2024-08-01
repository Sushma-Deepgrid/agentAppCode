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
  Image,
} from 'react-native';
import {ROUTES, IMGS, COLORS} from '../../constants';
import {
  AuthStore,
  UserToken,
  UserId,
  UserFirstName,
  UserLastName,
  UserMobile,
} from '../../../store';
import axios from 'axios';
import {API_URL} from '@env';
import {TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ActivityIndicator} from 'react-native';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState({name: 'Agent', value: 4});
  const [isLoading, setIsLoading] = useState(false);

  console.log("API_URL",API_URL);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  function LoginFunction() {
    console.log(email, password);
    setIsLoading(true);

    if (email !== '' && password !== '') {
      console.log('API_URL', API_URL);
      axios
        .post(`${API_URL}/auth/customer-login`, {
          email: email,
          password: password,
          user_type_category_id: selectedRole.value,
        })
        .then(response => {
          console.log(response.data, 'login');

          UserToken.update(s => ({...s, userToken: response.data.token}));

          UserId.update(s => ({...s, userId: response.data.user_id}));

          UserFirstName.update(s => ({
            ...s,
            userFirstName: response.data.first_name,
          }));

          UserLastName.update(s => ({
            ...s,
            userLastName: response.data.last_name,
          }));

          UserMobile.update(s => ({...s, userMobile: response.data.mobile}));

          console.log(response.data.user_type_id);
          setIsLoading(false);

          if (
            response.data.user_type_id === 3 ||
            response.data.user_type_id === 2
          ) {
            alert('Incorrect Email or Password');
          } else {
            navigation.navigate(ROUTES.HOME);

            AuthStore.update(s => ({...s, isLoggedIn: true}));
          }
        })
        .catch(error => {
          setIsLoading(false);
          console.log(error);
          alert('Incorrect Email or Password');
        });
    } else {
      setIsLoading(false);
      alert('Please enter both Email and Password');
    }
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <View>
          <Image
            style={{width: 256, height: 128, marginBottom: 20}}
            source={IMGS.LOGOLOGIN}
            resizeMode="contain"
          />
        </View>
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          <>
            <View
              style={{width: '100%', marginBottom: 30, alignItems: 'center'}}>
              <TextInput
                value={email}
                mode="outlined"
                style={styles.textInput}
                onChangeText={setEmail}
                placeholder="Email or Mobile Number"
                keyboardType="email-address"
              />
            </View>
            <View style={{width: '100%', alignItems: 'center'}}>
              <TextInput
                mode="outlined"
                value={password}
                style={styles.textInput}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry={!isPasswordVisible} // toggle based on state
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                style={{position: 'absolute', right: 50, zIndex: 0, top: 15}}>
                <Icon
                  name={isPasswordVisible ? 'eye' : 'eye-slash'}
                  color="black"
                  size={24}
                />
              </TouchableOpacity>
            </View>
        

        <View
          style={{
            alignItems: 'flex-end',
            width: '80%',
            paddingRight: 16,
            marginBottom: 30,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.FORGOT_PASSWORD)}>
            <Text style={{color: '#808080', fontSize: 16, fontWeight: 'bold'}}>
              Forgot Password ?
            </Text>
          </TouchableOpacity>
        </View>
        </>
        )}
        <Button
          textColor="white"
          bgColor="#34447d"
          btnLabel={isLoading ? 'Loading...' : 'Login'}
          Press={LoginFunction}
        />

        {/* Commented out section
        <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', marginTop: 30 }}>
          <Text style={{ marginRight: 5 }}>Don't have an account ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.SIGNUP)}>
            <Text style={{ color: '#34447d', fontWeight: 'bold' }}>Signup</Text>
          </TouchableOpacity>
        </View>
        */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    backgroundColor: 'white',
    width: '80%',
  },
});

export default Login;
