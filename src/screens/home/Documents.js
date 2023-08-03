import { StyleSheet, Text, View, TouchableOpacity, ScrollView,ActivityIndicator, Button, Linking, Image, FlatList, Modal } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { COLORS, ROUTES } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PropertyId, ServiceName, ServiceId, UserToken, DocumentsList } from '../../../store';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

const Documents = ({ navigation }) => {
  const { propertyId } = PropertyId.useState((s) => s);
  const { serviceName } = ServiceName.useState((s) => s);
  const { serviceId } = ServiceId.useState((s) => s);
  // console.warn(serviceId)
  const { userToken } = UserToken.useState((s) => s);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [Documents, setDocuments] = useState([])
  const [ExistingDocuments, setExistingDocuments] = useState([])
  const [loading, setLoading] = useState(false);

  const { documentsList } = DocumentsList.useState((s) => s);
  console.warn(documentsList)
  useEffect(() => {

    async function fetchTrackApiData() {

      // console.warn(`Bearer ${userToken}`,serviceId)
      try {
        const response = await axios.get(
          `https://aagama2.adgrid.in/user/get-task/${serviceId}`,
          {
            headers: {
              'Authorization': 'Bearer ' + userToken
            }
          }
        );

        // await console.warn(response.data.task)
        
        setExistingDocuments(response.data.task.documents);
        setDocuments(documentsList)
       
      } catch (error) {
        await console.warn(error);
        // window.alert("Can't Assign Same Track Name")
      }
    }
    fetchTrackApiData();
  }, [1]);
  const handleDocPick = async () => {

    let result = await DocumentPicker.getDocumentAsync({});
    const uploadDate = new Date();

    // alert(result.uri);
    alert(`Uploaded ${result.name} Succesfully`)
    const obj = [...Documents]

    obj.push({
      name: result.name,
      uploadedDate: uploadDate, // Include the upload date in the document object
      uri: result.uri,
    });
    setDocuments(obj)

    console.log(obj);
    console.log(Documents);

  }


 



 

  const handleLinkPress = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Cannot open URL: " + url);
    }
  };

function SaveDocs(){
  console.log(Documents)
  DocumentsList.update((s) => {
    s.documentsList = Documents;
  });
  navigation.navigate(ROUTES.ECSERVICE)
}
 
  return (
    <>
    { (loading === true || loading === 'true') ?
      <>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
            <Ionicons name="ios-arrow-back" size={24} onPress={() => navigation.goBack()} />
            <Text style={{ fontSize: 24, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', fontWeight: 'bold', marginLeft: 10 }}>
            {serviceName}
            </Text>
          </View>
     <View style={styles.loaderContainer}>
     
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
          </>
          :
          <>
          <ScrollView
            style={styles.maincontainer}>
            <View>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center',justifyContent:'space-between',marginVertical:10 }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons name="ios-arrow-back" size={24} onPress={() => navigation.goBack()} />
                <Text style={{ fontSize: 24,  fontWeight: 'bold',marginLeft:10}}>
                  Documents
                </Text>
                </View>
                 <View >
            <TouchableOpacity onPress={SaveDocs} style={{ backgroundColor: COLORS.primary, padding: 10, borderRadius: 10, paddingHorizontal: 20 }}>
              <Text style={{ color: 'white' }}>
                Done
              </Text>
            </TouchableOpacity>
          </View>
    
    
              </View>
    
    
            </View>
           



            
    
            {
              1 === 1 &&
              <View style={styles.container}>
                {
                  Documents.map((data, index) => (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} key={index}>
                      <View >
                        <Text> {data.name}</Text>
    
                      </View>
                      <View >
                        <Text>
                          {data.uploadedDate.toDateString()}
                        </Text>
    
                      </View>
    
                    </View>
    
                  ))
                }
    
                {
                  ExistingDocuments.map((data, index) => (
                    <TouchableOpacity key={index} onPress={() => handleLinkPress(`https://aagama2.adgrid.in/${data}`)}>
                      <Text>Document-{index + 1}
                       
                      </Text>
                    </TouchableOpacity>
                  ))
                }
    
                
                <TouchableOpacity onPress={handleDocPick} style={{ backgroundColor: COLORS.primary, padding: 10, borderRadius: 10, paddingHorizontal: 20,marginTop:10 }}>
              <Text style={{ color: 'white',textAlign:'center' }}>
                Select Files
              </Text>
            </TouchableOpacity>
              </View>
            }
    
            
          </ScrollView>
          
        </>
    }
    </>
    
  );
};

export default Documents;

const styles = StyleSheet.create({
  maincontainer: {
    marginBottom: 75,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  image: {
    width: 100,
    height: 100,

  },
  buttonNotActive: {
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
    padding: 10,
    marginTop: 10,
    borderColor: COLORS.primary,
    borderWidth: 2
  },
  buttonNotActiveText: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: 'bold'
  },
  buttonActive: {
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
    padding: 10,
    marginTop: 10
  },
  buttonActiveText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold'
  },
  container: {
    padding: 15,
  },
  tableHeader: {
    backgroundColor: '#DCDCDC',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Add space between images
    padding: 5, // Add padding to create spacing
  },
  photoContainer: {
    width: '50%', // Adjust the width to allocate space for three images
    aspectRatio: 1,
    marginBottom: 10, // Add margin bottom for spacing between images
    padding: 10
  },
  camera: {
    width: '100%',
    height: 400,
  },
  captureButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  captureButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  photo: {
    flex: 1,
    borderRadius: 5,
    width: '100%', // Fix the width to 100%
    height: '100%', // Fix the height to 100%
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  enlargedPhoto: {
    width: '80%',
    height: '80%',
    borderRadius: 5,
    resizeMode: 'contain'
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 30,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgb(0, 0, 0)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 5,
  },
  videoContainer: {
    width: '50%',
    aspectRatio: 1,
    marginBottom: 10,
    padding: 10
  },
  video: {
    flex: 1,
    borderRadius: 5,
    width: '100%', // Fix the width to 100%
    height: '100%', // Fix the height to 100%
  },
  deleteButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  enlargedVideoContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  enlargedVideo: {
    width: '100%',
    height: '100%',
  },
});



                                                                            // <DataTable.Header style={styles.tableHeader}>
                                                                            //         <DataTable.Title>Name</DataTable.Title>
                                                                            //         <DataTable.Title>Favourite Food</DataTable.Title>
                                                                            //         <DataTable.Title>Age</DataTable.Title>
                                                                            //       </DataTable.Header>



                                                                            // <TouchableOpacity onPress={()=>handlePress(data.uri)}>
                                                                            //        <Text> {data.name} </Text>
                                                                            //         </TouchableOpacity>
