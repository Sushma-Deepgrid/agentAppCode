import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Button, Linking, Image, FlatList, Modal  } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { Video } from 'expo-av';
import React, { useState } from 'react';
import { COLORS, ROUTES } from '../../constants';
import { VictoryPie } from "victory-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PropertyId } from '../../../store';
import { DataTable } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { Geofencing } from '../../../store';
const PropertyVisit = ({ navigation }) => {
  const { propertyId } = PropertyId.useState((s) => s);

  const [isActiveDoc, setIsActiveDoc] = useState(false);
  const [isActivePhotos, setIsActivePhotos] = useState(false);
  const [isActiveVideos, setIsActiveVideos] = useState(false);
  const [isActiveGeoFencing, setIsActiveGeoFencing] = useState(false);
const Status = ["Completed", "Pending", "In Progress"]
 const [selectedStatus, setSelectedStatus] = useState('');
  const [Documents, setDocuments] = useState([])
  const [Photos, setPhotos] = useState([])
  const [Videos, setVideos] = useState([])
  const [GeoFencing, setGeoFencing] = useState([])

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


  const [selectedPhoto, setSelectedPhoto] = useState(null);

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
  console.log(geofencing)
function savePropertyDetails(){
  console.log(Documents)
  console.log(Photos)
  console.log(Videos)
   console.log(geofencing)
   console.log(selectedStatus)
    navigation.navigate(ROUTES.TASKS_DETAIL)
}



  const handleStatusChange = (index) => {
    if (index !== 0) {
      setSelectedStatus(index);
      console.log(index)
    }
  };
  return (
    <>
    <ScrollView
      style={styles.maincontainer}>
<View>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
        <Ionicons name="ios-arrow-back" size={24} onPress={() => navigation.goBack()} />
        <Text style={{ fontSize: 24, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', fontWeight: 'bold', marginLeft: 10 }}>
          Property Visit
        </Text>

        
      </View>
      

      </View>
      <View style={{display:'flex',alignItems:'center',flexDirection:'row',justifyContent:'space-between'}}>
        <Text style={{ fontSize: 26 }}>
          # {propertyId}
        </Text>
        <View style={{flexDirection:'row',display:'flex',justifyContent:'flex-end'}}>
  <SelectDropdown
      data={Status}
      defaultButtonText="Select Status"
      buttonStyle={{ width: 150,backgroundColor:COLORS.primary,borderRadius:10}}
       buttonTextStyle={{ color: 'white' }}
      onSelect={(index) => handleStatusChange(index)}
      buttonTextAfterSelection={(selectedItem) => selectedItem}
      rowTextForSelection={(item) => item}
      disabledItemIndices={[0]}
    />
      </View>
      </View>

      <TouchableOpacity
        onPress={DocButtonPress}
        style={isActiveDoc ? styles.buttonActive : styles.buttonNotActive}>
        <Text style={isActiveDoc ? styles.buttonActiveText : styles.buttonNotActiveText}>
          Documents Verification
        </Text>

      </TouchableOpacity>

      {
        isActiveDoc &&
        <DataTable style={styles.container}>
          {
            Documents.map((data, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell >
                  {data.name}
                </DataTable.Cell>
                <DataTable.Cell >
                  {data.uploadedDate.toDateString()}
                </DataTable.Cell>

              </DataTable.Row>

            ))
          }

          <View>
            <Button title="Select Files" onPress={handleDocPick} />
          </View>

        </DataTable>
      }

      <TouchableOpacity
        onPress={PhotosButtonPress}
        style={isActivePhotos ? styles.buttonActive : styles.buttonNotActive}>
        <Text style={isActivePhotos ? styles.buttonActiveText : styles.buttonNotActiveText}>
          Photos
        </Text>

      </TouchableOpacity>
      {
        isActivePhotos &&
        <>
          <FlatList
            data={Photos}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <PhotoItem item={item} onPress={handlePhotoPress} onDelete={handleDeletePhoto} />
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
          <View>
            <Button title="Select Files" onPress={handlePhotosPick} />
          </View>
        </>

      }


      <TouchableOpacity
        onPress={VideosButtonPress}
        style={isActiveVideos ? styles.buttonActive : styles.buttonNotActive}>
        <Text style={isActiveVideos ? styles.buttonActiveText : styles.buttonNotActiveText}>
          Videos
        </Text>

      </TouchableOpacity>
      {
  isActiveVideos && 
    <>
      <FlatList
        data={Videos}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <VideoItem item={item} onPress={handleVideoPress} onDelete={handleDeleteVideo} />
        )}
        contentContainerStyle={styles.videoGrid}
      />
      {selectedVideo != null && (
        <Modal visible={true} transparent={true} onRequestClose={handleCloseVideo}>
          <View style={styles.enlargedVideoContainer}>
            <Video
              source={{ uri: selectedVideo.uri }}
              style={styles.enlargedVideo}
              resizeMode="contain"
              useNativeControls
            />
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseVideo}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
      <View>
        <Button title="Select Files" onPress={handleVideosPick} />
      </View>
    </>
  
}



      <TouchableOpacity
        onPress={GeoFencingButtonPress}
        style={isActiveGeoFencing ? styles.buttonActive : styles.buttonNotActive}>
        <Text style={isActiveGeoFencing ? styles.buttonActiveText : styles.buttonNotActiveText}>
          GeoFencing
        </Text>

      </TouchableOpacity>
      {
        isActiveGeoFencing &&
        <TouchableOpacity onPress={()=>{navigation.navigate(ROUTES.GEOFENCING)}} style={{display:'flex',justifyContent:'center',flexDirection:'row'}}>
          <Text style={{marginTop:20,fontSize:24}}>
            GeoFencing
          </Text>
        </TouchableOpacity>
      }

      
    </ScrollView>
    <View style={{position:'absolute',bottom:80,right:10}}>
        <TouchableOpacity onPress={savePropertyDetails} style={{backgroundColor:COLORS.primary,padding:10,borderRadius:10,paddingHorizontal:20}}>
          <Text style={{color:'white'}}>
            Save
          </Text>
        </TouchableOpacity>
      </View>
      </>
  );
};

export default PropertyVisit;

const styles = StyleSheet.create({
  maincontainer: {
    marginBottom: 75,
    paddingHorizontal: 20,
    backgroundColor: 'white',
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
