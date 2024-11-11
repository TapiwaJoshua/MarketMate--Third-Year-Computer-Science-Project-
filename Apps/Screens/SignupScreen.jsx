import React, { useState, useCallback, useReducer, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Input from "./../../Components/Input.jsx";
import { reducer } from "./../../utils/reducers/formReducers.js";
import { validateInput } from "./../../utils/actions/formActions.js";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { signUp } from "./../../utils/actions/authActions.js";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirebaseStorage } from "./../../utils/firebaseHelper.js";

const isTestMode = true;

const initialState = {
  inputValues: {
    fullName: isTestMode ? "Tapiwa Joshua" : "",
    email: isTestMode ? "example@example.com" : "",
    address: isTestMode ? "House No. Blank, Blank, Zambia" : "",
    password: isTestMode ? "********" : "",
    confirmPassword: isTestMode ? "********" : "",
  },
  inputValidities: {
    fullName: false,
    email: false,
    address: false,
    password: false,
    confirmPassword: false,
  },
  formIsValid: false,
};

export default function SignupScreen() {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const dispatch = useDispatch();
  const storage = getFirebaseStorage();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    } else {
      console.log("Image picking was canceled or no assets found");
    }
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `images/${Date.now()}`);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });

      if (inputId === "password" || inputId === "confirmPassword") {
        validatePasswords();
      }
    },
    [dispatchFormState, validatePasswords]
  );
  const navigation = useNavigation();

  const handleNavigateToLogin = () => {
    navigation.navigate("LoginScreen");
  };

  const validatePasswords = useCallback(() => {
    const passwordsMatch =
      formState.inputValues.password === formState.inputValues.confirmPassword;
    const passwordError = passwordsMatch ? "" : "Passwords do not match";

    dispatchFormState({
      inputId: "confirmPassword",
      validationResult: {
        isValid: passwordsMatch,
        errorMessage: passwordError,
      },
      inputValue: formState.inputValues.confirmPassword,
    });
  }, [formState.inputValues.password, formState.inputValues.confirmPassword]);

  const authHandler = async () => {
    // Check if passwords match
    // if (
    //   formState.inputValues.password !== formState.inputValues.confirmPassword
    // ) {
    //   Alert.alert(
    //     "Password Mismatch",
    //     "The passwords you entered do not match. Please try again."
    //   );
    //   return; // Exit the function early if passwords don't match
    // }

    try {
      setIsLoading(true);
      let imageURL = null;
      if (image) {
        imageURL = await uploadImage(image);
      }
      const action = signUp(
        formState.inputValues.fullName,
        formState.inputValues.email,
        formState.inputValues.address,
        formState.inputValues.password,
        imageURL
      );
      await dispatch(action);

      Alert.alert("Success", "Account Created Successfully!");
      setError(null);
      setIsLoading(false);
      handleNavigateToLogin();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred", error);
    }
  }, [error]);
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        <View className="items-start justify-start">
          <Image
            source={require("./../../assets/Images/MarketMate.png")}
            resizeMode="contain"
            className="w-32 h-32 mb-4 mt-18"
          />
        </View>
        <View>
          <Text className="text-[25px] text-green-700 font-bold mb-2">
            Sign Up
          </Text>
          <Text className="text-[18px] text-green-700 font-bold mb-2">
            Create an Account using your email
          </Text>
        </View>
        <View className="my-6">
          <TouchableOpacity onPress={pickImage}>
            {image ? (
              <Image
                source={{ uri: image }}
                style={{ width: 100, height: 100, borderRadius: 15 }}
                onError={(e) =>
                  console.log("Image load error:", e.nativeEvent.error)
                }
              />
            ) : (
              <Image
                source={require(".//..//../assets/Images/placeholder-image.png")}
                style={{ width: 100, height: 100, borderRadius: 15 }}
              />
            )}
          </TouchableOpacity>
          <Input
            id="fullName"
            placeholder="Full Name"
            placeholderTextColor="green"
            errorText={formState.inputValidities["fullName"]}
            onInputChanged={inputChangedHandler}
            className="border border-green-700 rounded-md p-2 text-green-700"
          />
          <Input
            id="email"
            placeholder="Email Address"
            placeholderTextColor="green"
            errorText={formState.inputValidities["email"]}
            onInputChanged={inputChangedHandler}
            className="border border-green-700 rounded-md p-2 text-green-700"
          />
          <Input
            id="address"
            placeholder="Residential Address"
            errorText={formState.inputValidities["address"]}
            onInputChanged={inputChangedHandler}
            placeholderTextColor="green"
            className="border border-green-700 rounded-md p-2 text-green-700"
          />
          <Input
            id="password"
            placeholder="Password"
            placeholderTextColor="green"
            errorText={formState.inputValidities["password"]}
            onInputChanged={inputChangedHandler}
            className="border border-green-700 rounded-md p-2 text-green-700"
            isPassword={true}
          />
          {/* <Input
            id="confirmPassword"
            placeholder="Confirm Password"
            placeholderTextColor="green"
            errorText={formState.inputValidities["confirmPassword"]}
            onInputChanged={inputChangedHandler}
            className="border border-green-700 rounded-md p-2 text-green-700"
            isPassword={true}
          /> */}
          <TouchableOpacity
            onPress={authHandler}
            className="p-3 rounded-full bg-green-800 mt-8"
          >
            <Text className="text-white text-lg font-bold text-center">
              {isLoading ? "SIGNING UP..." : "SIGN UP"}
            </Text>
          </TouchableOpacity>
          <View style={Styles.bottomContainer}>
            <TouchableOpacity onPress={handleNavigateToLogin}>
              <Text className="text-green-700 text-center text-lg mt-9">
                Already have an Account? Sign In
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
