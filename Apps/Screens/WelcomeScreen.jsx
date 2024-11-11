import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

export default function WelcomeScreen() {
  const navigation = useNavigation();

  const handleNavigateToLogin = () => {
    navigation.navigate("LoginScreen");
  };

  const handleNavigateToSignup = () => {
    navigation.navigate("SignupScreen");
  };

  return (
    <View className="flex-1 bg-green-700 justify-center">
      <View className="items-center justify-center">
        <Image
          source={require("./../../assets/Images/MarketMate.png")}
          className="w-32 h-32 mb-8"
        />
      </View>
      <View className="px-4">
        <Text className="text-[40px] text-white font-bold text-center mb-4">
          Market Mate
        </Text>
        <Text className=" p-2 text-[21px] text-white text-center text-base">
          A platform for local vendors and small-scale farmers to buy and sell
          goods.
        </Text>
        <TouchableOpacity
          onPress={handleNavigateToSignup}
          className="p-3 bg-white rounded-[20px] mt-8"
        >
          <Text className="text-green-800 text-lg font-bold text-left">
            Continue with Email >
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="p-3 bg-white rounded-[20px] mt-8">
          <Text className="text-green-800 text-lg font-bold text-left">
            Continue with Phone Number >
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="p-3 bg-white rounded-[20px] mt-8">
          <Text className="text-green-800 text-lg font-bold text-left">
            Continue with Google >
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="p-3 mt-8">
          <Text
            onPress={handleNavigateToLogin}
            className="text-white text-lg font-bold text-left"
          >
            Already have an account? Sign in >
          </Text>
        </TouchableOpacity>
        <Text className="mt-11 text-white text-m text-center">
          By using this app, you agree to the Terms and Conditions and Privacy
          Policy
        </Text>
      </View>
    </View>
  );
}
