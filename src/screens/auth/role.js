import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { ROUTES } from "../../constants";

const Role = () => {
  const navigation = useNavigation();
  const [selectedRole, setSelectedRole] = useState("admin");

  const handleRoleSelection = (value) => {
    setSelectedRole(value);
  };

  const handleSubmit = () => {
    if (selectedRole === "admin") {
      navigation.navigate(ROUTES.WEBPAGE); // Navigate to Admin login page
    } else if (selectedRole === "agent") {
      navigation.navigate(ROUTES.LOGIN); // Navigate to Agent login page
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../../assets/logo.png")} // Replace with your logo source
        resizeMode="contain"
      />
      <Picker
        selectedValue={selectedRole}
        onValueChange={handleRoleSelection}
        style={styles.dropdown}
      >
        <Picker.Item label="Login as Admin" value="admin" />
        <Picker.Item label="Login as Agent" value="agent" />
      </Picker>
      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 400,
    height: 200,
    marginBottom: 20,
  },
  dropdown: {
    width: 200,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#34447d",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Role;
