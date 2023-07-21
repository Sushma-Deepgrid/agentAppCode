import { StyleSheet, Text, View, TouchableOpacity,ActivityIndicator, Button, Linking, Image, FlatList, Modal,TextInput } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { Video } from 'expo-av';
import Field from '../../components/Field';
import React, { useState, useEffect, useRef } from 'react';
import { COLORS, ROUTES } from '../../constants';
import { VictoryPie } from "victory-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { PropertyId, ServiceName, ServiceId, UserToken, DocumentsList,
  ImagesList,GeoTaggingList,CommentBox,PreviousGeoTaggingList,PreviousImagesList } from '../../../store';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { Geofencing } from '../../../store';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';
import MapView, { Marker, Polygon } from 'react-native-maps';
const ECService = ({ navigation }) => {
  const { propertyId } = PropertyId.useState((s) => s);
  const { serviceName } = ServiceName.useState((s) => s);
  const { serviceId } = ServiceId.useState((s) => s);
  // console.warn(serviceId)
  const { userToken } = UserToken.useState((s) => s);

  const { documentsList } = DocumentsList.useState((s) => s);
  // console.warn(documentsList)

  const { imagesList } = ImagesList.useState((s) => s);
  // console.log("New Images:",imagesList)

  const { geoTaggingList } = GeoTaggingList.useState((s) => s);
//  console.log("New GeoTagg:",geoTaggingList)


const { previousImagesList } = PreviousImagesList.useState((s) => s);
  //  console.log("Previous Images:",previousImagesList)

const { previousGeoTaggingList } = PreviousGeoTaggingList.useState((s) => s);
  //  console.log("Previous Geotagg:",previousGeoTaggingList)

const { commentBox } = CommentBox.useState((s) => s);
//  console.warn(commentBox)

 

 const [comment, onChangeComment] = useState();
  const [isActiveDoc, setIsActiveDoc] = useState(false);
  const [isActivePhotos, setIsActivePhotos] = useState(false);
  const [isActiveVideos, setIsActiveVideos] = useState(false);
  const [isActiveGeoFencing, setIsActiveGeoFencing] = useState(false);
  const Status = ["Completed", "Pending", "Ongoing"]
  const [selectedStatus, setSelectedStatus] = useState('');
  const [Documents, setDocuments] = useState([])
  const [Photos, setPhotos] = useState([])
  const [Photos1, setPhotos1] = useState([])
  const [Geotagging, setGeotagging] = useState([])
  const [PreviousGeotagging, setPreviousGeotagging] = useState([])
  const [initialRegion, setInitialRegion] = useState(null);
  const [MarkerPhotos, setMarkerPhotos] = useState([])
  const [ExistingPhotos, setExistingPhotos] = useState([])
  const [PreviousPhotos, setPreviousPhotos] = useState([])
  const [ExistingDocuments, setExistingDocuments] = useState([])
  const [Videos, setVideos] = useState([])
  const [GeoFencing, setGeoFencing] = useState([])
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);

  function DocButtonPress() {
    setIsActiveDoc(!isActiveDoc)
    setIsActivePhotos(false)
    setIsActiveVideos(false)
    setIsActiveGeoFencing(false)
  }

  function PhotosButtonPress() {
    setIsActivePhotos(!isActivePhotos)
    setIsActiveDoc(false)
    setIsActiveVideos(false)
    setIsActiveGeoFencing(false)
  }

  function VideosButtonPress() {
    setIsActiveVideos(!isActiveVideos)
    setIsActiveDoc(false)
    setIsActivePhotos(false)
    setIsActiveGeoFencing(false)
  }

  function GeoFencingButtonPress() {
    setIsActiveGeoFencing(!isActiveGeoFencing)
    setIsActiveDoc(false)
    setIsActiveVideos(false)
    setIsActivePhotos(false)
  }

  useEffect(() => {

    async function fetchTrackApiData() {

      // console.warn(`Bearer ${userToken}`)
      try {
        const response = await axios.get(
          `https://aagama2.adgrid.in/user/get-task/${serviceId}`,
          {
            headers: {
              'Authorization': 'Bearer ' + userToken
            }
          }
        );

      //  await console.warn(response.data.task.previous_images)
      console.log(response.data.task.previous_geo_tagging)
       setMarkerPhotos(response.data.task.previous_images)
        setSelectedStatus(response.data.task.status);
        setExistingDocuments(response.data.task.documents);

        if(response.data.task.previous_geo_tagging != null){

          setPreviousGeotagging(response.data.task.previous_geo_tagging);
        }
        

        if(response.data.task.previous_geo_tagging != null){

          const latitude=response.data.task.previous_geo_tagging[0].lat
          const longitude=response.data.task.previous_geo_tagging[0].long
  
          setInitialRegion({
            latitude,
            longitude,
            latitudeDelta: 0.0005,
            longitudeDelta: 0.0005,
          });
        }
       
        setPreviousPhotos(response.data.task.previous_images)
        const imagesObj=[]
        for(let i=0;i<response.data.task.previous_geo_tagging.length;i++){
            imagesObj.push({
            "imageUrl":response.data.task.previous_images[i],
            "lat":response.data.task.previous_geo_tagging[i].lat,
            "long":response.data.task.previous_geo_tagging[i].long
            })
        }
        // console.warn(imagesObj);
        setExistingPhotos(imagesObj);
        
       
      } catch (error) {
        await console.warn(error);
        // window.alert("Can't Assign Same Track Name")
      }
    }
    fetchTrackApiData();

    if(commentBox != ''){
      onChangeComment(commentBox)
    }
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

  const handlePhotosPick = async () => {

    let result = await DocumentPicker.getDocumentAsync({});
    const uploadDate = new Date();

    // alert(result.uri);
    alert(`Uploaded ${result.name} Succesfully`)
    const obj = [...Photos]

    obj.push({
      name: result.name,
      uploadedDate: uploadDate, // Include the upload date in the document object
      uri: result.uri,
    });
    setPhotos(obj)

    console.log(obj);
    console.log(Photos);

  }
  const handlePress = (url) => {
    Linking.openURL(url);
  };

  const PhotoItem = ({ item, onPress, onDelete }) => {
    const [enlarged, setEnlarged] = useState(false);

    const handlePress = () => {
      setEnlarged(true);
      onPress(item);
    };

    const handleDelete = () => {
      onDelete(item);
    };

    const handleClose = () => {
      setEnlarged(false);
    };

    return (
      <TouchableOpacity style={styles.photoContainer} onPress={handlePress}>
        <Image source={{ uri: item.uri }} style={styles.photo} />
        <View>
          <Text>Latitude:{item.lat}</Text>
          <Text>Longitude:{item.long}</Text>
        </View>
        {enlarged && (
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close-circle-outline" size={24} color="white" />
          </TouchableOpacity>
        )}
        {/* <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={16} color="red" />
        </TouchableOpacity> */}
      </TouchableOpacity>
    );
  };

  const PhotoItem2 = ({ item, onPress, onDelete }) => {
    const [enlarged, setEnlarged] = useState(false);

    const handlePress = () => {
      setEnlarged(true);
      onPress(item);
    };

    const handleDelete = () => {
      onDelete(item);
    };

    const handleClose = () => {
      setEnlarged(false);
    };

    return (
      <TouchableOpacity style={styles.photoContainer} onPress={handlePress}>
        <Image source={{ uri: `https://aagama2.adgrid.in/${item.imageUrl}` }} style={styles.photo} />
        <View>
          <Text>
            Latitude:{item.lat}</Text>
          <Text>Longitude:{item.long}</Text>
        </View>
        {enlarged && (
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close-circle-outline" size={24} color="white" />
          </TouchableOpacity>
        )}

       
        {/* <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={16} color="red" />
        </TouchableOpacity> */}
      </TouchableOpacity>
    );
  };
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedPhoto2, setSelectedPhoto2] = useState(null);

  const handlePhotoPress = (photo) => {
    setSelectedPhoto(photo);
    console.log(selectedPhoto)
  };
  const handleDeletePhoto = (photo) => {
    const updatedPhotos = Photos.filter((item) => item !== photo);
    setPhotos(updatedPhotos);
  };
  const handleClosePhoto = () => {
    setSelectedPhoto(null);
    console.log(selectedPhoto)
  };

  const handlePhotoPress2 = (photo) => {
    setSelectedPhoto2(photo);
    console.log(selectedPhoto2)
  };
  const handleDeletePhoto2 = (photo) => {
    console.log(photo)
//     const updatedPhotos = ExistingPhotos.filter((item) => item !== photo);
//     setExistingPhotos(updatedPhotos);
//     const index = ExistingPhotos.indexOf(photo.imageUrl);

// console.log(index);
// PreviousPhotos.splice(index,1)
// PreviousGeotagging.splice(index,1)
  };
  const handleClosePhoto2 = () => {
    setSelectedPhoto2(null);
    console.log(selectedPhoto2)
  };


  const handleVideosPick = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    const uploadDate = new Date();

    alert(`Uploaded ${result.name} Successfully`);

    const obj = [...Videos];

    obj.push({
      name: result.name,
      uploadedDate: uploadDate,
      uri: result.uri,
    });

    setVideos(obj);

    console.log(obj);
  };


  const VideoItem = ({ item, onPress, onDelete }) => {
    const handlePress = () => {
      onPress(item);
    };

    const handleDelete = () => {
      onDelete(item);
    };

    return (
      <TouchableOpacity style={styles.videoContainer} onPress={handlePress}>
        <Video
          source={{ uri: item.uri }}
          style={styles.video}
          resizeMode="cover"
          useNativeControls={false}
        />
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={16} color="red" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const [selectedVideo, setSelectedVideo] = useState(null);
  const handleVideoPress = (video) => {
    setSelectedVideo(video);
  };

  const handleDeleteVideo = (video) => {
    const updatedVideos = Videos.filter((item) => item !== video);
    setVideos(updatedVideos);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };
  const { geofencing } = Geofencing.useState((s) => s);


  async function savePropertyDetails(e) {
    
    e.preventDefault();
    setLoading(true)
      // console.log(imagesList,geoTaggingList,previousImagesList,previousGeoTaggingList)

    console.log("Documents:", documentsList);
    console.log("selectedStatus:", selectedStatus);

    console.log("Photos:", imagesList);
    console.log("Geotagging:", geoTaggingList);
    
    console.log("PreviousPhotos:",previousImagesList)
    console.log("PreviousGeotagg:",previousGeoTaggingList)

    console.warn(comment)
    CommentBox.update((s) => {
      s.commentBox = comment;
    });
   
    const formData = new FormData();
    formData.append("status", selectedStatus);
    formData.append("geo_fencing", []);

    if(geoTaggingList === []){
      formData.append("geo_tagging", []);
    }
    else{
      formData.append("geo_tagging", JSON.stringify(geoTaggingList));
    }

    if(previousGeoTaggingList === []){
      formData.append("previous_geo_tagging", []);
    }
    else{
      formData.append("previous_geo_tagging", JSON.stringify(previousGeoTaggingList));
    }


    formData.append("previous_images", previousImagesList);

    // Add photos to formData
    for (let i = 0; i < imagesList.length; i++) {
      const photoUri = imagesList[i].uri;
      const photoName = photoUri.split('/').pop();
      const photoType = 'image/jpeg'; // Modify the type if needed
    
      const photoData = await FileSystem.readAsStringAsync(photoUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      formData.append("images", {
        uri: photoUri,
        name: photoName,
        type: photoType,
        data: photoData,
      });
    }

    // Add documents to formData
    for (let i = 0; i < documentsList.length; i++) {
      const documentUri = documentsList[i].uri;
      const documentName = documentUri.split('/').pop();
      const documentType = 'application/pdf'; // Modify the type if needed

      const documentData = await FileSystem.readAsStringAsync(documentUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      formData.append("documents", {
        uri: documentUri,
        name: documentName,
        type: documentType,
        data: documentData,
      });
    }

    try {
      const response = await axios.put(
        `https://aagama2.adgrid.in/user/edit-task/${serviceId}`,
        formData,
        {
          headers: {
            'Authorization': 'Bearer ' + userToken,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log(response);
      setLoading(false)
      DocumentsList.update((s) => {
        s.documentsList = [];
      });
      ImagesList.update((s) => {
        s.imagesList = [];
      });
      GeoTaggingList.update((s) => {
        s.geoTaggingList = [];
      });
      PreviousImagesList.update((s) => {
      s.previousImagesList = [];
    });
    PreviousGeoTaggingList.update((s) => {
      s.previousGeoTaggingList = [];
    });
    
      navigation.navigate(ROUTES.TASKS_DETAIL);
    } catch (error) {
      console.log(error);
    }

    console.log(Videos);
    console.log(geofencing);

    // navigation.navigate(ROUTES.TASKS_DETAIL);
  }


  useEffect(() => {

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log(status)
      if (status !== 'granted') {
        // Handle permission denied
        return;
      }
      else {

        let { coords } = await Location.getCurrentPositionAsync({});

        console.log(coords)

      }
    })();
  }, []);

  const handleStatusChange = (index) => {
    if (index !== 0) {
      setSelectedStatus(index);
      console.log(index)
    }
  };

  const handleLinkPress = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Cannot open URL: " + url);
    }
  };
  const capturePhoto = async () => {
    // Check camera permissions
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      console.log('Camera permission not granted');
      navigation.navigate(ROUTES.TASKS_DETAIL);
      return;
    }

    // Capture photo
    const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
console.log(photo)
setPhotos([...Photos, photo]);
    // Get current location
    const { coords } = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = coords;
 
    const obj = [...Geotagging]
    // Create photo object with location
    const photoWithLocation = {
      lat: latitude,
      long: longitude,
    };
    setLoading(true);
    obj.push(photoWithLocation)
    console.log(obj)

    const PhotosObj=[...Photos1]
    
      const xobj={
        url:photo.uri,
        lat:latitude,
        long:longitude
       }
       console.log(xobj)
       PhotosObj.push(xobj)
    console.log(PhotosObj)
    // Append photo to Photos array
    setGeotagging(obj)
    
    setPhotos1(PhotosObj);
    setLoading(false);
  };

  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);

  const handleCameraFlip = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);

  const handleMarkerPress = (index) => {
    setSelectedMarkerIndex(index);
  };

  const renderImageList = () => {
    if (selectedMarkerIndex !== null) {
      // Replace the `imageList` array with your own array of images
    
      return (
        <View style={styles.imageListContainer}>
          <View style={styles.imagePopup}>
            <TouchableOpacity style={{...styles.closeButton,zIndex:2}} onPress={() => setSelectedMarkerIndex(null)}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Image source={{ uri: `https://aagama2.adgrid.in/${MarkerPhotos[selectedMarkerIndex]}` }} style={styles.image} />
          </View>
        </View>
      );
    }
  
    return null;
  };
  
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
          <View
            style={styles.maincontainer}>
            <View>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center',justifyContent:'space-between',marginVertical:10,paddingHorizontal:10 }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons name="ios-arrow-back" size={24} onPress={() => navigation.goBack()} />
                <Text style={{ fontSize: 24,  fontWeight: 'bold'}}>
                  {serviceName}
                </Text>
                </View>
                 <View >
            <TouchableOpacity onPress={savePropertyDetails} style={{ backgroundColor: COLORS.primary, padding: 10, borderRadius: 10, paddingHorizontal: 20 }}>
              <Text style={{ color: 'white' }}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
    
    
              </View>
    
    
            </View>
            <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between',paddingHorizontal:10 }}>
              <Text style={{ fontSize: 26 }}>
                {/* # {propertyId} */}
              </Text>
              <View style={{ flexDirection: 'row', display: 'flex', justifyContent: 'flex-end' }}>
                <SelectDropdown
                  data={Status}
                  defaultButtonText="Select Status"
                  buttonStyle={{ width: 150, backgroundColor: COLORS.primary, borderRadius: 10,height:35 }}
                  buttonTextStyle={{ color: 'white' }}
                  defaultValue={selectedStatus}
                  onSelect={(index) => handleStatusChange(index)}
                  buttonTextAfterSelection={(selectedItem) => selectedItem}
                  rowTextForSelection={(item) => item}
                  disabledItemIndices={[0]}
                />
              </View>
            </View>
    

