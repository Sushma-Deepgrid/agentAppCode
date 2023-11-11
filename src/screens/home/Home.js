import { StyleSheet, Text, View, TouchableOpacity, ScrollView,RefreshControl } from 'react-native';
import React,{useEffect,useState} from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { COLORS,ROUTES } from '../../constants';
import { VictoryPie } from "victory-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { UserToken,PropertyId,ServiceName,ServiceId } from '../../../store';
import SelectDropdown from 'react-native-select-dropdown';
import { API_URL } from '@env';

const Home = ({navigation}) => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  const { userToken } = UserToken.useState((s) => s);
  // console.log(userToken);
  // useEffect(() => {
  //   async function fetchTrackApiData() {
  //     // console.log(userToken)
  //     try {
  //       const response = await axios.get(
  //         `${API_URL}/user/get-tasks`,
  //         { headers: {
  //           'Authorization': 'Bearer ' + userToken
  //         }}
  //       );

  //       // await  console.log(response.data.tasks);
  //       // console.warn(response.data.tasks);
  //      settasksData(response.data.tasks)
  //      settasksDataUsers(response.data.tasks)
  //     } catch (error) {
  //       await  console.warn(error);
  //       // window.alert("Can't Assign Same Track Name")
  //     }
  //   }
  //   fetchTrackApiData();
  // }, [refreshing]);

useFocusEffect(
  React.useCallback(() => {
    let isActive = true;
    
    const fetchTrackApiData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/user/get-tasks`,
          { headers: { 'Authorization': 'Bearer ' + userToken }}
        );
        if (isActive) {
          settasksData(response.data.tasks);
          settasksDataUsers(response.data.tasks);
        }
      } catch (error) {
        console.warn(error);
      }
    };

    fetchTrackApiData();

    // Returned function will run when the component is unmounted or the screen loses focus
    return () => {
      isActive = false;
    };
  }, [userToken])
);

  const [filteredtasksData, setFilteredtasksData] = useState([]);
  const [tasksDataUsers, settasksDataUsers]=useState([])
  const [tasksData,settasksData] = useState([])
  const Status = ["All","Completed", "Pending", "Ongoing"]
  const [selectedStatus, setSelectedStatus] = useState('');
 
const handleStatusChange = (index) => {
    if (index !== 0) {
     
      if(index === "All"){
        setSelectedStatus("Status")
        async function fetchTrackApiData() {
          // console.log(userToken)
          try {
            const response = await axios.get(
              `${API_URL}/user/get-tasks`,
              { headers: {
                'Authorization': 'Bearer ' + userToken
              }}
            );
    
            // await  console.log(response.data.tasks);
            // console.warn(response.data.tasks);
            // setSelectedStatus("Status")
           setFilteredtasksData(response.data.tasks)
          } catch (error) {
            await  console.warn(error);
            // window.alert("Can't Assign Same Track Name")
          }
        }
        fetchTrackApiData();
      }
      else{
        setSelectedStatus(index);
        const filteredData = tasksData.filter(item => item.status === index);
        console.log(filteredData)
        setFilteredtasksData(filteredData)
      }
      console.log(index)
    }
  };

  const data = [
    { y: 40, x: '40%' },
    { y: 60, x: '60%' }
  ];

  const colors = [COLORS.dark, COLORS.primary];
  return (
    <View
      style={styles.maincontainer}>
      <Text style={styles.heading}>Dashboard</Text>
      {/* <View style={{ ...styles.flexStyle }}>


        <Text style={{
          position: 'absolute',
          top: 115,
          left: '45%',
          color: COLORS.primary,
          fontWeight: 'bold'
        }}> {data[1].x}
        </Text>

        <VictoryPie
          data={data}
          width={250}
          height={250}
          innerRadius={50}
          colorScale={colors}
          style={{
            labels: {
              fill: 'none'
            }
          }}

        />

      </View> */}
       {/* <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ marginRight: 5 }}>
            <Icon name="circle" size={18} color={COLORS.dark} />
          </Text>

          <Text>Complete</Text>
        </View>

        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ marginRight: 5 }}>
            <Icon name="circle" size={18} color={COLORS.primary} />
          </Text>

          <Text>InCompleted</Text>
        </View>

      </View> */}

       <View style={{ marginTop: 30 }}>
        <View style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 10,justifyContent:'space-between' }}>

        <Text style={{ fontSize: 20, color:COLORS.black, }}>
          My Tasks
        </Text>

        <Text>
        <SelectDropdown
                  data={Status}
                  defaultButtonText="Status"
                  buttonStyle={{ width: 125, backgroundColor: COLORS.primary, borderRadius: 10,height:35 }}
                  buttonTextStyle={{ color: 'white' }}
                  defaultValue={selectedStatus === "All" ? "Status" : selectedStatus}
                  onSelect={(index) => handleStatusChange(index)}
                 
                  rowTextForSelection={(item) => item}
                  disabledItemIndices={[0]}
                />
        </Text>
        </View>
        
        {/* if(data.service_name === 'Geofencing'){
              navigation.navigate(ROUTES.GEOFENCING)
              ServiceName.update((s) => {
                s.serviceName = data.service_name;
              })
              ServiceId.update((s) => {
                s.serviceId = data.service_id;
              })}
            else{
              navigation.navigate(ROUTES.ECSERVICE)
              ServiceName.update((s) => {
                s.serviceName = data.service_name;
              })
              ServiceId.update((s) => {
                s.serviceId = data.service_id;
              })
            } */}
          <ScrollView style={{height:'98%'}}  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }>
            {
              (selectedStatus ? filteredtasksData : tasksData).map((data, index) => (
                <TouchableOpacity key={index} onPress={() => { 

                  PropertyId.update((s) => {
                    s.propertyId = data.property_id;
                  })
                   navigation.navigate(ROUTES.TASKS_DETAIL)
                 
                } } >
                  <View style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 10,justifyContent:'space-between' }}>
                  <View style={{  display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <View>
                      <Text style={{ marginRight: 10 }}>
                        <IonIcon name="location" size={22} color={COLORS.primary} />
                      </Text>
                    </View>
                    <View>
                      <Text style={{color:COLORS.black}}>
                        {data.service_name}
                      </Text>
                      <Text style={{color:COLORS.black}}>
                        {data.property.property_name}
                      </Text>
                    </View>

                  </View>
                    <View>
                      <Text>
                        {
        data.status === 'Completed' &&
        <Text style={{color:'green',fontWeight:'bold'}}>
         Completed
        </Text>
      }
      {
        data.status === 'Ongoing' &&
        <Text style={{color:'orange',fontWeight:'bold'}}>
         Ongoing
        </Text>
      }
       {
        data.status === "Pending" &&
        <Text style={{color:'red',fontWeight:'bold'}}>
         Pending
        </Text>
      }
                      </Text>
                    </View>
                  </View>
                 
                </TouchableOpacity>
              ))
            }
          </ScrollView>

        

      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  flexStyle: {
    display: 'flex',
    alignItems: 'center'
  },
  maincontainer: {
    padding: 20,
    backgroundColor: '#fff',
    height: '100%',
    marginBottom:70
  },
  heading: {
    color:COLORS.black,
    textAlign: 'center',
    fontSize: 30
  }
});
