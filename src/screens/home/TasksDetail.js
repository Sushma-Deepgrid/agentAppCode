import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  View,
  Image,
  Linking,
  ScrollView,
  RefreshControl,
  Dimensions,
  Animated
} from 'react-native'
import { COLORS, ROUTES, IMGS } from '../../constants'
import {
  PropertyId,
  UserToken,
  ServiceName,
  ServiceId,
  Reload
} from '../../../store'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5'
import { API_URL } from '@env';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import axios from 'axios'

const TasksDetails = ({ navigation }) => {
  const { width } = Dimensions.get('window')
  const { propertyId } = PropertyId.useState((s) => s)
  const { reload } = Reload.useState((s) => s)
  // console.warn(reload)

  const [propertyImage, setpropertyImage] = React.useState([])
  const [propertyID, setpropertyID] = React.useState('')
  const [propertySize, setpropertySize] = React.useState('')
  const [propertyDes, setpropertyDes] = React.useState('')
  const [propertyOwnerName, setpropertyOwnerName] = React.useState('')
  const [propertyAddress, setpropertyAddress] = React.useState('')
  const [propertyLocality, setpropertyLocality] = React.useState('')
  const [propertyCity, setpropertyCity] = React.useState('')
  const [propertyState, setpropertyState] = React.useState('')
  const [propertyMandal, setpropertyMandal] = React.useState('')
  const [propertyPincode, setpropertyPincode] = React.useState('')
  const [propertyLat, setpropertyLat] = React.useState('')
  const [propertyLong, setpropertyLong] = React.useState('')

  const [propertiesData, setpropertiesData] = React.useState([])

  const { userToken } = UserToken.useState((s) => s)
  // console.warn(userToken);
  const [refreshing, setRefreshing] = React.useState(false)

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }, [])

  if (reload == 'true') {
    onRefresh()
    Reload.update((s) => {
      s.reload = 'false'
    })
  }
  useEffect(() => {
    async function fetchTrackApiData() {
      // console.warn(`Bearer ${userToken}`)
      try {
        const response = await axios.get(
          `${API_URL}/user/get-tasks`,
          {
            headers: {
              Authorization: 'Bearer ' + userToken
            }
          }
        )

        await console.log(response.data.tasks, 'tasks')
        const propertyObj = []
        for (let i = 0; i < response.data.tasks.length; i++) {
          if (response.data.tasks[i].property_id === propertyId) {
            propertyObj.push(response.data.tasks[i])
          }
        }
        // console.warn(propertyObj[0].property)

        const serviceObj = []
        for (let j = 0; j < propertyObj.length; j++) {
          serviceObj.push(propertyObj[j].service_name)
        }

        const tasksObj = []
        for (let j = 0; j < propertyObj.length; j++) {
          tasksObj.push(propertyObj[j].task_id)
        }

        const statusObj = []
        for (let j = 0; j < propertyObj.length; j++) {
          statusObj.push(propertyObj[j].status)
        }

        const propertyObject = propertyObj[0].property

        const updatedPropertyObject = {
          ...propertyObject,
          property_id: propertyObj[0].property_id
        }

        const finalobj = {
          services: serviceObj,
          property: updatedPropertyObject,
          tasks: tasksObj,
          status: statusObj
        }

        setpropertiesData(finalobj)

        // setpropertyImage(finalobj.property.images)

        if (finalobj.property.images != null) {
          const imageUrls = finalobj.property.images.map(
            (image) => `${API_URL}/${image}`
          )
          setpropertyImage(imageUrls)
        } else {
          setpropertyImage([])
        }

        setpropertyID(finalobj.property.property_name)
        setpropertySize(finalobj.property.area)
        setpropertyDes(finalobj.property.description)
        // setpropertyOwnerName(propertiesData[i].OwnerName)
        setpropertyAddress(finalobj.property.address)
        setpropertyLocality(finalobj.property.town)
        setpropertyCity(finalobj.property.city)
        setpropertyState(finalobj.property.state)
        setpropertyMandal(finalobj.property.mandal)
        setpropertyPincode(finalobj.property.pincode)
        setpropertyLat(finalobj.property.lat)
        setpropertyLong(finalobj.property.long)

        console.log('finalobj.property.lat', finalobj.property.lat)
        console.log('finalobj.property.long', finalobj.property.long)

        let serviceFinalObj = []
        for (let k = 0; k < finalobj.services.length; k++) {
          serviceFinalObj.push({
            heading: '',
            title: finalobj.services[k],
            description: '',
            path: '',
            id: finalobj.tasks[k],
            status: finalobj.status[k]
          })
        }
        //  console.warn(serviceFinalObj)

        setstepsDetail(serviceFinalObj)
      } catch (error) {
        await console.warn(error)
        // window.alert("Can't Assign Same Track Name")
      }
    }
    fetchTrackApiData()
  }, [refreshing])

  const [numberOfSteps, setNumberOfSteps] = useState(5)
  const [completedSteps, setCompletedSteps] = useState(0)

  // const stepsDetail = [
  //   { heading: "12 May", title: "You have taken test drive", description: "2010 White Alto LXI and 2 Others" },
  //   { heading: "14 May", title: "Pay Token", description: "for 2010 White Alto LXI" },
  //   { heading: "14 May", title: "Processing your loan", description: "Usually take 3-6 days for different banks" },
  //   { heading: "", title: "Take Car Delivery", description: "2010 White Alto LXI and 2 Others" },
  //   { heading: "", title: "Start Ownership Transfer Process", description: " Please bring the list of documents at the time of delivery" }
  // ];
  const [stepsDetail, setstepsDetail] = useState([])
  const [opencall, setopencall] = useState(false)

  const prev = () => {
    let step = completedSteps
    if (step > 0) {
      step = step - 1
      setCompletedSteps(step)
    }
  }

  const next = () => {
    let step = completedSteps
    console.log(step, 'jjjjjj')
    if (step < numberOfSteps) {
      step = step + 1
      setCompletedSteps(step)
    }
  }

  const Steps = ({ stepsDetail, completedSteps }) => {
    return (
      <View style={styles.stepList}>
        {stepsDetail.map((step, index) => {
          let status = ''
          if (index < completedSteps) {
            status = 'completed'
          }
          if (index > completedSteps) {
            status = 'incomplete'
          }
          if (index === completedSteps) {
            status = 'current'
          }
          return (
            <Step
              key={index}
              status={step.status}
              heading={step.heading}
              title={step.title}
              description={step.description}
              id={step.id}
            />
          )
        })}
      </View>
    )
  }

  const Step = ({ status, heading, title, description, id }) => {
    let style = styles.step
    if (status === 'Ongoing') {
      style = styles.currentStep
    }
    if (status === 'completed') {
      style = styles.completedStep
    }
    if (status === 'pending') {
      style = styles.incompleteStep
    }

    return (
      <ScrollView style={style}>
        <TouchableOpacity
          onPress={() => {
            if (title === 'Property Visit') {
              navigation.navigate(ROUTES.PROPERTYVISIT)
            } else if (title === 'Geofencing') {
              navigation.navigate(ROUTES.GEOFENCING)
              ServiceName.update((s) => {
                s.serviceName = title
              })
              ServiceId.update((s) => {
                s.serviceId = id
              })
            } else {
              navigation.navigate(ROUTES.ECSERVICE)
              ServiceName.update((s) => {
                s.serviceName = title
              })
              ServiceId.update((s) => {
                s.serviceId = id
              })
            }
          }}
        >
          <View
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              paddingHorizontal: 10
            }}
          >
            <Text style={styles.stepTitle}>{title}</Text>
            {status === 'Completed' && (
              <Text style={{ color: 'green', fontWeight: 'bold' }}>
                Completed
              </Text>
            )}
            {status === 'Ongoing' && (
              <Text style={{ color: 'orange', fontWeight: 'bold' }}>
                Ongoing
              </Text>
            )}
            {status === 'Pending' && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>Pending</Text>
            )}
          </View>
        </TouchableOpacity>
      </ScrollView>
    )
  }
  const handleLinkPress = async (url) => {
    console.log(url, 'url')
    const supported = await Linking.canOpenURL(url)
    console.log(supported)
    if (supported) {
      await Linking.openURL(url)
    } else {
      console.log('Cannot open URL: ' + url)
    }
  }

  const CustomImageSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const translateX = new Animated.Value(0)

    useEffect(() => {
      if (propertyImage.length != 0) {
        const slideInterval = setInterval(() => {
          const nextIndex = (currentIndex + 1) % propertyImage.length
          handleSlideChange(nextIndex)
        }, 3000)

        return () => {
          clearInterval(slideInterval)
        }
      }
    }, [currentIndex])

    const handleSlideChange = (index) => {
      Animated.spring(translateX, {
        toValue: -index * Dimensions.get('window').width,
        useNativeDriver: true
      }).start()
      setCurrentIndex(index)
    }

    return (
      <View style={styles.slidercontainer}>
        <Animated.View
          style={[
            styles.imageSlider,
            { transform: [{ translateX: translateX }] }
          ]}
        >
          <Image
            source={{ uri: propertyImage[currentIndex] }}
            style={styles.image}
            resizeMode="cover"
          />
        </Animated.View>
      </View>
    )
  }

  const handleLink1Press = () => {
    if (!propertyLat || !propertyLong) {
      console.log("Latitude or Longitude is not set.");
      return;
    }
    const zoomLevel = 21;
    const url = `https://www.google.com/maps/search/?api=1&query=${propertyLat},${propertyLong}&z=${zoomLevel}`;


    console.log('Attempting to open URL:', url);
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          console.log("Cannot open Google Maps");
        }
      })
      .catch((error) => console.log('Error occurred:', error));
  }
  

  return (
    <>
      <ScrollView
        style={styles.maincontainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
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
              name="ios-arrow-back"
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
                marginLeft: 10
              }}
            >
              Property Details
            </Text>
          </View>

          <View>
            {propertyLat != null && propertyLong != null && (
              <TouchableOpacity onPress={handleLink1Press}>
                <Text>
                  <FontAwesomeIcon name="directions" size={30} color="red" />
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View>
          {propertyImage.length != 0 && <CustomImageSlider />}

          {/* <Image   style={styles.propertyImg}
          source={{
            uri:`${propertyImage}`,
          }} 
        /> */}
        </View>

        <View style={{ ...styles.flexStyle, paddingTop: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{propertyID}</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            {propertySize != '' && <Text> {propertySize} sq. yd </Text>}
          </Text>
        </View>

        <ScrollView>
          <Text style={{ textAlign: 'justify', marginTop: 10 }}>
            {propertyDes}
          </Text>
        </ScrollView>

        <Text style={{ fontSize: 22, marginVertical: 10 }}>
          Contact Details
        </Text>

        <View style={{ width: '100%' }}>
          <Text>
            {propertyAddress} , {propertyLocality} ,
          </Text>
          <Text>
            {propertyMandal} , {propertyCity} ,
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text>{propertyState}</Text>
            <Text>, {propertyPincode}</Text>
          </View>
        </View>

        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Services</Text>
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
      {opencall && (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            bottom: 70,
            right: 90
          }}
        >
          <TouchableOpacity
            onPress={() => {
              alert('Comming Soon...')
            }}
            style={{
              marginBottom: 10,
              backgroundColor: COLORS.primary,
              borderRadius: 15,
              padding: 5
            }}
          >
            <Text style={{ color: 'white' }}>Audio Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              alert('Comming Soon...')
            }}
            style={{
              marginBottom: 10,
              backgroundColor: COLORS.primary,
              borderRadius: 15,
              padding: 5
            }}
          >
            <Text style={{ color: 'white' }}>Video Call</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* <TouchableOpacity
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
      </TouchableOpacity> */}
      {/* <TouchableOpacity
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
      </TouchableOpacity> */}
    </>
  )
}

export default TasksDetails

const styles = StyleSheet.create({
  maincontainer: {
    marginBottom: 75,
    paddingHorizontal: 20,
    backgroundColor: 'white'
  },
  flexStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  propertyImg: {
    width: '100%',
    height: 100,
    borderRadius: 5
  },
  container: {
    width: '100%',
    height: 'auto',
    padding: 20
  },
  stepsCard: {
    textAlign: 'center'
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    paddingHorizontal: 20
  },
  stepList: {
    marginBottom: 25
  },
  step: {
    position: 'relative',
    marginBottom: 25,
    color: '#00b289'
  },
  incompleteStep: {
    position: 'relative',
    marginBottom: 25,
    color: '#00b289'
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
    borderRadius: 30
  },
  stepHeading: {
    fontSize: 14,
    color: '#444a59',
    marginBottom: 5,
    fontWeight: '100'
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'left'
  },
  stepDescription: {
    fontSize: 16,
    color: '#444a59'
  },
  slidercontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  },
  imageSlider: {
    flexDirection: 'row',
    height: 200
  },
  image: {
    width: Dimensions.get('window').width,
    height: 200
  }
})
