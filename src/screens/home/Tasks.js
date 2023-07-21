import { StyleSheet, Text, View, TextInput, Image, FlatList, TouchableOpacity } from 'react-native';
import React, { useState,useEffect } from 'react';
import { COLORS, IMGS,ROUTES } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {PropertyId} from '../../../store';
import { UserToken } from '../../../store';
import axios from 'axios';
const Tasks = ({navigation}) => {
  const [items, setItems] = React.useState([])
 
  const { userToken } = UserToken.useState((s) => s);
  console.log(userToken);

  useEffect(() => {
   
    async function fetchTrackApiData() {
      
      console.log(`Bearer ${userToken}`)
      try {
        const response = await axios.get(
          `https://aagama2.adgrid.in/user/get-tasks`,
          { headers: {
            'Authorization': 'Bearer ' + userToken
          }}
        );

        await  console.log(response.data.tasks);
  
        // setItems(response.data.tasks)
        const uniqueProperties = response.data.tasks.reduce((accumulator, item) => {
          if (!accumulator.includes(item.property_id)) {
            accumulator.push(item.property_id);
          }
          return accumulator;
        }, []);

        const uniquePropertyObjects = uniqueProperties.map((propertyId) => {
          const propertyObject = response.data.tasks.find((item) => item.property_id === propertyId).property;
          return {
            property_id: propertyId,
            ...propertyObject
          };
        });
      // console.warn(uniquePropertyObjects.length)
        setItems(uniquePropertyObjects)
      } catch (error) {
        await  console.warn(error);
        // window.alert("Can't Assign Same Track Name")
      }
    }
    fetchTrackApiData();
  }, [1]);

  const [gridView, setgridView] = useState(false);

function openSingleTask(id){
  
  PropertyId.update((s) => {
        s.propertyId = id;
      })
       navigation.navigate(ROUTES.TASKS_DETAIL)
}

  const renderItem = ({ item }) => (
   gridView ?
   <TouchableOpacity style={styles.card} onPress={() => openSingleTask(item.property_id)}>
<View >
      <Image  style={styles.image} 
      source={{
        uri:`https://aagama2.adgrid.in/${item.images[0]}`,
        }}  />
      
      <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', width: '100%', marginVertical: 5 }}>
      {/* <Text style={styles.propertyId}>{item.property_id}</Text> */}
      <Text style={styles.propertyId}>{item.property_name}</Text>
      </View>
      <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', width: '100%', marginVertical: 5 }}>
        <Text style={styles.area}>{item.area} sq. yd</Text>
        {/* <Text style={styles.area}>{new Date(item.created_at).toLocaleDateString()}</Text> */}
      </View>
      <Text style={styles.propertyloaction}>
        {item.address}
      </Text>
    </View>
    </TouchableOpacity>
:

 <TouchableOpacity style={styles.list} onPress={() => openSingleTask(item.property_id)}>
<View style={{display: 'flex',  flexDirection: 'row', alignItems: 'center', width: '100%', marginVertical: 5}} >
<View >
<Image
        style={styles.tinyLogo}
        source={{
          uri:`https://aagama2.adgrid.in/${item.images[0]}`,
        }}
      />

      </View>
      <View >
      <Text style={{...styles.propertyId, marginRight:10}}>{item.property_name}</Text>
      <Text >{item.area} sq. yd</Text>
      </View>

      {/* <View style={{marginRight:10}}>
     
        <Text >{item.area} sq. yd</Text>
        </View> */}
        <View  >
     
      {/* <Text >
      
        {item.address}

      </Text> */}
      </View>
    </View>
     </TouchableOpacity>
    )

   
  
  return (
    <View style={{ ...styles.maincontainer }}>
      <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', width: '100%', alignItems: 'center' }}>

        <View style={{ width: '70%' }}>
          <TextInput
            style={styles.textInputStyle}

            underlineColorAndroid="transparent"
            placeholder="Search"
            placeholderTextColor={COLORS.primary}
          />
        </View>

        <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>

          <Text style={{ marginRight: 10 }}>
            {
              gridView ?
                 <TouchableOpacity>
                  <MaterialIcon name="view-grid" size={30} color={COLORS.dark} />
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => setgridView(true)}>
                  <MaterialIcon name="view-grid-outline" size={30} color={COLORS.primary} />
                </TouchableOpacity>
            }


          </Text>


          <Text style={{ marginRight: 10 }}>
            {
              !gridView ?
                <TouchableOpacity>
                  <Ionicons name="md-list-circle-sharp" size={40} color={COLORS.dark} />
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => setgridView(false)}>
                  <Ionicons name="md-list-circle-outline" size={40} color={COLORS.primary} />
                </TouchableOpacity>
            }


          </Text>


        </View>

      </View>

      <View style={styles.container}>
      {
        gridView ?
<FlatList
key="grid"
          data={items}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
        />
        :
        <FlatList
        key="list"
          data={items}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={1}
        />
      }
        
      </View>
    </View>
  );
};

export default Tasks;

const styles = StyleSheet.create({
  flexStyle: {
    display: 'flex',
    alignItems: 'center'

  },
  maincontainer: {
    padding: 20,
    backgroundColor: '#fff',
    height: '100%'
  },
  
  tinyLogo: {
    width: 50,
    height: 50,
    marginRight:15
  },
  heading: {
    textAlign: 'center',
    fontSize: 30
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'white',
    backgroundColor: '#f2f2f2',
    color: COLORS.primary
  },
  container: {
    paddingTop: 10,
    height:'100%'

  },
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 14,
  },
  image: {
    width: 100,
    height: 100,
    
  },
  propertyId: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  area: {
    fontSize: 12,
    textAlign: 'center',
  },
  propertyloaction: {
    fontSize: 14,
    fontWeight: 'bold',
    width: '100%'
  },

  list:{
    
    backgroundColor:'#f2f2f2',
    margin:5,
    padding:10,
    width:'100%'
  },
  listimage:{
    width: 50,
    height: 50,
    margin:5
  }

});