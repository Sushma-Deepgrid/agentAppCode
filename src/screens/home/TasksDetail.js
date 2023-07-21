import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity,View,Image,ScrollView,Button,RefreshControl } from 'react-native';
import { COLORS, ROUTES, IMGS } from '../../constants';
import { PropertyId,UserToken,ServiceName,ServiceId } from '../../../store';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
const TasksDetails = ({ navigation }) => {

  const { propertyId } = PropertyId.useState((s) => s);

  const [propertyImage, setpropertyImage] = React.useState('')
  const [propertyID, setpropertyID] = React.useState('')
  const [propertySize, setpropertySize] = React.useState('')
  const [propertyDes, setpropertyDes] = React.useState('')
  const [propertyOwnerName, setpropertyOwnerName] = React.useState('')
  const [propertyAddress, setpropertyAddress] = React.useState('')


  const [propertiesData, setpropertiesData] = React.useState([]);

  const { userToken } = UserToken.useState((s) => s);
  // console.warn(userToken);
  const [refreshing, setRefreshing] = React.useState(false);

const onRefresh = React.useCallback(() => {
  setRefreshing(true);
  setTimeout(() => {
    setRefreshing(false);
  }, 2000);
}, []);
  useEffect(() => {
   
    async function fetchTrackApiData() {
      
      // console.warn(`Bearer ${userToken}`)
      try {
        const response = await axios.get(
          `https://aagama2.adgrid.in/user/get-tasks`,
          { headers: {
            'Authorization': 'Bearer ' + userToken
          }}
        );

        await  console.log(response.data.tasks);
        const propertyObj = []
      for(let i=0;i<response.data.tasks.length;i++){
        if(response.data.tasks[i].property_id === propertyId){
          propertyObj.push(response.data.tasks[i])
         
        }
      }
      // console.warn(propertyObj[0].property)

const serviceObj=[]
      for(let j=0;j<propertyObj.length;j++){
      serviceObj.push(propertyObj[j].service_name)
      }

      const tasksObj=[]
      for(let j=0;j<propertyObj.length;j++){
        tasksObj.push(propertyObj[j].task_id)
      }

      const statusObj=[]
      for(let j=0;j<propertyObj.length;j++){
        statusObj.push(propertyObj[j].status)
      }
      
const propertyObject = propertyObj[0].property

const updatedPropertyObject = {
  ...propertyObject,
  "property_id": propertyObj[0].property_id
};


const finalobj={
  'services':serviceObj,
  'property':updatedPropertyObject,
  'tasks':tasksObj,
  'status':statusObj
}

// console.warn(finalobj.property.images[0])
setpropertiesData(finalobj)
setpropertyImage(`https://aagama2.adgrid.in/${finalobj.property.images[0]}`)
setpropertyID(finalobj.property.propert_name)
setpropertySize(finalobj.property.area)
setpropertyDes(finalobj.property.description)
// setpropertyOwnerName(propertiesData[i].OwnerName)
setpropertyAddress(finalobj.property.address)

let serviceFinalObj = []
for(let k=0;k<finalobj.services.length;k++){
 
    serviceFinalObj.push({heading: "", title: finalobj.services[k], description: "",path: '',id:finalobj.tasks[k],status:finalobj.status[k]})
  
}
//  console.warn(serviceFinalObj)

setstepsDetail(serviceFinalObj)


      } catch (error) {
        await  console.warn(error);
        // window.alert("Can't Assign Same Track Name")
      }
    }
    fetchTrackApiData();
  }, [refreshing]);
 
  
  const [numberOfSteps, setNumberOfSteps] = useState(5);
  const [completedSteps, setCompletedSteps] = useState(0);

  // const stepsDetail = [
  //   { heading: "12 May", title: "You have taken test drive", description: "2010 White Alto LXI and 2 Others" },
  //   { heading: "14 May", title: "Pay Token", description: "for 2010 White Alto LXI" },
  //   { heading: "14 May", title: "Processing your loan", description: "Usually take 3-6 days for different banks" },
  //   { heading: "", title: "Take Car Delivery", description: "2010 White Alto LXI and 2 Others" },
  //   { heading: "", title: "Start Ownership Transfer Process", description: " Please bring the list of documents at the time of delivery" }
  // ];
const [stepsDetail,setstepsDetail] = useState([]);
const [opencall,setopencall] = useState(false);


  const prev = () => {
    let step = completedSteps;
    if (step > 0) {
      step = step - 1;
      setCompletedSteps(step);
    }
  }

  const next = () => {
    let step = completedSteps;
    console.log(step,"jjjjjj")
    if (step < numberOfSteps) {
      step = step + 1;
      setCompletedSteps(step);
    }
    
  }

const Steps = ({ stepsDetail, completedSteps }) => {
  return (
    <View style={styles.stepList}>
      {stepsDetail.map((step, index) => {
        let status = "";
        if (index < completedSteps) {
          status = "completed"
        }
        if (index > completedSteps) {
          status = "incomplete"
        }
        if (index === completedSteps) {
          status = "current"
        }
        return <Step key={index} status={step.status} heading={step.heading} title={step.title} description={step.description} id={step.id} />
      })}
    </View>
  );
}

const Step = ({ status, heading, title, description,id }) => {
  let style = styles.step;
  if (status === "Ongoing") {
    style = styles.currentStep;
  }
  if (status === "completed") {
    style = styles.completedStep;
  }
  if (status === "pending") {
    style = styles.incompleteStep;
  }

  return (
    <ScrollView style={style}>
    <TouchableOpacity onPress={() => { 
      if(title === 'Property Visit'){
navigation.navigate(ROUTES.PROPERTYVISIT)}
else  if(title === 'Geofencing'){
  navigation.navigate(ROUTES.GEOFENCING)
  ServiceName.update((s) => {
    s.serviceName = title;
  })
  ServiceId.update((s) => {
    s.serviceId = id;
  })}
else{
  navigation.navigate(ROUTES.ECSERVICE)
  ServiceName.update((s) => {
    s.serviceName = title;
  })
  ServiceId.update((s) => {
    s.serviceId = id;
  })
}
    } }>
    <View style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexDirection:'row',paddingHorizontal:10}}>
      <Text style={styles.stepTitle}>{title}</Text>
      {
        status === 'Completed' &&
        <Text style={{color:'green',fontWeight:'bold'}}>
         Completed
        </Text>
      }
      {
        status === 'Ongoing' &&
        <Text style={{color:'orange',fontWeight:'bold'}}>
         Ongoing
        </Text>
      }
       {
        status === "Pending" &&
        <Text style={{color:'red',fontWeight:'bold'}}>
         Pending
        </Text>
      }
      </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

return (
  <>
 <ScrollView style={styles.maincontainer}
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }>
 <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginBottom:20, marginTop:10}}>
 <Ionicons name="ios-arrow-back" size={24} onPress={() => navigation.goBack()} />
