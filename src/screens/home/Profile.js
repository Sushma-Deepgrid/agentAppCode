import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Alert, Modal, Pressable } from 'react-native';
import { COLORS, ROUTES, IMGS } from '../../constants';
import Field from '../../components/Field';
import Button from '../../components/Button';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { UserToken,UserFirstName,UserLastName,UserMobile,UserId} from '../../../store';
import axios from 'axios';
const Profile = () => {

  const { userToken } = UserToken.useState((s) => s);
  const { userId } = UserId.useState((s) => s);
  const { userFirstName } = UserFirstName.useState((s) => s);
  const { userLastName } = UserLastName.useState((s) => s);
  const { userMobile } = UserMobile.useState((s) => s);

  const [number, onChangeNumber] = useState(userMobile);
  const [firstName, onChangeFirstName] = useState(userFirstName);
  const [lastName, onChangeLastName] = useState(userLastName);
  const [updatemodalVisible, setUpdateModalVisible] = useState(false);

  function UpdateProfileFunction() {
    console.log(number, firstName, lastName)
    
     async function fetchTrackApiData() {
      
      const obj={
        mobile:number
      }
      try {
        const response = await axios.put(
          `https://aagama2.adgrid.in/user/edit-user-profile/${userId}`,obj,
          { headers: {
            'Authorization': 'Bearer ' + userToken
          }}
        );

        // await  console.warn(response.data);
        setUpdateModalVisible(true)
      } catch (error) {
        await  console.warn(error);
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
        <Field value={number} onChangeText={onChangeNumber} placeholder="Mobile Number" keyboardType={'numeric'} />
      </View>

      <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', marginTop: 15 }}>
        <Field value={firstName}  placeholder="First Name" />
      </View>

      <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', marginTop: 15 }}>
        <Field value={lastName} placeholder="Last Name" />
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
});