import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import ProductDetails from "../../Screens/ProductDetails";

export default function PostItem({ item }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      className="flex-1 m-2 p-2 rounded-lg border-[1px] border-green-200"
      onPress={() =>
        navigation.push("product-details", {
          product: item,
        })
      }
    >
      <Image
        source={{ uri: item.image }}
        className="w-full h-[170px] rounded-lg"
      />
      <View>
        <Text className="text-[15px] font-bold mt-2">{item.title}</Text>
        <Text className="text-[20px] font-bold text-green-800">
          ZMW {item.price}
        </Text>
        <Text className=" text-lime-500 bg-green-100 text-[12px] font-bold mt-2 p-1 rounded-full px-2 w-[90px] text-center">
          {item.category}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
