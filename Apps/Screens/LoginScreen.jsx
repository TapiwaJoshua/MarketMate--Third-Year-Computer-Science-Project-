import React, { useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import Input from "./../../Components/Input.jsx";
import { useState, useCallback, useReducer } from "react";
import { reducer } from "./../../utils/reducers/formReducers.js";
import { validateInput } from "../../utils/actions/formActions.js";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { signIn } from "../../utils/actions/authActions.js";
// import { fetchUserName, setUser } from "../../utils/actions/userActions";
import { fetchUserName } from "../../utils/actions/authActions.js";
const isTestMode = true;

const initialState = {
  inputvalues: {
    email: isTestMode ? "example@example.com" : "",
    password: isTestMode ? "********" : "",
  },
  inputValidities: {
    email: false,
    password: false,
  },
  formIsValid: false,
};
export default function LoginScreen() {
  const navigation = useNavigation();

  const handleNavigateToLanding = () => {
    navigation.navigate("MainTabs");
  };

  const handleNavigateToSignup = () => {
    navigation.navigate("SignupScreen");
  };

  const [isLoading, setIsLoading] = useState(false);
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [error, setError] = useState();
  const dispatch = useDispatch();

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );

  const authHandler = async () => {
    try {
      setIsLoading(true);
      const action = signIn(
        formState.inputValues.email,
        formState.inputValues.password
      );
      await dispatch(action);
      setError(null);

      Alert.alert("Login Successful", "Successfully Signed In");
      dispatch(fetchUserName());
      handleNavigateToLanding();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (error) {
      return Alert.alert("An Error Occured", error);
    }
  }, [error]);
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        <View className="items-start justify-start">
          <Image
            source={require("./../../assets/Images/MarketMate.png")}
            resizeMode="contain"
            className="w-32 h-32 mb-8 mt-20"
          />
        </View>
        <View>
          <Text className="text-[25px] text-green-700 font-bold mb-4">
            Login
          </Text>
          <Text className="text-[18px] text-green-700 font-bold mb-4">
            Login using your email or phone number
          </Text>
        </View>
        <View className="my-6">
          <Input
            id="email"
            placeholder="Email Address or Phone Number"
            placeholderTextColor="green"
            errorText={formState.inputValidities["email"]}
            onInputChanged={inputChangedHandler}
            className="border border-green-700 rounded-md p-2 text-green-700"
          />
          <Input
            id="password"
            placeholder="Password"
            placeholderTextColor="green"
            errorText={formState.inputValidities["password"]}
            onInputChanged={inputChangedHandler}
            className="border border-green-700 rounded-md p-2 text-green-700"
            isPassword={true} // Add this prop
          />
          <TouchableOpacity
            onPress={authHandler}
            isLoading={isLoading}
            className="p-3 bg-green-800 rounded-full mt-8"
          >
            <Text className="text-white text-lg font-bold text-center">
              LOGIN
            </Text>
          </TouchableOpacity>
          <View style={StyleSheet.bottomContainer}>
            <TouchableOpacity onPress={handleNavigateToSignup}>
              <Text className="text-green-700 text-center text-lg mt-9">
                Don't have an account? Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const Styles = StyleSheet.create({
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 2,
  },
});
