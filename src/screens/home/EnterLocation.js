import React,{useState,useEffect} from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity,ActivityIndicator } from "react-native"
import * as Location from 'expo-location';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { COLORS, ROUTES, IMGS } from '../../constants';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PropertyId, ServiceName, ServiceId, UserToken, DataTable } from '../../../store';

export default function EnterLocation({navigation}) {
 

    const { serviceName } = ServiceName.useState((s) => s);
    const { serviceId } = ServiceId.useState((s) => s);
    // console.warn(serviceId)
    const { userToken } = UserToken.useState((s) => s);
    const [mapRegion, setMapRegion] = useState()
   const [Arrayposition, setArrayposition] = useState([])
     const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [PolygonCoordsArray, setPolygonCoordsArray] = useState(null);
    const [Loader, setLoader] = useState(false);
    const [loading, setLoading] = useState(false);
    const [latitudeValue, setLatitudeValue] = useState('');
    const [longitudeValue, setLongitudeValue] = useState('');
    
    
  const getLocation = async () => {
   
    
     const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission denied');
      return;
    }
if(Arrayposition === null){
  const objLocation=[]
  setLoader(true)
  try {
    const { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const { latitude, longitude } = coords;
   

     if (Arrayposition === null) {
           objLocation.push({
              latitude:coords.latitude,
              longitude:coords.longitude
            })

            setArrayposition(objLocation)
  
            console.log(objLocation,"Initial")
            setLoader(false)
        }
    else {
          
              if ((coords.latitude == Arrayposition[Arrayposition.length - 1].latitude) || (coords.longitude == Arrayposition[Arrayposition.length - 1].longitude)) {
                      console.log(objLocation,"same")
                
                      setLoader(false)
                }
              else if ((coords.latitude != Arrayposition[Arrayposition.length - 1].latitude) || (coords.longitude != Arrayposition[Arrayposition.length - 1].longitude)) {
                          objLocation.push({
                              latitude:coords.latitude,
                              longitude:coords.longitude
                            })
                          console.log(objLocation)
                          setArrayposition(objLocation)
                          setLoader(false)
                }
        }
    setLatitude(coords.latitude)
    setLongitude(coords.longitude)
    console.log(Arrayposition)
    // Use latitude and longitude values as needed
  } catch (error) {
    // Handle error getting location
  }
  
}

else{
  const objLocation=[...Arrayposition]
  setLoader(true)
  try {
    const { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const { latitude, longitude } = coords;
   

     if (Arrayposition.length === 0) {
           objLocation.push({
              latitude:coords.latitude,
              longitude:coords.longitude
            })

            setArrayposition(objLocation)
  
            console.log(objLocation,"Initial")
            setLoader(false)
        }
    else {
          
              if ((coords.latitude == Arrayposition[Arrayposition.length - 1].latitude) || (coords.longitude == Arrayposition[Arrayposition.length - 1].longitude)) {
                      console.log(objLocation,"same")
                
                      setLoader(false)
                }
              else if ((coords.latitude != Arrayposition[Arrayposition.length - 1].latitude) || (coords.longitude != Arrayposition[Arrayposition.length - 1].longitude)) {
                          objLocation.push({
                              latitude:coords.latitude,
                              longitude:coords.longitude
                            })
                          console.log(objLocation,"not same")
                          setArrayposition(objLocation)
                          setLoader(false)
                }
        }
    setLatitude(coords.latitude)
    setLongitude(coords.longitude)
    console.log(Arrayposition)

  } catch (error) {
   
  }
}
  };
  
  
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
  
  async function doneFencing(e) {
    setLoading(true)
      e.preventDefault();
      setPolygonCoordsArray(Arrayposition)
     
    
      console.log(Arrayposition,serviceId)
      const finalGeofencedObj=[]
      for(let i=0;i<Arrayposition.length;i++){
        finalGeofencedObj.push({
          "latitude":Number(Arrayposition[i].latitude),
          "longitude":Number(Arrayposition[i].longitude)
        })
      }
      console.log(finalGeofencedObj)
  
      const formData = new FormData();
      formData.append("status", "Completed");
      if(Arrayposition != null){
        if(Arrayposition.length != 0){
          formData.append("geo_fencing", JSON.stringify(finalGeofencedObj));
        }
      else{
        formData.append("geo_fencing", []);
      }}
      formData.append("geo_tagging", []);
      formData.append("images", []);
      formData.append("documents", []);
  
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
        setLoading(false)
        console.log(response);
        
        navigation.navigate(ROUTES.TASKS_DETAIL);
      } catch (error) {
        console.log(error);
      }
  
     
      // navigation.navigate(ROUTES.TASKS_DETAIL);
    }
    const handleSearch = async () => {
      if(longitudeValue != '' && latitudeValue != ''){
        const objLocation=[...Arrayposition]

        objLocation.push({
          latitude:latitudeValue,
          longitude:longitudeValue
        })

        setArrayposition(objLocation)
      }
        else{
          alert("Fill Both Latitude and Longitude Values")
        }
      }; 

      function DeletePointFun(index){
        console.log(index)
        const objDel=[...Arrayposition]
        objDel.splice(index,1)
        setArrayposition(objDel)
            }
    return (
      <>
       { (loading === true || loading === 'true') ?
        <>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
              <Ionicons name="ios-arrow-back" size={24} onPress={() => navigation.goBack()} />
              <Text style={{ fontSize: 24, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', fontWeight: 'bold', marginLeft: 10 }}>
              Back
              </Text>
            </View>
       <View style={styles.loaderContainer}>
       
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
            </>
            :
      <View style={styles.container}>
        <View>
                
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10,justifyContent:'space-between' }}>
                  <View style={{ display: 'flex', flexDirection: 'row',alignItems: 'center'}}>
                  <Ionicons name="ios-arrow-back" size={24} onPress={() => navigation.goBack()} />
                  <Text style={{ fontSize: 24, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',  fontWeight: 'bold' }}>
                    Back
                  </Text>
                  </View>
                  <View >
                  <TouchableOpacity onPress={doneFencing} style={{ backgroundColor:`${COLORS.primary}`,borderRadius:5,padding:5,marginRight:10 }} >
           
           <Text style={{color:'white',textAlign:'center'}}>
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
              style={{...styles.searchInput,marginTop:10}}
              placeholder="Enter Longitude value"
              value={longitudeValue}
              onChangeText={setLongitudeValue}
               placeholderTextColor={COLORS.primary}
            />

            </View>
            <TouchableOpacity style={{ backgroundColor:`${COLORS.primary}`,borderRadius:5,padding:5,marginRight:10 }} 
            onPress={handleSearch}>
             <Text style={{color:'white',textAlign:'center'}}> Go </Text>
            </TouchableOpacity>

          </View>
      
         <View style={{paddingHorizontal:5}}>
         {
          Arrayposition.length != 0 &&
  <>
   {Arrayposition.map((marker, index) => (
                 <View key={index} style={{flexDirection:'row',alignItems:'center'}}>
                 <Text>
                   Point-{`${index+1}`} : {marker.latitude},{marker.longitude}
                 </Text>
                 <Ionicons name="trash" color="red" size={24} onPress={() => DeletePointFun(index)} />
 
                     
                 </View>
              ))}
  </>
  
         }
        
       </View>
       
      </View>
  }
      </>
    );
  
  }
 

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
})