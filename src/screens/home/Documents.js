import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Button,
  PermissionsAndroid,
  Linking,
  Image,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {COLORS, ROUTES} from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  PropertyId,
  ServiceName,
  ServiceId,
  UserToken,
  DocumentsList,
} from '../../../store';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import {API_URL} from '@env';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import WebView from 'react-native-webview';

const Documents = ({navigation}) => {
  const [currentUrl, setCurrentUrl] = useState(null);
  const [showWebView, setShowWebView] = useState(false);

  const {propertyId} = PropertyId.useState(s => s);
  const {serviceName} = ServiceName.useState(s => s);
  const {serviceId} = ServiceId.useState(s => s);
  // console.warn(serviceId)
  const {userToken} = UserToken.useState(s => s);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [Documents, setDocuments] = useState([]);
  const [ExistingDocuments, setExistingDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [documentDownloaded, setDocumentDownloaded] = useState(false);

  const {documentsList} = DocumentsList.useState(s => s);
  // console.warn(documentsList)
  useEffect(() => {
    async function fetchTrackApiData() {
      // console.warn(`Bearer ${userToken}`,serviceId)
      console.log(
        '`${API_URL}/user/get-task/${serviceId}`,',
        `${API_URL}/user/get-task/${serviceId}`,
      );
      console.log('userToken', userToken);
      try {
        const response = await axios.get(
          `${API_URL}/user/get-task/${serviceId}`,
          {
            headers: {
              Authorization: 'Bearer ' + userToken,
            },
          },
        );

        // await console.warn(response.data.task)
        console.log(
          'response.data.task.documents',
          response.data.task.documents,
        );
        console.log(
          'response.data.task.documents',
          response.data.task.documents,
        );
        setExistingDocuments(response.data.task.documents);
        setDocuments(documentsList);
      } catch (error) {
        console.warn(error);
        // window.alert("Can't Assign Same Track Name")
      }
    }
    fetchTrackApiData();
  }, [1]);

  const onWebViewNavigationStateChange = (navState) => {
    console.log("navState",navState);
    console.log("documentDownloaded",documentDownloaded);

    // If the document has been downloaded, navigate back
    if (documentDownloaded) {
      navigation.goBack();
    }else{
      navigation.goBack();

    }

    // You can add additional logic here if needed
  };


  const handleDocPick = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      console.log(result[0].name);
      console.log(result[0].size);

      const uploadDate = new Date();

      alert(`Uploaded ${result[0].name} Successfully`);

      const obj = [...Documents];
      console.log('obj', obj);
      obj.push({
        name: result[0].name,
        uploadedDate: uploadDate,
        uri: result[0].uri,
      });
      setDocuments(obj);

      console.log(obj);
      console.log(Documents);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled document picker');
      } else {
        throw err;
      }
    }
  };

  // const handleLinkPress = async url => {
  //   setCurrentUrl(url);
  //   setShowWebView(true);
  //   // Convert url to string if it's not already a string
  //   // const urlString = typeof url === 'string' ? url : url.toString();
  //   // const urlString = `'${url}'`
  //   // const urlString = String(url);
  //   // console.log('url', urlString);
  //   // const supported = await Linking.canOpenURL(url);
  //   // console.log("supported",supported);
  //   // if (supported) {
  //   //   await Linking.openURL(url);
  //   // } else {
  //   //   console.log("Cannot open URL: " + url);
  //   //   Alert.alert(`Don't know how to open this URL: ${url}`);
  //   // }
  //   setTimeout(() => {
  //     setShowWebView(false); // Close the WebView
  //     setCurrentUrl(null);  // Reset the current URL
  //     navigation.goBack();  // Navigate back to the previous screen
  //   }, 3000);
  // };
  const handleLinkPress = async url => {
    setCurrentUrl(url);
    setShowWebView(true);
  
    try {
      // Check and request storage permission for Android
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Storage permission denied");
          // if(currentUrl.includes('.png')){
          //   console.log('yooooo');
          // }
          // navigation.goBack();
          return;
        }
      }
  
      // Extracting file name from URL
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const path = `${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}`;
  
      // Start the file download
      RNFetchBlob?.config({
        path: path
      })
      .fetch('GET', url)
      .then(res => {
        console.log('File saved to:', res.path());
        // Perform any additional actions after download is complete
      })
      .catch(err => {
        console.error('Download error:', err);
        // Handle any errors that occur during download
      });
  
    } catch (error) {
      console.error("Error in handleLinkPress:", error);
      // Handle any other errors
    }
  
    setTimeout(() => {
      setShowWebView(false); // Close the WebView
      setCurrentUrl(null);  // Reset the current URL
      navigation.goBack();  // Navigate back to the previous screen
    }, 3000);
  };

  const closeWebView = () => {
    setShowWebView(false);
    setCurrentUrl(null); // Reset the URL
  };

  console.log("currentUrl",currentUrl);
  

  // const handleDownloadPress = async url => {
  //   try {
  //     const localFile = `${RNFS.DocumentDirectoryPath}/temp.pdf`;

  //     const options = {
  //       fromUrl: url,
  //       toFile: localFile,
  //     };

  //     await RNFS.downloadFile(options).promise;

  //     await Share.open({
  //       url: `file://${localFile}`,
  //       type: 'application/pdf',
  //     });
  //     navigation.goBack();
  //     setDocumentDownloaded(true);
  //   } catch (error) {
  //     console.error('Download or Share error:', error);
  //   }
  // };

  const mimeTypeMap = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'bmp': 'image/bmp',
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'csv': 'text/csv',
  };

  const getFileExtension = (url) => {
    return url.split('.').pop();
  };
  
  
  // const handleDownloadPress = async url => {
  //   try {
  //     const fileExtension = getFileExtension(url);
  //     const fileName = `temp.${fileExtension}`;
      
  //     // For Android, use ExternalStorageDirectoryPath or a specific public directory
  //     let localFile;
  //     if (Platform.OS === 'android') {
  //       localFile = `${RNFS.ExternalStorageDirectoryPath}/${fileName}`;
  //     } else {
  //       // For iOS, continue using DocumentDirectoryPath or another app-specific directory
  //       localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;
  //     }

  //     console.log("localFile",localFile);
  
  //     const options = {
  //       fromUrl: url,
  //       toFile: localFile,
  //     };
  
  //     console.log("options",options);

  //     await RNFS.downloadFile(options).promise;
  
  //     console.log(`File downloaded to ${localFile}`);
  //     // Update state or navigate as required
  //   } catch (error) {
  //     console.error('Download error:', error);
  //   }
  // };
  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission Required",
            message: "This app needs access to your storage to download files",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };
  
  const handleDownloadPress = async url => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        console.log('Storage permission denied');
        return;
      }
  
      const fileExtension = getFileExtension(url);
      const fileName = `temp.${fileExtension}`;
      const localFile = `${RNFS.ExternalStorageDirectoryPath}/${fileName}`;
  
      // Create the directory if it does not exist
      await RNFS.mkdir(RNFS.ExternalStorageDirectoryPath);
  
      const options = {
        fromUrl: url,
        toFile: localFile,
      };
  
      await RNFS.downloadFile(options).promise;
  
      console.log(`File downloaded to ${localFile}`);
    } catch (error) {
      console.error('Download error:', error);
    }
  };
  

  function SaveDocs() {
    console.log("Documents",Documents);
    DocumentsList.update(s => {
      s.documentsList = Documents;
    });
    navigation.navigate(ROUTES.ECSERVICE);
  }

  return (
    <>
     {showWebView ? (
      <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: currentUrl.replace("http://%27https//", "https://").replace("'", "") }}
        // onNavigationStateChange={onWebViewNavigationStateChange}
        // ... existing WebView props ...
        onNavigationStateChange={(navState) => {
          console.log("navState",navState);

    // navigation.goBack();
        }}
        
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
      />
      <Button title="Close" onPress={closeWebView} />
      <Text style={{color:COLORS.black}}>Downloaded Successfully</Text>
    </View>
    ) : 
    (
      loading === true || loading === 'true' ? (
        <>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
              marginTop: 10,
            }}>
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
              }}>
              {serviceName}
            </Text>
          </View>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        </>
      ) : (
        
        <>
          <ScrollView style={styles.maincontainer}>
            <View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginVertical: 10,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                      marginLeft: 10,
                      color: COLORS.black,
                    }}>
                    Documents
                  </Text>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={SaveDocs}
                    style={{
                      backgroundColor: COLORS.primary,
                      padding: 10,
                      borderRadius: 10,
                      paddingHorizontal: 20,
                    }}>
                    <Text style={{color: 'white'}}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {1 === 1 && (
              <View style={styles.container}>
                {Documents.map((data, index) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    key={index}>
                    <View>
                      <Text style={{color: COLORS.black}}> {data.name}</Text>
                    </View>
                    <View>
                      <Text style={{color: COLORS.black}}>
                        {data.uploadedDate.toDateString()}
                      </Text>
                    </View>
                  </View>
                ))}

                {ExistingDocuments.map((data, index) => (
                  <TouchableOpacity
                    key={index}
                    // onPress={() => handleDownloadPress(`${API_URL}/${data}`)}
                    onPress={() => handleLinkPress(`${API_URL}/${data}`)}
                    >
                    <View
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                      }}>
                      <Text style={{color: COLORS.black}}>
                        Document-{index + 1}
                      </Text>
                      {/* <Text
                        style={{
                          color: COLORS.white,
                          backgroundColor: COLORS.primary,
                          borderRadius: 20,
                        }}
                        onPress={() =>
                          handleDownloadPress(`${API_URL}/${data}`)
                        }
                        >
                        {'   '}Share{'   '}
                      </Text> */}
                    </View>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  onPress={handleDocPick}
                  style={{
                    backgroundColor: COLORS.primary,
                    padding: 10,
                    borderRadius: 10,
                    paddingHorizontal: 20,
                    marginTop: 10,
                  }}>
                  <Text style={{color: 'white', textAlign: 'center'}}>
                    Select Files
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </>
      )
      )}
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
    borderWidth: 2,
  },
  buttonNotActiveText: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonActive: {
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
    padding: 10,
    marginTop: 10,
  },
  buttonActiveText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
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
    padding: 10,
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
    resizeMode: 'contain',
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
    padding: 10,
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
