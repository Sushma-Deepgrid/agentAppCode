import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MapView, {Marker, Polygon} from 'react-native-maps';
import {COLORS, ROUTES, IMGS} from '../../constants';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  PropertyId,
  ServiceName,
  ServiceId,
  UserToken,
  DataTable,
} from '../../../store';
import Geolocation from '@react-native-community/geolocation';
import {API_URL} from '@env';

export default function EnterLocation({navigation, route}) {
  console.log('navi', navigation);
  console.log('Route params:', route.params);
  const gpsCapture = route.params?.gpsCapture;
  console.log('gpsCapture', gpsCapture);
  const {serviceName} = ServiceName.useState(s => s);
  const {serviceId} = ServiceId.useState(s => s);
  // console.warn(serviceId)
  const {userToken} = UserToken.useState(s => s);
  const [mapRegion, setMapRegion] = useState();
  const [Arrayposition, setArrayposition] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [PolygonCoordsArray, setPolygonCoordsArray] = useState(null);
  const [Loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [latitudeValue, setLatitudeValue] = useState('');
  const [longitudeValue, setLongitudeValue] = useState('');

  useEffect(() => {
    setLoading(true);
    if (gpsCapture) {
      getLocation();
    }else{
      setLoading(false);
      console.log("no gps");
    }
  }, [gpsCapture]);

  async function doneFencing(e) {
    setLoading(true);
    e.preventDefault();
    setPolygonCoordsArray(Arrayposition);

    console.log(Arrayposition, serviceId);
    const finalGeofencedObj = [];
    for (let i = 0; i < Arrayposition.length; i++) {
      finalGeofencedObj.push({
        latitude: Number(Arrayposition[i].latitude),
        longitude: Number(Arrayposition[i].longitude),
      });
    }
    console.log(finalGeofencedObj);

    const formData = new FormData();
    formData.append('status', 'Completed');
    if (Arrayposition != null) {
      if (Arrayposition.length != 0) {
        formData.append('geo_fencing', JSON.stringify(finalGeofencedObj));
      } else {
        formData.append('geo_fencing', []);
      }
    }
    formData.append('geo_tagging', []);
    formData.append('images', []);
    formData.append('documents', []);

    try {
      const response = await axios.put(
        `${API_URL}/user/edit-task/${serviceId}`,
        formData,
        {
          headers: {
            Authorization: 'Bearer ' + userToken,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      setLoading(false);
      console.log(response);

      navigation.navigate(ROUTES.TASKS_DETAIL);
    } catch (error) {
      console.log(error);
    }

    // navigation.navigate(ROUTES.TASKS_DETAIL);
  }
  const handleSearch = async () => {
    if (longitudeValue != '' && latitudeValue != '') {
      const objLocation = [...Arrayposition];

      objLocation.push({
        latitude: latitudeValue,
        longitude: longitudeValue,
      });

      setArrayposition(objLocation);
      setLatitudeValue("")
      setLongitudeValue("")
    } else {
      alert('Fill Both Latitude and Longitude Values');
    }
  };
  const handleCapture = async () => {
    getLocation();
  };

  function DeletePointFun(index) {
    console.log(index);
    const objDel = [...Arrayposition];
    objDel.splice(index, 1);
    setArrayposition(objDel);
  }

  const getLocation = () => {
    setLoading(true);

    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLatitudeValue(String(latitude));
        setLongitudeValue(String(longitude));
        setLoading(false);
      },
      error => {
        console.log(error.message);
        setLoading(false);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

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
                color: COLORS.black,
              }}>
              Back
            </Text>
          </View>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        </>
      ) : (
        <View style={styles.container}>
          <View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 20,
                marginTop: 10,
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
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
                    fontWeight: 'bold',
                    marginLeft: 10,
                    color: COLORS.black,
                  }}>
                  Back
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  onPress={doneFencing}
                  style={{
                    backgroundColor: `${COLORS.primary}`,
                    borderRadius: 5,
                    padding: 5,
                    marginRight: 10,
                  }}>
                  <Text style={{color: 'white', textAlign: 'center'}}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.searchContainer}>
            <View>
              <TextInput
                style={styles.searchInput}
                placeholder="Enter latitude value"
                value={latitudeValue}
                onChangeText={setLatitudeValue}
                placeholderTextColor={COLORS.primary}
              />

              <TextInput
                style={{...styles.searchInput, marginTop: 10}}
                placeholder="Enter Longitude value"
                value={longitudeValue}
                onChangeText={setLongitudeValue}
                placeholderTextColor={COLORS.primary}
              />
            </View>
            <View style={styles.searchContainer}>
              <View>
                {gpsCapture ? (
                  <TouchableOpacity
                    style={{
                      backgroundColor: `${COLORS.primary}`,
                      borderRadius: 5,
                      padding: 5,
                      margin: 10,
                    }}
                    onPress={handleCapture}>
                    <Text style={{color: 'white', textAlign: 'center'}}>
                      {' '}
                      Capture{' '}
                    </Text>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                  style={{
                    backgroundColor: `${COLORS.primary}`,
                    borderRadius: 5,
                    padding: 5,
                    margin: 10,
                  }}
                  onPress={handleSearch}>
                  <Text style={{color: 'white', textAlign: 'center'}}>
                    {' '}
                    Go{' '}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{paddingHorizontal: 5}}>
            {Arrayposition.length != 0 && (
              <>
                {Arrayposition.map((marker, index) => (
                  <View
                    key={index}
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{color: COLORS.black}}>
                      Point-{`${index + 1}`} : {marker.latitude},
                      {marker.longitude}
                    </Text>
                    <Ionicons
                      name="trash"
                      color="red"
                      size={24}
                      onPress={() => DeletePointFun(index)}
                    />
                  </View>
                ))}
              </>
            )}
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  map: {
    flex: 1,
  },
  separator: {
    marginVertical: 8,
  },
  loaderContainer: {
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchInput: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginRight: 10,
    color: COLORS.primary,
  },
  searchButton: {
    backgroundColor: '#2196F3',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
