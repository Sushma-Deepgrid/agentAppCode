import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React,{useEffect,useState} from 'react';
import { COLORS,ROUTES } from '../../constants';
import { VictoryPie } from "victory-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { UserToken,PropertyId,ServiceName,ServiceId } from '../../../store';
const Home = ({navigation}) => {
  const { userToken } = UserToken.useState((s) => s);
  console.log(userToken);
  useEffect(() => {
    async function fetchTrackApiData() {
      console.log(userToken)
      try {
        const response = await axios.get(
          `https://aagama2.adgrid.in/user/get-tasks`,
          { headers: {
            'Authorization': 'Bearer ' + userToken
          }}
        );

        await  console.log(response.data.tasks);
        // console.warn(response.data.tasks);
       settasksData(response.data.tasks)
        
      } catch (error) {
        await  console.warn(error);
        // window.alert("Can't Assign Same Track Name")
      }
    }
    fetchTrackApiData();
  }, [1]);


  const [tasksData,settasksData] = useState([])


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
        <Text style={{ fontSize: 20 }}>
          My Tasks
        </Text>
        

          <ScrollView style={{height:'98%'}}>
            {
              tasksData.map((data, index) => (
                <TouchableOpacity key={index} >
                  <View style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                    <View>
                      <Text style={{ marginRight: 10 }}>
                        <IonIcon name="location" size={22} color={COLORS.primary} />
                      </Text>
                    </View>
                    <View>
                      <Text>
                        {data.service_name}
                      </Text>
                      <Text>
                        {data.property.property_name}
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
    height: '100%'
  },
  heading: {
    textAlign: 'center',
    fontSize: 30
  }
});
