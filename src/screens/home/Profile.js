import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Alert, Modal, Pressable } from 'react-native';
import { COLORS, ROUTES, IMGS } from '../../constants';
import Button from '../../components/Button';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { UserToken,UserFirstName,UserLastName,UserMobile,UserId} from '../../../store';
import axios from 'axios';
import { API_URL } from '@env';

const Profile = () => {

  const { userToken } = UserToken.useState((s) => s);
  const { userId } = UserId.useState((s) => s);
 

  const [number, onChangeNumber] = useState('');
  const [firstName, onChangeFirstName] = useState('');
  const [lastName, onChangeLastName] = useState('');
  const [updatemodalVisible, setUpdateModalVisible] = useState(false);

  useEffect(() => {
  async function fetchServicesData() {
    
    try {
      const response = await axios.get(
        `${API_URL}/user/get-user-profile/${userId}`,
        
        {
          headers: {
            Authorization: "Bearer " + userToken,
          },
        }
      );
  
      console.log(response.data.userProfile,"Profile Data",response.data.userProfile.current_town);
      onChangeNumber(response.data.userProfile.mobile)
      onChangeFirstName(response.data.userProfile.first_name)
      onChangeLastName(response.data.userProfile.last_name)
    } catch (error) {
      console.error(error);
      // window.alert("Can't Assign Same Track Name")
    }
  }
  fetchServicesData();
}, []);


  function UpdateProfileFunction() {
    console.log(number, firstName, lastName)
    
     async function fetchTrackApiData() {
      
      const obj={
        mobile:number
      }
      try {
        const response = await axios.put(
          `${API_URL}/user/edit-user-profile/${userId}`,obj,
          { headers: {
            'Authorization': 'Bearer ' + userToken
          }}
        );

        console.warn(response.data.userProfile);
       onChangeNumber(response.data.userProfile.mobile)
        setUpdateModalVisible(true)
      } catch (error) {
        console.warn(error);
        // window.alert("Can't Assign Same Track Name")
      }
    }
    fetchTrackApiData();
  }
  return (
    <View style={styles.maincontainer}>
      <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', width: '100%', alignItems: 'center' }}>
        <Image
          style={styles.profileImg}
          source={IMGS.PROFILE1}
          resizeMode="contain"
        />


      </View>
      <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', marginTop: 10 }}>
        <TextInput   style={styles.textInput} value={number} onChangeText={onChangeNumber} placeholder="Mobile Number" keyboardType={'numeric'} />
      </View>

      <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', marginTop: 15 }}>
        <TextInput  style={styles.textInput}
      placeholderTextColor="black"   value={firstName}  placeholder="First Name" editable={false}  />
      </View>

      <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', marginTop: 15 }}>
        <TextInput    style={styles.textInput}
      placeholderTextColor="black" editable={false}  value={lastName} placeholder="Last Name" />
      </View>

      <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', marginTop: 50 }}>
        <Button textColor="white" bgColor="#34447d" btnLabel="Update" Press={UpdateProfileFunction} />
      </View>

      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={updatemodalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setUpdateModalVisible(!updatemodalVisible);
          }}>
          <View style={styles.centeredView}>

            <View style={styles.modalView}>
              <Pressable
                style={{ top: 10, right: 10, position: 'absolute' }}
                onPress={() => setUpdateModalVisible(!updatemodalVisible)}>
                <EntypoIcon name="cross" size={22} color={COLORS.white} />
              </Pressable>
              <Text style={styles.modalText}>Profile Updated Successfully</Text>

            </View>
          </View>
        </Modal>

      </View>
    </View>
  );
};

export default Profile;


const styles = StyleSheet.create({

  maincontainer: {
    padding: 20,
    backgroundColor: '#fff',
    height: '100%'
  },
  profileImg: {
    width: 120,
    height: 120,
    margin: 20,
    borderRadius: 150 / 2,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: COLORS.white,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    color: 'white'
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold'
  },
  textInput: {
    borderRadius: 15,
    fontSize: 20,
    borderColor: '#808080', 
    paddingHorizontal: 10, 
    borderWidth: 2, 
    width:'80%', 
    padding:10,
    color:COLORS.black
  }
});