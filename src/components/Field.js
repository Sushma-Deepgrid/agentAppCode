import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';

const Field = ({ secureTextEntry, onChangeText, ...props }) => {
  const [isVisible, setIsVisible] = useState(!secureTextEntry);
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  console.log("...props ",...props );
  return (
    <View style={styles.container}>
      <TextInput
        {...props}
        style={styles.input}
        secureTextEntry={!isVisible}
        onChangeText={onChangeText}
        placeholderTextColor="#808080"
      />
      {secureTextEntry && (
    <TouchableOpacity onPress={toggleVisibility} style={styles.icon}>
      <Ionicons name={isVisible ? 'eye' : 'eye-off'} size={24} color="#808080" />
    </TouchableOpacity>
   
)}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    borderColor: '#808080',
    borderWidth: 2,
    width: '80%',
  },
  input: {
    flex: 1,
    fontSize: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
});

export default Field;
