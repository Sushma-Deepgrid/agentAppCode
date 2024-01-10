import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Image,
  TextInput
} from 'react-native'
import SelectDropdown from 'react-native-select-dropdown'
import Video from 'react-native-video'
import Field from '../../components/Field'
import React, { useState, useEffect, useRef } from 'react'
import { COLORS, ROUTES } from '../../constants'
import { VictoryPie } from 'victory-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {
  PropertyId,
  ServiceName,
  ServiceId,
  UserToken,
  Geofencing,
  DocumentsList,
  CommentBox,
  Reload
} from '../../../store'
import DocumentPicker from 'react-native-document-picker'
import axios from 'axios'
import RNFS from 'react-native-fs'
import Geolocation from '@react-native-community/geolocation'
import { RNCamera } from 'react-native-camera'
import MapView, { Marker, PROVIDER_GOOGLE, Polygon } from 'react-native-maps'
import { API_URL } from '@env'

const ECService = ({ navigation }) => {
  const mapRef = useRef(null)
  const { propertyId } = PropertyId.useState((s) => s)
  const { serviceName } = ServiceName.useState((s) => s)
  const { serviceId } = ServiceId.useState((s) => s)
  // console.warn(serviceId)
  const { userToken } = UserToken.useState((s) => s)

  const { documentsList } = DocumentsList.useState((s) => s)
  // console.warn(documentsList)

  const { commentBox } = CommentBox.useState((s) => s)
  //  console.warn(commentBox)

  const [comment, onChangeComment] = useState('')
  const [isActiveDoc, setIsActiveDoc] = useState(false)
  const [isActivePhotos, setIsActivePhotos] = useState(false)
  const [isActiveVideos, setIsActiveVideos] = useState(false)
  const [isActiveGeoFencing, setIsActiveGeoFencing] = useState(false)
  const Status = ['Completed', 'Pending', 'Ongoing']
  const [selectedStatus, setSelectedStatus] = useState('')
  const [Documents, setDocuments] = useState([])
  const [Photos, setPhotos] = useState([])
  const [Photos1, setPhotos1] = useState([])
  const [Geotagging, setGeotagging] = useState([])
  const [PreviousGeotagging, setPreviousGeotagging] = useState([])
  const [initialRegion, setInitialRegion] = useState({
    latitude: 17.36165,
    longitude: 78.47465,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5
  })
  const [MarkerPhotos, setMarkerPhotos] = useState([])
  const [ExistingPhotos, setExistingPhotos] = useState([])
  const [PreviousPhotos, setPreviousPhotos] = useState([])
  const [ExistingDocuments, setExistingDocuments] = useState([])
  const [Videos, setVideos] = useState([])
  const [GeoFencing, setGeoFencing] = useState([])
  const [currentLocation, setCurrentLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const cameraRef = useRef(null)

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
          `${API_URL}/user/get-task/${serviceId}`,
          {
            headers: {
              Authorization: 'Bearer ' + userToken
            }
          }
        )

        //  await console.warn(response.data.task.previous_images)
        // console.warn(response.data.task,"errrrrrr")
        setMarkerPhotos(response.data.task.previous_images)

        if (response.data.task.comments != undefined) {
          onChangeComment(response.data.task.comments)
        } else {
          onChangeComment(commentBox)
        }

        setSelectedStatus(response.data.task.status)
        setExistingDocuments(response.data.task.documents)

        if (response.data.task.previous_geo_tagging != null) {
          setPreviousGeotagging(response.data.task.previous_geo_tagging)
        }
        setPreviousPhotos(response.data.task.previous_images)

        if (response.data.task.previous_geo_tagging != null) {
          const latitude = response.data.task?.previous_geo_tagging[0]?.lat
          const longitude = response.data.task?.previous_geo_tagging[0]?.long

          setInitialRegion({
            latitude,
            longitude,
            latitudeDelta: 0.0005,
            longitudeDelta: 0.0005
          })
        }

        const imagesObj = []
        for (
          let i = 0;
          i < response.data.task.previous_geo_tagging?.length;
          i++
        ) {
          imagesObj.push({
            imageUrl: response.data.task.previous_images[i],
            lat: response.data.task.previous_geo_tagging[i].lat,
            long: response.data.task.previous_geo_tagging[i].long
          })
        }
        // console.warn(imagesObj);
        setExistingPhotos(imagesObj)
      } catch (error) {
        console.warn('warn167', error)
        // window.alert("Can't Assign Same Track Name")
      }
      // fitAllMarkers()
    }
    fetchTrackApiData()
  }, [1])

  
useEffect(() => {
  if (PreviousGeotagging && PreviousGeotagging.length > 0) {
    fitAllMarkers();
  }
}, [PreviousGeotagging]); // Call fitAllMarkers when PreviousGeotagging changes

