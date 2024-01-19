import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import axios from 'axios'
import { API_URL } from '@env'
import { COLORS } from '../../constants'
import { TextInput } from 'react-native-paper'
import Icon from 'react-native-vector-icons/FontAwesome'

const Chat = ({ route, navigation }) => {
  const { task_id, userToken } = route.params
  const [chatData, setChatData] = useState([])
  const [newMsg, setNewMsg] = useState('')

  const handleChat = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/user/get-task/${task_id}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      )
      setChatData(response?.data?.task?.chat)
    } catch (error) {
      console.error('Error fetching chat data:', error)
    }
  }
  useEffect(() => {
    handleChat()
  }, [task_id, userToken])

  const handleChatSend = async () => {
    try {
      const role = 'agent'
      const roleName = role.charAt(0).toUpperCase() + role.slice(1)

      const newMsgData = { [roleName]: newMsg }

      let updatedChatData

      if (chatData != null) {
        updatedChatData = [...chatData, newMsgData]
      } else {
        updatedChatData = [newMsgData]
      }

      console.log('updatedChatData', updatedChatData)

      const formData = new FormData()

      formData.append('chat', JSON.stringify(updatedChatData))
      try {
        const response = await axios.put(
          `${API_URL}/user/edit-task/${task_id}`,
          formData,
          {
            headers: {
              Authorization: 'Bearer ' + userToken,
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        console.log('response', response)
        console.log('response', response?.status)
        // navigation.goBack()
        handleChat()
        setNewMsg("")
      } catch (error) {
        console.log('error', error)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const goBack =()=>{
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <View style={styles.flexRow}>
        <TouchableOpacity style={styles.backIcon} onPress={goBack} >
          <Icon name="arrow-left" color={COLORS.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Chat</Text>
      </View>
      <ScrollView>
        {chatData?.map((chatItem, index) => {
          const role = Object.keys(chatItem)[0]
          const message = chatItem[role]
          return (
            <View key={index} style={styles.messageContainer}>
              <Text style={styles.roleText}>{role}:</Text>
              <Text style={styles.messageText}>{message}</Text>
            </View>
          )
        })}
      </ScrollView>
      <View style={{ width: '100%', alignItems: 'center' }}>
        <TextInput
          style={styles.textInput}
          mode="outlined"
          value={newMsg}
          onChangeText={setNewMsg}
          placeholder="New Message"
        />
        <TouchableOpacity
          onPress={handleChatSend}
          style={{ position: 'absolute', right: 20, zIndex: 0, top: 15 }}
        >
          {newMsg != '' ? (
            <Icon name="send" color={COLORS.primary} size={24} />
          ) : null}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    paddingBottom: '20%'
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
    width: '100%'
  },
  backIcon: {
    position: 'absolute',
    left: 10,
    top: 0
  },
  title: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    color: COLORS.danger
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 10
  },
  roleText: {
    color: COLORS.black,
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
    width: '25%'
  },
  messageText: {
    fontSize: 20,
    color: COLORS.black,
    flex: 1,
    textAlign: 'left'
  },
  textInput: {
    width: '100%',
    backgroundColor: 'white'
  }
})

export default Chat
