import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import AgoraUIKit from 'agora-rn-uikit';
import axios from 'axios';
import { API_URL } from '@env';

const VideoCall = ({ route,navigation }) => {
  const [videoCall, setVideoCall] = useState(true);
  const { task_id, userToken } = route.params;
  const [connectionData, setConnectionData] = useState(null); // Initialize as null

  const rtcCallbacks = {
    EndCall: () => {setVideoCall(false),
    navigation.goBack()}
  };

  // Default styleProps, modify as needed
  const styleProps = {
    // minViewStyles: { width: '100%', height: '50%' }, // Adjusts the incoming video view
    gridVideoView: { width: '100%', height: '50%' },
    UIKitContainer: { flex: 1, flexDirection: 'row',marginBottom:"5%" ,backgroundColor:'white'},
    popUpContainer: { flexDirection: 'row' ,backgroundColor:'white'}
    // UIKitContainer: { flex: 1,marginBottom:"10%"}, // Example style, adjust as needed
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/generate-token/${task_id}`, {
          headers: {
            Authorization: 'Bearer ' + userToken,
          },
        });
        const { token, channelName } = response.data;

        setConnectionData({
          appId: 'ef25da8649564afab40b34cbc6ed12f3', // Replace with your Agora App ID
          channel: channelName,
          token: token,
        });
      } catch (error) {
        console.error('Error fetching token and channel:', error);
      }
    };

    fetchData();
  }, [userToken, task_id]);

  const isRtcPropsReady = connectionData && connectionData.appId && connectionData.channel && connectionData.token;

  return (
    <View style={{ flex: 1 ,backgroundColor:'white'}}>
      {videoCall && isRtcPropsReady ? (
        <AgoraUIKit
          connectionData={connectionData}
          rtcCallbacks={rtcCallbacks}
          styleProps={styleProps}
        />
      ) : (
        <Text onPress={() => setVideoCall(true)}>Start Call</Text>
      )}
    </View>
  );
};

export default VideoCall;