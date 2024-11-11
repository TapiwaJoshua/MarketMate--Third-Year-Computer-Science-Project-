import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import ItemList from "../../Screens/ItemList";

export default function Categories({ categoryList }) {
  const navigation = useNavigation();

  return (
    <View className="mt-5">
      <Text className="font-bold text-[20px] text-green-700 mb-2">
        Categories
      </Text>
      <FlatList
        data={categoryList}
        numColumns={4}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            className="flex-1 items-center justify-center p-2 border-[1px] border-green-400 m-1 h-[80px] rounded-lg bg-green-50"
            onPress={() =>
              navigation.navigate("item-list", { category: item.name })
            }
          >
            <Image
              source={{ uri: item?.icon }}
              className="h-[35px] w-[35px] p-2 border-[1px] object-cover "
            />
            <Text className="text-[12px] mt-1">{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
