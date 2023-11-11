import { StyleSheet, Text, View, TouchableOpacity, ScrollView,ActivityIndicator, Button, Linking, Image, FlatList, Modal, Alert } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { COLORS, ROUTES } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RNFS from 'react-native-fs';
import { PropertyId, ServiceName, ServiceId, UserToken,Reload } from '../../../store';
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform } from 'react-native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { RNCamera } from 'react-native-camera';
import { API_URL } from '@env';

const Images = ({ navigation }) => {
  const { serviceName } = ServiceName.useState((s) => s);
  const { serviceId } = ServiceId.useState((s) => s);
  // console.warn(serviceId)
  const { userToken } = UserToken.useState((s) => s);

  const [Photos, setPhotos] = useState([])
  const [Photos1, setPhotos1] = useState([])
  const [Geotagging, setGeotagging] = useState([])
  const [ExistingPhotos, setExistingPhotos] = useState([])
  const [PreviousPhotos, setPreviousPhotos] = useState([])
  const [PreviousGeotag, setPreviousGeotag] = useState([])
  const [selectedStatus, setSelectedStatus] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const cameraRef = useRef(null);



  useEffect(() => {
    console.log("imagess");

    async function fetchTrackApiData() {

      // console.warn(`Bearer ${userToken}`)
      try {
        const response = await axios.get(
          `${API_URL}/user/get-task/${serviceId}`,
          {
            headers: {
              'Authorization': 'Bearer ' + userToken
            }
          }
        );
        console.log( "response.data.task.previous_images",response.data.task.previous_images)
        console.log( "response.data.task.previous_geo_tagging",response.data.task.previous_geo_tagging)
        setSelectedStatus(response.data.task.status)
        setComment(response.data.task.comments)
        if(response.data.task.previous_geo_tagging?.length !== 0 && response.data.task.previous_geo_tagging !== null){
            setPreviousGeotag(response.data.task.previous_geo_tagging)
          }
          if(response.data.task.previous_images?.length !== 0 && response.data.task.previous_images !== null){
            setPreviousPhotos(response.data.task.previous_images)

          }

        const imagesObj=[]
        console.log("imagesObj",imagesObj);
        for(let i=0;i<response.data.task.previous_geo_tagging.length;i++){
          imagesObj.push({
            "imageUrl":response.data.task.previous_images[i],
            "lat":response.data.task.previous_geo_tagging[i].lat,
            "long":response.data.task.previous_geo_tagging[i].long
          })
        }
        // console.warn(imagesObj);
        console.log("imagesObj1",imagesObj);
        setExistingPhotos(imagesObj);
        
       
      } catch (error) {
        console.warn("error",error);
        // window.alert("Can't Assign Same Track Name")
      }
    }
    fetchTrackApiData();
  }, [1]);


  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedPhoto2, setSelectedPhoto2] = useState(null);

  const handlePhotoPress = (photo) => {
    setSelectedPhoto(photo);
    console.log("selectedPhoto",selectedPhoto)
  };
  const handleDeletePhoto = (photo) => {
   
    for(let i=0;i<Photos.length;i++){
      if(photo.url === Photos[i].uri){
        Photos.splice(i,1)
        Geotagging.splice(i,1)
      }
    }
    const updatedPhotos = Photos1.filter((item) => item !== photo);
    setPhotos1(updatedPhotos);
  };
  const handleClosePhoto = () => {
    setSelectedPhoto(null);
    console.log("selectedPhoto",selectedPhoto)
  };

  const handlePhotoPress2 = (photo) => {
    setSelectedPhoto2(photo);
    console.log("selectedPhoto2",selectedPhoto2)
  };
  const handleDeletePhoto2 = (photo) => {
     console.log("ExistingPhotos",ExistingPhotos)
    for(let i=0;i<ExistingPhotos.length;i++){
      if(photo.imageUrl === ExistingPhotos[i].imageUrl){
        PreviousPhotos.splice(i,1)
        PreviousGeotag.splice(i,1)
      }
    }
   
    setPreviousPhotos(PreviousPhotos)
    setPreviousGeotag(PreviousGeotag)

    const updatedPhotos = ExistingPhotos.filter((item) => item !== photo);
    console.log("updatedPhotos",updatedPhotos)
    setExistingPhotos(updatedPhotos);

  };
  const handleClosePhoto2 = () => {
    setSelectedPhoto2(null);
    console.log("selectedPhoto2",selectedPhoto2)
  };


  const PhotoItem = ({ item, onPress, onDelete }) => {
    const [enlarged, setEnlarged] = useState(false);

    const handlePress = () => {
      setEnlarged(true);
      onPress(item);
      setSelectedPhoto(item);
    };

    const handleDelete = () => {
      onDelete(item);
    };

    const handleClose = () => {
      setEnlarged(false);
    };

    return (
      <TouchableOpacity style={styles.photoContainer} onPress={handlePress}>
        <Image source={{ uri: item.url }} style={styles.photo} />
        <View>
          <Text style={{color:COLORS.black}}>
            Latitude:{item.lat}</Text>
          <Text style={{color:COLORS.black}}>Longitude:{item.long}</Text>
        </View>
        {enlarged && (
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close-circle-outline" size={24} color="white" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={16} color="red" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const PhotoItem2 = ({ item, onPress, onDelete }) => {
    const [enlarged, setEnlarged] = useState(false);

    const handlePress = () => {
      setEnlarged(true);
      onPress(item);
      console.log(item,"itemmmmmm")
      setSelectedPhoto2(item)
    };

    const handleDelete = () => {
      onDelete(item);
    };

    const handleClose = () => {
      setEnlarged(false);
    };

    return (
      <TouchableOpacity style={styles.photoContainer} onPress={handlePress}>
        <Image source={{ uri: `${API_URL}/${item.imageUrl}` }} style={styles.photo} />
        <View>
          <Text style={{color:COLORS.black}}>
            Latitude:{item.lat}</Text>
          <Text style={{color:COLORS.black}}>Longitude:{item.long}</Text>
        </View>
        {enlarged && (
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close-circle-outline" size={24} color="white" />
          </TouchableOpacity>
        )}

       
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={16} color="red" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };








  useEffect(() => {
    Geolocation.requestAuthorization();
    Geolocation.getCurrentPosition(
      position => {
        console.log("position.coords",position.coords);
      },
      error => {
        console.log("Error getting location:", error.message);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  const [isCameraVisible, setIsCameraVisible] = useState(false);


 
  // const capturePhoto = async () => {
  //   // Check camera permissions
  //   const { status } = await Permissions.askAsync(Permissions.CAMERA);
  //   if (status !== 'granted') {
  //     console.log('Camera permission not granted');
  //     return;
  //   }
  
  //   // Open the camera in full view
  //   const { status: cameraStatus } = await Permissions.askAsync(Permissions.CAMERA);
  //   if (cameraStatus === 'granted') {
  //     const { status: audioStatus } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
  //     if (audioStatus === 'granted') {
  //       setIsCameraVisible(true);
  //       return;
  //     }
  //   }
  
  //   console.log('Camera permission not granted');
  //   navigation.navigate(ROUTES.TASKS_DETAIL);
  // };
  const openCamera = async () => {
    const status = await request(PERMISSIONS.ANDROID.CAMERA); 
  
    if (status === 'granted') {
      console.log('Camera permission granted');
      setIsCameraVisible(true);
    } else {
      console.log('Camera permission not granted');
    }
  };
  
  const closeCamera = () => {
    setIsCameraVisible(false);
  };
//   const capturePhoto = async () => {
//     // Check camera permissions
//     const { status } = await RNCamera.requestCameraPermissionsAsync();
//     if (status !== 'granted') {
//       console.log('Camera permission not granted');
//       return;
//     }
//     setLoading(true);
//     // Capture photo
//     const photo = await cameraRef.current.takePicture({ quality: 1 });
// console.log([...Photos, photo],"photosss")
// setPhotos([...Photos, photo]);
// setIsCameraVisible(false);
//     // Get current location
//     const { coords } = await Location.getCurrentPositionAsync({});
//     const { latitude, longitude } = coords;
 
//     const obj = [...Geotagging]
//     // Create photo object with location
//     const photoWithLocation = {
//       lat: latitude,
//       long: longitude,
//     };
    
//     obj.push(photoWithLocation)
//     console.log("obj",obj)

//     const PhotosObj=[...Photos1]
    
//       const xobj={
//         url:photo.uri,
//         lat:latitude,
//         long:longitude
//        }
//        console.log("xobj",xobj)
//        PhotosObj.push(xobj)
//     console.log("PhotosObj",PhotosObj)
//     // Append photo to Photos array
//     setGeotagging(obj)
    
//     setPhotos1(PhotosObj);
//     setLoading(false);
    
//   };

const capturePhoto = async () => {
  try {
    // Check camera permissions
    let cameraStatus;
    if (Platform.OS === 'ios') {
      cameraStatus = await check(PERMISSIONS.IOS.CAMERA);
      if (cameraStatus !== RESULTS.GRANTED) {
        cameraStatus = await request(PERMISSIONS.IOS.CAMERA);
      }
    } else {
      cameraStatus = await check(PERMISSIONS.ANDROID.CAMERA);
      if (cameraStatus !== RESULTS.GRANTED) {
        cameraStatus = await request(PERMISSIONS.ANDROID.CAMERA);
      }
    }

    if (cameraStatus !== RESULTS.GRANTED) {
      console.log('Camera permission not granted');
      return;
    }

    setLoading(true);

    // Capture photo
    const photo = await cameraRef.current.takePictureAsync({ quality: 1, exif: true });

    // Update Photos state
    console.log([...Photos, photo], "photosss");
    setPhotos([...Photos, photo]);
    setIsCameraVisible(false);
    setLoader(true)

    // Get current location
    let locationStatus;
    if (Platform.OS === 'ios') {
      locationStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (locationStatus !== RESULTS.GRANTED) {
        locationStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      }
    } else {
      locationStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (locationStatus !== RESULTS.GRANTED) {
        locationStatus = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      }
    }

    if (locationStatus === RESULTS.GRANTED) {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;

          // Update Geotagging state with the new location
          const newGeoTag = { lat: latitude, long: longitude };
          setGeotagging(prevGeoTagging => [...prevGeoTagging, newGeoTag]);

          // Create a new photo object with URL and location
          const newPhotoWithLocation = {
            url: photo.uri,
            lat: latitude,
            long: longitude
          };
          setPhotos1(prevPhotos => [...prevPhotos, newPhotoWithLocation]);
          setLoader(false)
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
          
        },
        error => console.log(error),
        setLoader(false),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    } else {
      setLoader(false)
      console.log('Location permission not granted');
    }
  } catch (error) {
    setLoader(false)
    console.error("Error capturing photo or getting location:", error);
  } finally {
    setLoader(false)
    setLoading(false);
  }
};


  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);

  const handleCameraFlip = () => {
    setCameraType(
      cameraType === RNCamera.Constants.Type.back
        ? RNCamera.Constants.Type.front
        : RNCamera.Constants.Type.back
    );
  };

  async function SaveImages(e){
    e.preventDefault();
    setLoader(true)
    try {
    // console.log("Documents:", documentsList);
    // console.log("selectedStatus:", selectedStatus);

    console.log("Photos:", Photos);
    console.log("Geotagging:", Geotagging);
    
    console.log("PreviousPhotos:",PreviousPhotos)
    console.log("PreviousGeotagg:",PreviousGeotag)

  // console.log("comments",comment)

    
  
   
    const formData = new FormData();
    formData.append("status", selectedStatus);
    formData.append("geo_fencing", []);

    if(Geotagging?.length === 0 || Geotagging === null){
      formData.append("geo_tagging", []);
    }
    else{
      formData.append("geo_tagging", JSON.stringify(Geotagging));
    }

    if(PreviousGeotag?.length === 0 || PreviousGeotag === null){
      formData.append("previous_geo_tagging", []);
    }
    else{
      formData.append("previous_geo_tagging", JSON.stringify(PreviousGeotag));
    }

    console.log("PreviousPhotos fom",PreviousPhotos);
    if(PreviousPhotos?.length === 0 || PreviousPhotos === null){
      formData.append("previous_images", []);
    }
    else{
      formData.append("previous_images", JSON.stringify(PreviousPhotos));
    }
    
   formData.append("comments",comment)
  
    for (let i = 0; i < Photos.length; i++) {
      const photoUri = Photos[i].uri;
      const photoName = photoUri.split('/').pop();
      const photoType = 'image/jpeg'; // Modify the type if needed
    
      const photoData = await RNFS.readFile(photoUri, 'base64');

      formData.append("images", {
        uri: photoUri,
        name: photoName,
        type: photoType,
        data: photoData,
      });
    
    }

    const getFormDataContent = (formData) => {
      const data = {};
      for (const [key, value] of formData?._parts) {
        data[key] = value;
      }
      return JSON.stringify(data, null, 2);
    };
    
    // After you've appended all your data to formData
    console.log('formData', getFormDataContent(formData));
    
    
    
    
      console.log("formData",formData);
      console.log("formData.previous_images",formData?.previous_images);
      const response = await axios.put(
        `${API_URL}/user/edit-task/${serviceId}`,
        formData,
        {
          headers: {
            'Authorization': 'Bearer ' + userToken,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log("response 392",response);
    
     
      setLoader(false)
      navigation.navigate(ROUTES.ECSERVICE)
    
    navigation.goBack();
    } catch (error) {
      setLoader(false)
      console.log("error",error);
      alert(error)
    }

  }
  


  return (
    <>
    
    { (loader === true || loader === 'true') ?
      <>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
            <Ionicons name="arrow-back" color='black' size={24} onPress={() => navigation.goBack()} />
            <Text style={{ fontSize: 24, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', fontWeight: 'bold', marginLeft: 10,color:COLORS.black }}>
            {serviceName}
            </Text>
          </View>
     <View style={styles.loaderContainer}>
     
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
          </>
          :
          <>
          <View
            style={styles.maincontainer}>
           <View>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center',justifyContent:'space-between',marginVertical:10, marginLeft: 10  }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons color='black' name="arrow-back" size={24} onPress={() => navigation.goBack()} />
                <Text style={{ fontSize: 24,  fontWeight: 'bold',marginLeft:10, color:COLORS.black}}>
                  Images
                </Text>
                </View>
                 <View >
            <TouchableOpacity onPress={SaveImages} style={{ backgroundColor: COLORS.primary, padding: 10, borderRadius: 10, paddingHorizontal: 20 }}>
              <Text style={{ color: 'white' }}>
               Save
              </Text>
            </TouchableOpacity>
          </View>
    
    
              </View>
    
    
            </View>
            

<View style={styles.container}>
  <TouchableOpacity style={styles.openCameraButton} onPress={openCamera}>
    <Text style={styles.openCameraButtonText}>Open Camera</Text>
  </TouchableOpacity>

  
   {isCameraVisible && (
   <Modal visible={true} transparent={true} onRequestClose={handleClosePhoto}>
   <View style={styles.CameramodalContainer}>
   <RNCamera style={styles.camera} type={cameraType} ref={cameraRef} />
   <TouchableOpacity onPress={handleCameraFlip}>
    {/* <MaterialIcons style={{ position: 'absolute', bottom: 55, right: 15 }} name="flip-camera-android" size={24} color="white" /> */}
  </TouchableOpacity>
  {
    loading ?
    <>
    <TouchableOpacity style={styles.captureButton} >
    <Text style={styles.captureButtonText}>Loading...</Text>
  </TouchableOpacity>
    </>
    :
    <>
    <TouchableOpacity style={styles.captureButton} onPress={capturePhoto}>
    <Text style={styles.captureButtonText}>Capture Photo</Text>
  </TouchableOpacity>
    </>
  }
      
      
      <TouchableOpacity style={styles.cameraCloseButton} onPress={closeCamera}>
            <Ionicons name="close-circle-outline" size={28} color="white" />
          </TouchableOpacity>
   </View>
 </Modal>
  )}
   
</View>

         
            {/* <TouchableOpacity
              onPress={PhotosButtonPress}
              style={1 == 1 ? styles.buttonActive : styles.buttonNotActive}>
              <Text style={1 === 1 ? styles.buttonActiveText : styles.buttonNotActiveText}>
                Upload Images
              </Text>
    
            </TouchableOpacity> */}
            {/* isActivePhotos */}
            {
              1 === 1 &&
              <>
              <View >

                <FlatList
                  data={Photos1}
                  numColumns={2}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <PhotoItem item={item} onPress={handlePhotoPress} onDelete={handleDeletePhoto} />
                  )}
                  contentContainerStyle={styles.photoGrid}
                />
              </View>
              
    
    <View >

                <FlatList 
                  data={ExistingPhotos}
                  numColumns={2}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <PhotoItem2 item={item} onPress={handlePhotoPress2} onDelete={handleDeletePhoto2} />
                  )}
                  contentContainerStyle={styles.photoGrid}
                />
                
    </View>
    
                {selectedPhoto != null && (
                  <Modal visible={true} transparent={true} onRequestClose={handleClosePhoto}>
                    <View style={styles.modalContainer}>
                      <Image source={{ uri: selectedPhoto.url }} style={styles.enlargedPhoto} />
                      <TouchableOpacity style={styles.closeButton} onPress={handleClosePhoto}>
                        <Text style={styles.closeButtonText}>X</Text>
                      </TouchableOpacity>
                    </View>
                  </Modal>
                )}
                {selectedPhoto2 != null && (
                  <Modal visible={true} transparent={true} onRequestClose={handleClosePhoto2}>
                    <View style={styles.modalContainer}>
                      
                      <Image source={{ uri: `${API_URL}/${selectedPhoto2.imageUrl}` }} style={styles.enlargedPhoto} />
                      <TouchableOpacity style={styles.closeButton} onPress={handleClosePhoto2}>
                        <Text style={styles.closeButtonText}>X</Text>
                      </TouchableOpacity>
                    </View>
                  </Modal>
                )}
                
                {/* <TouchableOpacity style={styles.captureButton} onPress={handlePhotosPick}>
                  <Text style={styles.captureButtonText}>Select Files</Text>
                </TouchableOpacity> */}
              </>
    
            }
    
    
    
    
    
          </View>
          
        
    </>
}
    </>
  );
};

export default Images;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    paddingHorizontal: 10,
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
  tableHeader: {
    backgroundColor: '#DCDCDC',
  },
  photoGrid: {
    marginHorizontal: 16,
   // Add padding to create spacing
  },
  photoContainer: {
    width: '50%', 
    aspectRatio: 1, 
    padding: 10,
    
    
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
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  openCameraButton: {
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  openCameraButtonText: {
    color: 'white',
    fontSize: 16,
  },
  cameraPopup: {
    width: '100%',
    height: '100%',
  },
  CameramodalContainer: {
    position:'relative',
    width: '100%',
    height: '100%',
  },
  camera: {
    width: '100%',
    height: '100%',
    aspectRatio: 1,
    borderColor: 'white'
  },
  cameraCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  captureButton: {
    backgroundColor:COLORS.primary,
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
    bottom: 5,
    width:'100%'
  },
  captureButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
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