const fitAllMarkers = () => {
  if (mapRef.current && PreviousGeotagging && PreviousGeotagging.length > 0) {
    mapRef.current.fitToCoordinates(
      PreviousGeotagging.map((marker) => ({
        latitude: marker.lat,
        longitude: marker.long,
      })),
      {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      }
    );
  }
};


  const handleDocPick = async () => {
    let result = await DocumentPicker.getDocumentAsync({})
    const uploadDate = new Date()

    // alert(result.uri);
    alert(`Uploaded ${result.name} Succesfully`)
    const obj = [...Documents]

    obj.push({
      name: result.name,
      uploadedDate: uploadDate, // Include the upload date in the document object
      uri: result.uri
    })
    setDocuments(obj)

    console.log(obj)
    console.log(Documents)
  }

  const PhotoItem = ({ item, onPress, onDelete }) => {
    const [enlarged, setEnlarged] = useState(false)

    const handlePress = () => {
      setEnlarged(true)
      onPress(item)
    }

    const handleDelete = () => {
      onDelete(item)
    }

    const handleClose = () => {
      setEnlarged(false)
    }

    return (
      <TouchableOpacity style={styles.photoContainer} onPress={handlePress}>
        <Image source={{ uri: item.uri }} style={styles.photo} />
        <View>
          <Text style={{ color: COLORS.black }}>Latitude:{item.lat}</Text>
          <Text style={{ color: COLORS.black }}>Longitude:{item.long}</Text>
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
    )
  }

  const PhotoItem2 = ({ item, onPress, onDelete }) => {
    const [enlarged, setEnlarged] = useState(false)

    const handlePress = () => {
      setEnlarged(true)
      onPress(item)
    }

    const handleDelete = () => {
      onDelete(item)
    }

    const handleClose = () => {
      setEnlarged(false)
    }

    return (
      <TouchableOpacity style={styles.photoContainer} onPress={handlePress}>
        <Image
          source={{ uri: `${API_URL}/${item.imageUrl}` }}
          style={styles.photo}
        />
        <View>
          <Text style={{ color: COLORS.black }}>Latitude:{item.lat}</Text>
          <Text style={{ color: COLORS.black }}>Longitude:{item.long}</Text>
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
    )
  }
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [selectedPhoto2, setSelectedPhoto2] = useState(null)

  const handlePhotoPress = (photo) => {
    setSelectedPhoto(photo)
    console.log(selectedPhoto)
  }
  const handleDeletePhoto = (photo) => {
    const updatedPhotos = Photos.filter((item) => item !== photo)
    setPhotos(updatedPhotos)
  }
  const handleClosePhoto = () => {
    setSelectedPhoto(null)
    console.log(selectedPhoto)
  }

  const handlePhotoPress2 = (photo) => {
    setSelectedPhoto2(photo)
    console.log(selectedPhoto2)
  }
  const handleDeletePhoto2 = (photo) => {
    console.log(photo)
    //     const updatedPhotos = ExistingPhotos.filter((item) => item !== photo);
    //     setExistingPhotos(updatedPhotos);
    //     const index = ExistingPhotos.indexOf(photo.imageUrl);

    // console.log(index);
    // PreviousPhotos.splice(index,1)
    // PreviousGeotagging.splice(index,1)
  }
  const handleClosePhoto2 = () => {
    setSelectedPhoto2(null)
    console.log(selectedPhoto2)
  }

  const VideoItem = ({ item, onPress, onDelete }) => {
    const handlePress = () => {
      onPress(item)
    }

    const handleDelete = () => {
      onDelete(item)
    }

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
    )
  }

  const [selectedVideo, setSelectedVideo] = useState(null)
  const handleVideoPress = (video) => {
    setSelectedVideo(video)
  }

  const handleDeleteVideo = (video) => {
    const updatedVideos = Videos.filter((item) => item !== video)
    setVideos(updatedVideos)
  }

  const handleCloseVideo = () => {
    setSelectedVideo(null)
  }
  const { geofencing } = Geofencing.useState((s) => s)

  async function savePropertyDetails(e) {
    e.preventDefault()
    setLoading(true)
    // console.log(imagesList,geoTaggingList,previousImagesList,previousGeoTaggingList)

    console.log('Documents:', documentsList)
    console.log('selectedStatus:', selectedStatus)

    console.log('PreviousPhotos:', PreviousPhotos)
    console.log('PreviousGeotagg:', PreviousGeotagging)

    console.log('comments', comment)

    CommentBox.update((s) => {
      s.commentBox = comment
    })

    const formData = new FormData()
    formData.append('status', selectedStatus)
    formData.append('geo_fencing', [])

    formData.append('geo_tagging', [])

    if (PreviousGeotagging.length === 0) {
      formData.append('previous_geo_tagging', [])
    } else {
      formData.append(
        'previous_geo_tagging',
        JSON.stringify(PreviousGeotagging)
      )
    }

    if (PreviousPhotos.length === 0) {
      formData.append('previous_images', [])
    } else {
      formData.append('previous_images', JSON.stringify(PreviousPhotos))
    }

    if (comment != undefined) {
      formData.append('comments', comment)
    }

    formData.append('images', [])

    // Add documents to formData
    // for (let i = 0; i < documentsList.length; i++) {
    //   const documentUri = documentsList[i].uri
    //   const documentName = documentUri.split('/').pop()
    //   const documentType = documentsList[i].type // Modify the type if needed

    //   const documentData = await RNFS.readFile(documentUri, 'base64');

    //   formData.append('documents', {
    //     uri: documentUri,
    //     name: documentName,
    //     type: documentType,
    //     data: documentData
    //   })
    // }
    const getMimeType = (filename) => {
      console.log('filename', filename)
      // Mapping of file extensions to MIME types
      const mimeTypeMap = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        bmp: 'image/bmp',
        pdf: 'application/pdf',
        doc: 'application/msword',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // MIME type for .xlsx
        csv: 'text/csv'
        // Add more mappings as needed
      }
      console.log('mimeTypeMap', mimeTypeMap)

      // Extract the file extension
      const extension = filename.split('.').pop().toLowerCase()
      console.log('extension', extension)
      // Return the corresponding MIME type or a default one
      return mimeTypeMap[extension] || 'application/octet-stream'
    }

    for (let i = 0; i < documentsList.length; i++) {
      const documentUri = documentsList[i].uri
      const documentName = documentUri.split('/').pop()
      const documentType = getMimeType(documentsList[i].name)
      console.log('documentTypedocumentType', documentType)

      const documentData = await RNFS.readFile(documentUri, 'base64')

      formData.append('documents', {
        uri: documentUri,
        name: documentName,
        type: documentType,
        data: documentData
      })
    }

    try {
      console.log('formData&***************', formData)
      const getFormDataContent = (formData) => {
        const data = {}
        for (const [key, value] of formData?._parts) {
          data[key] = value
        }
        return JSON.stringify(data, null, 2)
      }

      // After you've appended all your data to formData
      console.log('formData', getFormDataContent(formData))
      console.log('reqqqs')
      const response = await axios.put(
        `${API_URL}/user/edit-task/${serviceId}`,
        formData,
        {
          headers: {
            Authorization: 'Bearer ' + userToken,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      console.log(response)
      Reload.update((s) => {
        s.reload = 'true'
      })
      setLoading(false)
      DocumentsList.update((s) => {
        s.documentsList = []
      })

      navigation.goBack()
    } catch (error) {
      console.log('error', error)
      console.log('error', error.message)
      console.log('error', error.data)
      setLoading(false)
    }

    console.log(Videos)
    console.log(geofencing)

    // navigation.navigate(ROUTES.TASKS_DETAIL);
  }

  useEffect(() => {
    Geolocation.requestAuthorization()
    Geolocation.getCurrentPosition(
      (position) => {
        console.log(position.coords)
      },
      (error) => {
        console.log(error.message)
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    )
  }, [])

  const handleStatusChange = (index) => {
    if (index !== 0) {
      setSelectedStatus(index)
      console.log(index)
    }
  }

  const handleLinkPress = async (url) => {
    const supported = await Linking.canOpenURL(url)
    if (supported) {
      await Linking.openURL(url)
    } else {
      console.log('Cannot open URL: ' + url)
    }
  }

  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null)

  const handleMarkerPress = (index) => {
    setSelectedMarkerIndex(index)
  }

  const renderImageList = () => {
    if (selectedMarkerIndex !== null) {
      // Replace the `imageList` array with your own array of images

      return (
        <View style={styles.imageListContainer}>
          <View style={styles.imagePopup}>
            <TouchableOpacity
              style={{ ...styles.closeButton, zIndex: 2 }}
              onPress={() => setSelectedMarkerIndex(null)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Image
              source={{
                uri: `${API_URL}/${MarkerPhotos[selectedMarkerIndex]}`
              }}
              style={styles.image}
            />
          </View>
        </View>
      )
    }

    return null
  }

  return (
    <>
      {loading === true || loading === 'true' ? (
        <>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
              marginTop: 10
            }}
          >
            <Ionicons
              name="arrow-back"
              color="black"
              size={24}
              onPress={() => navigation.goBack()}
            />
            <Text
              style={{
                fontSize: 24,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                fontWeight: 'bold',
                marginLeft: 10,
                color: COLORS.black
              }}
            >
              {serviceName}
            </Text>
          </View>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        </>
      ) : (
        <>
          <View style={styles.maincontainer}>
            <View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginVertical: 10,
                  paddingHorizontal: 10
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons
                    name="arrow-back"
                    color="black"
                    size={24}
                    onPress={() => navigation.goBack()}
                  />
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: 'bold',
                      color: COLORS.black,
                      marginLeft: 10
                    }}
                  >
                    {serviceName}
                  </Text>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={savePropertyDetails}
                    style={{
                      backgroundColor: COLORS.primary,
                      padding: 10,
                      borderRadius: 10,
                      paddingHorizontal: 20
                    }}
                  >
                    <Text style={{ color: 'white' }}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 10
              }}
            >
              <Text style={{ fontSize: 26 }}>{/* # {propertyId} */}</Text>
              <View
                style={{
                  flexDirection: 'row',
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}
              >
                <SelectDropdown
                  data={Status}
                  defaultButtonText="Select Status"
                  buttonStyle={{
                    width: 150,
                    backgroundColor: COLORS.primary,
                    borderRadius: 10,
                    height: 35
                  }}
                  buttonTextStyle={{ color: 'white' }}
                  defaultValue={selectedStatus}
                  onSelect={(index) => handleStatusChange(index)}
                  buttonTextAfterSelection={(selectedItem) => selectedItem}
                  rowTextForSelection={(item) => item}
                  disabledItemIndices={[0]}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 50,
                paddingVertical: 15
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(ROUTES.DOCUMENTS)
                }}
              >
                <Ionicons name="folder" size={80} color={COLORS.primary} />
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    color: COLORS.black
                  }}
                >
                  Documents
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(ROUTES.IMAGES)
                }}
              >
                <EntypoIcon
                  name="folder-images"
                  size={80}
                  color={COLORS.primary}
                />
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    color: COLORS.black
                  }}
                >
                  Images
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{ width: '100%', paddingHorizontal: 20, marginBottom: 8 }}
            >
              <TextInput
                multiline
                value={comment}
                onChangeText={onChangeComment}
                placeholder="Comments"
                style={{
                  borderRadius: 15,
                  fontSize: 20,
                  borderColor: '#808080',
                  paddingHorizontal: 10,
                  borderWidth: 2,
                  width: '100%',
                  padding: 10,
                  color: COLORS.black
                }}
                placeholderTextColor="#808080"
              ></TextInput>
            </View>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={initialRegion}
              provider={PROVIDER_GOOGLE}
              onMapReady={fitAllMarkers}
            >
              {PreviousGeotagging != null && (
                <>
                  {PreviousGeotagging.map((marker, index) => (
                    <Marker
                      key={index}
                      coordinate={{
                        latitude: marker.lat,
                        longitude: marker.long
                      }}
                      title={`Marker ${index + 1}`}
                      onPress={() => handleMarkerPress(index)}
                    />
                  ))}
                </>
              )}
            </MapView>

            {renderImageList()}
          </View>
        </>
      )}
    </>
  )
}

