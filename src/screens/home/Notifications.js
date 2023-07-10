import React from 'react';
import {StyleSheet, Text, FlatList,Image,View} from 'react-native';
import {COLORS,IMGS} from '../../constants';

const Notifications = () => {

const notificationData=[
  {
    Logo:IMGS.PROFILE1,
   TaskId:1,
   TaskName:'Site Cleaning',
   TaskTime:'2 minutes ago'
  },
  {
    Logo:IMGS.PROFILE1,
   TaskId:1,
   TaskName:'EC',
   TaskTime:'43 minutes ago'
  },
  {
    Logo:IMGS.PROFILE1,
   TaskId:1,
   TaskName:'Watchman',
   TaskTime:'2 minutes ago'
  },
  {
    Logo:IMGS.PROFILE1,
   TaskId:1,
   TaskName:'Cleaning',
   TaskTime:'2 minutes ago'
  },
  {
    Logo:IMGS.PROFILE1,
   TaskId:1,
   TaskName:'EC',
   TaskTime:'2 minutes ago'
  },
  {
    Logo:IMGS.PROFILE1,
   TaskId:1,
   TaskName:'Cleaning',
   TaskTime:'11 minutes ago'
  },
  {
    Logo:IMGS.PROFILE1,
   TaskId:1,
   TaskName:'Cleaning',
   TaskTime:'2 minutes ago'
  },
  {
    Logo:IMGS.PROFILE1,
   TaskId:1,
   TaskName:'Cleaning',
   TaskTime:'2 minutes ago'
  }

]

const renderItem = ({item}) =>(
  
  <View  style={styles.notificationCard}>
          <View>
             <Image source={item.Logo} resizeMode="contain" style={{width:50,height:50, borderColor:'black',borderWidth:1,borderRadius:50,marginRight:20}} />
          </View>
          <View>
              <Text style={{fontSize:18}}>
                {item.TaskId} - {item.TaskName}
              </Text>
              <Text style={{fontSize:16,color:COLORS.primary,fontWeight:'bold'}}>
                  {item.TaskTime}
              </Text>
          </View>
          </View>
   
   
   )
  return (
    <View style={styles.maincontainer}>
      
    
<FlatList 
       data={notificationData}
        renderItem={renderItem}
       keyExtractor={(item, index) => index.toString()}
          numColumns={1}
      />
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({

  maincontainer: {
    padding: 20,
    backgroundColor: '#fff',
    height: '95%'
  },
  notificationCard:{
     display:'flex',
     flexDirection:'row',
     alignItems:'center',
     marginBottom:20
  },
image:{
  width:50,
  height:50,
  borderRadius:'50%',
  borderColor:'black',
  borderWidth:1,
  marginRight:20
}

});