<Text style={{fontSize:24,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',width:'100%',fontWeight:'bold',marginLeft:10}}>
 Property Details
</Text>
 </View>
 <View>

  
<Image   style={styles.propertyImg}
          source={{
            uri:`${propertyImage}`,
          }} 
        />
 </View>

 <View style={{...styles.flexStyle, paddingTop:20}}>
<Text style={{fontSize:20,fontWeight:'bold'}}>
{propertyID}
</Text>
<Text style={{fontSize:18,fontWeight:'bold'}}>
{propertySize != '' &&
  <Text> {propertySize} sq. yd </Text>
}
</Text>
</View>
<ScrollView >
<Text style={{textAlign:'justify',marginTop:10}}>
{propertyDes}
</Text>
</ScrollView>
<Text style={{fontSize:22,marginVertical:10}}>
Contact Details
</Text>
<Text style={{fontSize:18}}>
{propertyOwnerName}
</Text>
<Text>
{propertyAddress}
</Text>
<Text style={{fontWeight:'bold',fontSize:20,marginTop:30}}>
Services
</Text>
      <View style={styles.container}>
      <View style={styles.stepsCard}>
        <Steps stepsDetail={stepsDetail} completedSteps={completedSteps} />
      </View>
      {/* <View style={{display:'flex',justifyContent:'space-around',alignItems:'center',flexDirection:'row'}}>
        <Button onPress={prev} title="Prev" style={{marginVertical:20}} />
        <Button onPress={next} title="Next" />
      </View> */}
    </View>

 </ScrollView>
 {
  opencall && 

 <View  style={{
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          bottom: 70,
          right: 90,
        }}>
      <TouchableOpacity onPress={() => { alert("Comming Soon...") }} style={{marginBottom:10,backgroundColor:COLORS.primary,borderRadius:15,padding:5}}>
        <Text style={{color:'white'}}>
         Audio Call
        </Text>
      </TouchableOpacity>
<TouchableOpacity onPress={() => { alert("Comming Soon...") }} style={{marginBottom:10,backgroundColor:COLORS.primary,borderRadius:15,padding:5}}>
        <Text style={{color:'white'}}>
         Video Call
        </Text>
      </TouchableOpacity>
      </View>
 }
<TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.2)',
          alignItems: 'center',
          justifyContent: 'center',
          width: 70,
          position: 'absolute',
          bottom: 80,
          right: 10,
          height: 70,
          backgroundColor: COLORS.primary,
          borderRadius: 100,
          zIndex: 5,
        }}
        onPress={() => { 
      setopencall(!opencall) }}
      >
        <Ionicons name='ios-call-outline' size={30} color='white' />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.2)',
          alignItems: 'center',
          justifyContent: 'center',
          width: 70,
          position: 'absolute',
          bottom: 160,
          right: 10,
          height: 70,
          backgroundColor: COLORS.primary,
          borderRadius: 100,
          zIndex: 5,
        }}
        onPress={() => { alert("Comming Soon...") }}
      >
        <MaterialIcons name='message' size={30} color='white' />
      </TouchableOpacity>
 </>
);
};

export default TasksDetails;

const styles = StyleSheet.create({
  maincontainer: {
    marginBottom:75,
    paddingHorizontal:20,
    backgroundColor: 'white',
  },
  flexStyle:{
    display:'flex', 
    justifyContent:'space-between',
    flexDirection:'row',
    alignItems:'center',
    width:'100%'
  },
  propertyImg:{
    width:'100%',
    height:100,
    borderRadius:5,
    
  },
  container: {
    width: '100%',
    height: 'auto',
    padding:20
  },
  stepsCard: {
   
    textAlign:'center'
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  stepList: {
    marginBottom: 25,
  },
  step: {
    position: 'relative',
    marginBottom: 25,
    color: '#00b289',
  },
  incompleteStep: {
    position: 'relative',
    marginBottom: 25,
    color: '#00b289',
  },
  currentStep: {
    position: 'relative',
    marginBottom: 25,
    color: '#00b289'
  },
  completedStep: {
    position: 'relative',
    marginBottom: 25,
    color: '#a3aec2',
    backgroundColor: '#00b289',
    borderRadius:30
  },
  stepHeading: {
    fontSize: 14,
    color: '#444a59',
    marginBottom: 5,
    fontWeight: '100',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    textAlign:'left'
  },
  stepDescription: {
    fontSize: 16,
    color: '#444a59',
  },
});