<View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:50,paddingVertical:15}}>
  
  <TouchableOpacity onPress={()=>{navigation.navigate(ROUTES.DOCUMENTS)}}>
<Ionicons name="folder" size={80} color={COLORS.primary} />
<Text style={{fontSize:16,textAlign:'center'}}>Documents</Text>
  </TouchableOpacity>

  <TouchableOpacity  onPress={()=>{navigation.navigate(ROUTES.IMAGES)}} >
<EntypoIcon name="folder-images" size={80} color={COLORS.primary} />
<Text style={{fontSize:16,textAlign:'center'}}>Images</Text>
  </TouchableOpacity>

</View>

<View style={{width:'100%',paddingHorizontal:20,marginBottom:8}}>
<TextInput 
 multiline
      value={comment} onChangeText={onChangeComment } placeholder="Comments"
      style={{ borderRadius: 15,fontSize: 20,
         borderColor: '#808080', paddingHorizontal: 10, 
         borderWidth: 2, width:'100%', padding:10}}
      placeholderTextColor="#808080">
    </TextInput>
</View>

{/* <FlatList
                  data={Photos}
                  numColumns={2}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <PhotoItem item={item} onPress={handlePhotoPress} onDelete={handleDeletePhoto} />
                  )}
                  contentContainerStyle={styles.photoGrid}
                /> */}

            {/* <TouchableOpacity
              onPress={DocButtonPress}
              style={isActiveDoc ? styles.buttonActive : styles.buttonNotActive}>
              <Text style={isActiveDoc ? styles.buttonActiveText : styles.buttonNotActiveText}>
                Upload Documents
              </Text>
    
            </TouchableOpacity>
    
            {
              isActiveDoc &&
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
    
                <View style={{ marginTop: 10 }}>
                  <Button title="Select Files" onPress={handleDocPick} />
                </View>
    
              </View>
            }
    
            <TouchableOpacity
              onPress={PhotosButtonPress}
              style={1 == 1 ? styles.buttonActive : styles.buttonNotActive}>
              <Text style={1 === 1 ? styles.buttonActiveText : styles.buttonNotActiveText}>
                Upload Images
              </Text>
    
            </TouchableOpacity>
            isActivePhotos
            {
              1 === 1 &&
              <>
               
               
    
    
                <FlatList
                  data={ExistingPhotos}
                  numColumns={2}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <PhotoItem2 item={item} onPress={handlePhotoPress2} onDelete={handleDeletePhoto2} />
                  )}
                  contentContainerStyle={styles.photoGrid}
                />
                
    
                {selectedPhoto != null && (
                  <Modal visible={true} transparent={true} onRequestClose={handleClosePhoto}>
                    <View style={styles.modalContainer}>
                      <Image source={{ uri: selectedPhoto.uri }} style={styles.enlargedPhoto} />
                      <TouchableOpacity style={styles.closeButton} onPress={handleClosePhoto}>
                        <Text style={styles.closeButtonText}>X</Text>
                      </TouchableOpacity>
                    </View>
                  </Modal>
                )}
                {selectedPhoto2 != null && (
                  <Modal visible={true} transparent={true} onRequestClose={handleClosePhoto2}>
                    <View style={styles.modalContainer}>
                      <Image source={{ uri: `https://aagama2.adgrid.in/${selectedPhoto2}` }} style={styles.enlargedPhoto} />
                      <TouchableOpacity style={styles.closeButton} onPress={handleClosePhoto2}>
                        <Text style={styles.closeButtonText}>X</Text>
                      </TouchableOpacity>
                    </View>
                  </Modal>
                )}
                <View style={{ position: 'relative' }}>
                  <Camera style={styles.camera} type={cameraType} ref={cameraRef} />
    
    
    
                  <TouchableOpacity onPress={handleCameraFlip}>
                    <MaterialIcons style={{ position: 'absolute', bottom: 2, right: 2 }} name="flip-camera-android" size={24} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.captureButton} onPress={capturePhoto}>
                    <Text style={styles.captureButtonText}>Capture Photo</Text>
                  </TouchableOpacity>
    
    
    
    
                </View>
                <TouchableOpacity style={styles.captureButton} onPress={handlePhotosPick}>
                  <Text style={styles.captureButtonText}>Select Files</Text>
                </TouchableOpacity>
              </>
    
            } */}



<MapView style={styles.map}  initialRegion={initialRegion} >
          
          {
            PreviousGeotagging != null &&
    <> 
    {PreviousGeotagging.map((marker, index) => (
                 <Marker
                   key={index}
                   coordinate={{
                     latitude: marker.lat,
                     longitude: marker.long,
                   }}
                   title={`Marker ${index + 1}`}
                   onPress={() => handleMarkerPress(index)}
                 />
               ))}
               </>
    }

          </MapView>
    
          {renderImageList()}
    
    
          </View>
         

         
        </>
    }
    </>
    
  );
};

export default ECService;

const styles = StyleSheet.create({
  maincontainer: {
    marginBottom: 75,
    flex: 1,
  },
  map: {
    flex:1
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
  imageListContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  imagePopup: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
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
