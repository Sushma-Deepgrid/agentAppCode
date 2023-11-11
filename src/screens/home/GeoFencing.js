import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import SelectDropdown from 'react-native-select-dropdown';
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
import * as geolib from 'geolib';
import {API_URL} from '@env';

export default function GeoFencing({navigation}) {
  const [initialRegion, setInitialRegion] = useState(null);

  const {serviceName} = ServiceName.useState(s => s);
  const {serviceId} = ServiceId.useState(s => s);
  // console.warn(serviceId)
  const {userToken} = UserToken.useState(s => s);
  const [mapRegion, setMapRegion] = useState();
  const [Arrayposition, setArrayposition] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [PolygonCoordsArray, setPolygonCoordsArray] = useState(null);
  const [Loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const Status = ['Completed', 'Pending', 'Ongoing'];
  const [selectedStatus, setSelectedStatus] = useState('');
  const [polygonArea, setPolygonArea] = useState(0);
  const [centroid, setCentroid] = useState([]);

  useEffect(() => {
    async function fetchTrackApiData() {
      // console.warn(`Bearer ${userToken}`)
      try {
        const response = await axios.get(
          `${API_URL}/user/get-task/${serviceId}`,
          {
            headers: {
              Authorization: 'Bearer ' + userToken,
            },
          },
        );

        setSelectedStatus(response.data.task.status);
        setArrayposition(response.data.task.geo_fencing);
        setPolygonCoordsArray(response.data.task.geo_fencing);
        setCentroid(calculatePolygonCentroid(response.data.task.geo_fencing));
        if (
          response.data.task.geo_fencing &&
          response.data.task.geo_fencing.length >= 3
        ) {
          // Geolib needs the coordinates in a specific format
          const coordinates = response.data.task.geo_fencing.map(marker => ({
            latitude: marker.latitude,
            longitude: marker.longitude,
          }));
          console.log(coordinates);
          // Calculate the area using geolib
          const area = geolib.getAreaOfPolygon(coordinates);
          console.log(area);
          const squareYardsConversionFactor = 1.19599;
          const areaInSquareYards = area * squareYardsConversionFactor;
          const reducedNumber = areaInSquareYards.toFixed(3);
          setPolygonArea(reducedNumber);
          // console.log(reducedNumber,"area")
        }

        // console.warn(response.data.task.geo_fencing)
        if (response.data.task.geo_fencing != null) {
          const latitude = response.data.task.geo_fencing[0].latitude;
          const longitude = response.data.task.geo_fencing[0].longitude;

          setInitialRegion({
            latitude,
            longitude,
            latitudeDelta: 0.0005,
            longitudeDelta: 0.0005,
          });
        }
      } catch (error) {
        await console.log(error);
        // window.alert("Can't Assign Same Track Name")
      }
    }
    fetchTrackApiData();
  }, [1]);

  // const getLocation = () => {
  //   setLoader(true);

  //   Geolocation.getCurrentPosition(
  //     position => {
  //       const {latitude, longitude} = position.coords;
  //       const objLocation = [...Arrayposition];

  //       if (!Arrayposition || Arrayposition.length === 0) {
  //         objLocation.push({latitude, longitude});
  //         console.log(objLocation, 'Initial');
  //       } else {
  //         if (
  //           latitude === Arrayposition[Arrayposition.length - 1].latitude ||
  //           longitude === Arrayposition[Arrayposition.length - 1].longitude
  //         ) {
  //           console.log(objLocation, 'same');
  //         } else if (
  //           latitude !== Arrayposition[Arrayposition.length - 1].latitude ||
  //           longitude !== Arrayposition[Arrayposition.length - 1].longitude
  //         ) {
  //           objLocation.push({latitude, longitude});
  //           console.log(objLocation, 'not same');
  //         }
  //       }

  //       setArrayposition(objLocation);
  //       setLatitude(latitude);
  //       setLongitude(longitude);
  //       setLoader(false);
  //     },
  //     error => {
  //       console.log(error.message);
  //       setLoader(false);
  //     },
  //     {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
  //   );
  // };

  const getLocation = () =>{
    console.log("yooo");
    navigation.navigate(ROUTES.ENTERLOCATION,{gpsCapture: true});
  }

  console.log('setPolygonCoordsArray', PolygonCoordsArray);

  const calculatePolygonArea = () => {
    console.log(PolygonCoordsArray, 'pop');
    if (PolygonCoordsArray && PolygonCoordsArray.length >= 3) {
      // Geolib needs the coordinates in a specific format
      const coordinates = PolygonCoordsArray.map(marker => ({
        latitude: marker.latitude,
        longitude: marker.longitude,
      }));
      console.log(coordinates);
      // Calculate the area using geolib
      const area = geolib.getAreaOfPolygon(coordinates);
      console.log(area);
      const squareYardsConversionFactor = 1.19599;
      const areaInSquareYards = area * squareYardsConversionFactor;
      setPolygonArea(areaInSquareYards);
    } else {
      setPolygonArea(0);
    }
  };

  async function doneFencing(e) {
    // setLoading(true)
    e.preventDefault();
    setPolygonCoordsArray(Arrayposition);

    console.log(Arrayposition, serviceId);
    const finalGeofencedObj = [];
    if (Arrayposition != null) {
      if (Arrayposition.length != 0) {
        for (let i = 0; i < Arrayposition.length; i++) {
          finalGeofencedObj.push({
            latitude: Arrayposition[i].latitude,
            longitude: Arrayposition[i].longitude,
          });
        }
      }
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

    console.log(formData);
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

      navigation.goBack();
    } catch (error) {
      console.log(error);
    }

    // navigation.navigate(ROUTES.TASKS_DETAIL);
  }
  const handleStatusChange = index => {
    if (index !== 0) {
      setSelectedStatus(index);
      console.log(index);
    }
  };

  function DeletePointFun(index) {
    console.log(index);
    const objDel = [...Arrayposition];
    objDel.splice(index, 1);
    setArrayposition(objDel);
  }

  const calculatePolygonCentroid = polygonCoordinates => {
    let latitudeSum = 0;
    let longitudeSum = 0;

    for (const coordinate of polygonCoordinates) {
      latitudeSum += coordinate.latitude;
      longitudeSum += coordinate.longitude;
    }

    const centroidLatitude = latitudeSum / polygonCoordinates.length;
    const centroidLongitude = longitudeSum / polygonCoordinates.length;

    return {
      latitude: centroidLatitude,
      longitude: centroidLongitude,
    };
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
              {serviceName}
            </Text>
          </View>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        </>
      ) : (
        <View style={styles.container}>
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
                  color: COLORS.black,
                  marginLeft: 10,
                }}>
                {serviceName}
              </Text>
            </View>
            <View>
              <SelectDropdown
                data={Status}
                defaultButtonText="Select Status"
                buttonStyle={{
                  width: 150,
                  backgroundColor: COLORS.primary,
                  borderRadius: 10,
                  height: 35,
                }}
                buttonTextStyle={{color: 'white'}}
                defaultValue={selectedStatus}
                onSelect={index => handleStatusChange(index)}
                buttonTextAfterSelection={selectedItem => selectedItem}
                rowTextForSelection={item => item}
                disabledItemIndices={[0]}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 5,
              marginBottom: 10,
              marginTop: 10,
            }}>
            {Loader === false ? (
              <TouchableOpacity
                onPress={getLocation}
                style={{
                  backgroundColor: `${COLORS.primary}`,
                  padding: 5,
                  borderRadius: 5,
                }}>
                <Text style={{color: 'white'}}>Capture with GPS</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: `${COLORS.primary}`,
                  padding: 5,
                  borderRadius: 5,
                }}>
                <Text style={{color: 'white'}}>Loading...</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => {
                navigation.navigate(ROUTES.ENTERLOCATION);
              }}
              style={{
                backgroundColor: `${COLORS.primary}`,
                padding: 5,
                borderRadius: 5,
              }}>
              <Text style={{color: 'white'}}>Enter Location</Text>
            </TouchableOpacity>
          </View>
          <View>
            {PolygonCoordsArray != null && (
              <Text
                style={{fontSize: 18, fontWeight: 'bold', color: COLORS.black}}>
                {' '}
                Plot Area: {polygonArea} sq. yd
              </Text>
            )}
          </View>
          <View style={{paddingHorizontal: 5}}>
            {Arrayposition != null && (
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
          {Arrayposition != null && (
            <>
              <MapView style={styles.map} initialRegion={initialRegion}>
                {Arrayposition != null && (
                  <>
                    {Arrayposition.map((marker, index) => (
                      <Marker
                        key={index}
                        coordinate={{
                          latitude: marker.latitude,
                          longitude: marker.longitude,
                        }}
                        title={`Marker ${index + 1}`}
                      />
                    ))}
                  </>
                )}

                {PolygonCoordsArray != null && (
                  <>
                    <Polygon
                      coordinates={PolygonCoordsArray.map(marker => ({
                        latitude: marker.latitude,
                        longitude: marker.longitude,
                      }))}
                      fillColor="rgba(255,0,0,0.2)"
                      strokeColor="red"
                    />
                    <Marker coordinate={centroid}>
                      <View
                        style={{
                          backgroundColor: 'none',
                          padding: 5,
                          borderRadius: 5,
                        }}>
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: 'bold',
                            color: 'black',
                          }}>
                          {polygonArea} sq. yd
                        </Text>
                      </View>
                    </Marker>
                  </>
                )}
              </MapView>

              <View
                style={{
                  flexDirection: 'row',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}>
                <View></View>
                <TouchableOpacity
                  onPress={doneFencing}
                  style={{
                    backgroundColor: `${COLORS.primary}`,
                    borderRadius: 5,
                    marginBottom: 80,
                    padding: 10,
                    marginTop: 10,
                    marginRight: 10,
                  }}>
                  <Text style={{color: 'white', textAlign: 'center'}}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
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
    flex: 1,
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
    flex: 1,
    height: 40,
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
