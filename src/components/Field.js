import {TextInput } from 'react-native'
import React from 'react'

const Field = (props) => {
  return (
    <TextInput 
      {...props}
      style={{ borderRadius: 15,fontSize: 20,
         borderColor: '#808080', paddingHorizontal: 10, 
         borderWidth: 2, width:'80%', padding:10}}
      placeholderTextColor="#808080">
    </TextInput>
  )
}

export default Field