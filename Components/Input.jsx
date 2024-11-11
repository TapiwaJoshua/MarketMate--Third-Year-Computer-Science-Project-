import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function Input(props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const onChangeText = (text) => {
    props.onInputChanged?.(props.id, text);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, { borderColor: "green" }]}>
        <TextInput
          {...props}
          placeholder={props.placeholder}
          placeholderTextColor={props.placeholderTextColor}
          style={styles.input}
          autoCapitalize="none"
          onChangeText={onChangeText}
          secureTextEntry={props.isPassword && !isPasswordVisible}
        />
        {props.isPassword && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={24}
              color="green"
            />
          </TouchableOpacity>
        )}
      </View>
      {props.errorText && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText[0]}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "green",
    paddingHorizontal: 2,
    paddingVertical: 2,
    borderRadius: 12,
  },
  input: {
    flex: 1,
    color: "green",
    fontSize: 18,
    paddingVertical: 8,
    paddingRight: 40, // Make space for the icon
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    padding: 5,
  },
  errorContainer: {
    marginVertical: 4,
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
});
