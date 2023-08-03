import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const Button = ({bgColor, btnLabel, textColor, Press}) => {
  return (
    <TouchableOpacity
    onPress={Press}
    style={{
        backgroundColor: bgColor,
        borderRadius: 15,
        alignItems:'center',
        width:'80%',
        padding: 10
    }}>
        <Text style={{color:textColor, fontSize: 24, fontWeight:'bold'}}>
            {btnLabel}
        </Text>

    </TouchableOpacity>
  )
}

export default Button