import React, { useState, useRef,useEffect } from 'react';
import { Dimensions, Text, View,ActivityIndicator,TextInput,TouchableOpacity } from 'react-native';
import MapView, { Callout, Marker, Polygon } from 'react-native-maps';
import * as Location from 'expo-location';
import { COLORS, ROUTES, IMGS } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Geofencing} from '../../../store';
import axios from 'axios';
import { PropertyId,ServiceName,ServiceId,UserToken,DataTable} from '../../../store';
const { width, height } = Dimensions.get('window');

const GeoFencing = ({navigation}) => {
  const { serviceId } = ServiceId.useState((s) => s);
  console.warn(serviceId)
   const { userToken } = UserToken.useState((s) => s);
   const [location, setLocation] = useState(null);
    const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const[locateme,setLocateMe]=useState(false);
  const[coordinatesList,setcoordinatesList]=useState([]);
const mapRef = useRef(null); 
   useEffect(() => {
    
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
       console.log(status)
      if (status !== 'granted') {
        // Handle permission denied
        return;
      }
     else{
       
      let { coords } = await Location.getCurrentPositionAsync({});
      setLocation(coords);
      console.log(coords)
      
     }
    })();
  }, []);

   const handleLocate = async () => { 
     setLocateMe(true)
if (mapRef.current) {
        // Animate the map to the user's location
        mapRef.current.animateToRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.0922 * 1.5,
          longitudeDelta: 0.0421 * 1.5,
        });
      }
   }
  const [region, setRegion] = useState({
    latitude: 24.889831,
    longitude: 67.0672087,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5 * (width / height),
  });

  const [polygons, setPolygons] = useState([]);

  const toggle = (polygon) => {
    if (polygon.open) {
      polygon.marker.hideCallout();
    } else {
      polygon.marker.showCallout();
    }

    polygon.open = !polygon.open;

    // Close callout if marker is deleted
    if (!polygon.open) {
      deleteMarker(polygon);
    }
  };

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;

    let updatedPolygons;
const cooObj=[...coordinatesList]
    if (polygons.length >= 4) {
      const lastPolygon = polygons[polygons.length - 1];
      const updatedCoordinates = [...lastPolygon.coordinates, coordinate];
      const updatedPolygon = { ...lastPolygon, coordinates: updatedCoordinates };
      updatedPolygons = [...polygons.slice(0, polygons.length - 1), updatedPolygon];
    } else {
      const newPolygon = {
        coordinates: [coordinate],
        open: false,
      };
      cooObj.push(newPolygon.coordinates[0])
      console.log(cooObj)
      setcoordinatesList(cooObj)
      updatedPolygons = [...polygons, newPolygon];
    }

    setPolygons(updatedPolygons);
  };

  const deletePolygon = (polygon) => {
    const updatedPolygons = polygons.filter((item) => item !== polygon);
    setPolygons(updatedPolygons);
  };

  const deleteMarker = (polygon) => {
    const updatedPolygons = polygons.map((item) => {
      if (item === polygon) {
        return { ...item, open: false };
      }
      return item;
    });
    setPolygons(updatedPolygons);
  };

  const renderDeleteOption = (polygon) => {
    return (
      <Callout>
        <View>
          <Text onPress={() => deleteMarker(polygon)}>Delete</Text>
        </View>
      </Callout>
    );
  };

  const handleSearch = async () => {
    if (!searchValue) return;

    try {
      const geocode = await Location.geocodeAsync(searchValue);
      if (geocode.length > 0) {
        const firstResult = geocode[0];
        const { latitude, longitude } = firstResult;
        setSearchResult({ latitude, longitude });
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.0922 * 1.5,
            longitudeDelta: 0.0421 * 1.5,
          });
        }
      } else {
        // Handle no results found
      }
    } catch (error) {
      // Handle error
    }
  };


  async function handleSaveFencing(){
  console.log(coordinatesList)
  const formData = new FormData();
  formData.append("status", "Completed");
  formData.append("geo_fencing", JSON.stringify(coordinatesList));
  formData.append("geo_tagging", []);



    formData.append("images",[]);
  



    formData.append("documents",[]);
  

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
    navigation.navigate(ROUTES.TASKS_DETAIL);
  } catch (error) {
    console.log(error);
  }
  if(coordinatesList.length != 0){
     Geofencing.update((s) => {
        s.geofencing = coordinatesList;
      })
   navigation.navigate(ROUTES.PROPERTYVISIT)
  }
  else{
    alert("Please do the fencing")
  }
}
  return (
    <>
{
  location === null ?
  <>
  <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
        <Ionicons name="ios-arrow-back" size={24} onPress={() => navigation.goBack()} />
        <Text style={{ fontSize: 24, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', fontWeight: 'bold', marginLeft: 10 }}>
          GeoFencing
        </Text>
      </View>
 <View style={styles.loaderContainer}>
 
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
      </>

      :
<View style={styles.container}>
<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10, justifyContent:'space-between',paddingHorizontal:10 }}>

<View >
       
        <Text style={{ fontSize: 24, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', fontWeight: 'bold', marginLeft: 10 }}>
        <Ionicons name="ios-arrow-back" size={24} onPress={() => navigation.goBack()} />   GeoFencing
        </Text>
        </View>
        <View >
           <TouchableOpacity  onPress={handleSaveFencing} style={{backgroundColor:COLORS.primary,borderRadius:10,padding:10}}>
             <Text style={{color:'white'}}>
               Save
             </Text>
            </TouchableOpacity>
        </View>
      </View>
       
       <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter location or latitude,longitude values"
              value={searchValue}
              onChangeText={setSearchValue}
               placeholderTextColor={COLORS.primary}
            />
            <TouchableOpacity  onPress={handleSearch}>
              <Ionicons name="search" size={24} color={COLORS.primary} />
            </TouchableOpacity>

            <TouchableOpacity  onPress={handleLocate}>
              <Ionicons name="locate-sharp" size={28} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
      <MapView style={styles.map}  ref={mapRef} onPress={handleMapPress}>
      {
        locateme &&
       <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
          />
      }
          {searchResult && (
              <Marker
                coordinate={{
                  latitude: searchResult.latitude,
                  longitude: searchResult.longitude,
                }}
              />
            )}
        {polygons.map((polygon, index) => (
          <View key={index}>
            <Polygon
              fillColor='rgba(255, 0, 0, 0.5)'
              coordinates={polygon.coordinates}
              onPress={() => toggle(polygon)}
            />
            <Marker ref={(ref) => (polygon.marker = ref)} coordinate={polygon.coordinates[0]}>
              {polygon.open && renderDeleteOption(polygon)}
              <Callout>
                <Text>Hello!</Text>
              </Callout>
            </Marker>
          </View>
        ))}

        {polygons.length >= 3 && (
          <Polygon
            fillColor='rgba(255, 0, 0, 0.5)'
            coordinates={polygons.flatMap((polygon) => polygon.coordinates)}
          />
        )}
      </MapView>
    </View>

}
    </>
    
  );
};

const styles = {
  container: {
    alignItems: 'stretch',
    flex: 1,
  },
  map: {
    flex: 1,
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
    color:COLORS.primary
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
};

export default GeoFencing;

