import { View, Text, Image, ActivityIndicator, TextInput } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import {
  fetchUserName,
  fetchEmail,
  fetchUserImage,
} from "./../../../utils/actions/authActions";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function Header() {
  const userName = useSelector((state) => state.user.userName);
  const email = useSelector((state) => state.user.email);
  const userImageURL = useSelector((state) => state.user.userImageURL);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchEmail()),
          dispatch(fetchUserImage()),
          dispatch(fetchUserName()),
        ]);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View>
      {/* User Info Section */}
      <View className="flex mt-2 flex-row items-center gap-4">
        {userImageURL ? (
          <Image
            source={{ uri: userImageURL }}
            className="rounded-full w-12 h-12"
            onError={(e) =>
              console.log("Image load error:", e.nativeEvent.error)
            }
          />
        ) : (
          <Image
            source={require("./../../../assets/Images/placeholder-image.png")}
            className="rounded-full w-12 h-12"
          />
        )}
        <View>
          <Text className="text-[16px]">Welcome</Text>
          <Text className="text-[20px] font-bold text-green-800">
            {userName}
          </Text>
        </View>
      </View>
      {/* Search Bar
      <View className="p-3 px-5 flex flex-row items-center mt-5 bg-green-100 rounded-full border-[2px] border-green-500">
        <Ionicons name="search" size={24} color="green" />
        <TextInput
          placeholder="Search"
          className="ml-3 text-[18px]"
          onChangeText={(searchValue) => console.log(searchValue)}
        />
      </View> */}
    </View>
  );
}