export default ECService

const styles = StyleSheet.create({
  maincontainer: {
    marginBottom: 75,
    flex: 1
  },
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
  image: {
    width: 100,
    height: 100
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
    padding: 15
  },
  tableHeader: {
    backgroundColor: '#DCDCDC'
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Add space between images
    padding: 5 // Add padding to create spacing
  },
  photoContainer: {
    width: '50%', // Adjust the width to allocate space for three images
    aspectRatio: 1,
    marginBottom: 10, // Add margin bottom for spacing between images
    padding: 10
  },
  camera: {
    width: '100%',
    height: 400
  },
  captureButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10
  },
  captureButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  photo: {
    flex: 1,
    borderRadius: 5,
    width: '100%', // Fix the width to 100%
    height: '100%' // Fix the height to 100%
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
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
    alignItems: 'center'
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  deleteButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 5
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
    height: '100%' // Fix the height to 100%
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
    alignItems: 'center'
  },
  enlargedVideoContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
  enlargedVideo: {
    width: '100%',
    height: '100%'
  },
  imageListContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center'
  },
  imagePopup: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center'
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
    justifyContent: 'center'
  },
  closeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold'
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10
  }
})

// <DataTable.Header style={styles.tableHeader}>
//         <DataTable.Title>Name</DataTable.Title>
//         <DataTable.Title>Favourite Food</DataTable.Title>
//         <DataTable.Title>Age</DataTable.Title>
//       </DataTable.Header>

// <TouchableOpacity onPress={()=>handlePress(data.uri)}>
//        <Text> {data.name} </Text>
//         </TouchableOpacity>
