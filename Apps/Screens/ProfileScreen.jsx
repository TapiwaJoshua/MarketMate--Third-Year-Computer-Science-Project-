import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import {
  fetchUserName,
  fetchEmail,
  fetchUserImage,
} from "./../../utils/actions/authActions";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import logout from "./../../assets/Images/2855965.png";
import products from "./../../assets/Images/producsnew.png";
import explore from "./../../assets/Images/searchic.png";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";

export default function ProfileScreen() {
  const userName = useSelector((state) => state.user.userName);
  const email = useSelector((state) => state.user.email);
  const userImageURL = useSelector((state) => state.user.userImageURL);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const auth = getAuth();

  const handleNavigateToWelcomeScreen = () => {
    navigation.navigate("WelcomeScreen");
  };

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

  const menuList = [
    {
      id: 1,
      name: "My Products",
      icon: products,
      path: "my-products",
    },
    {
      id: 3,
      name: "Explore Products",
      icon: explore,
      path: "explore",
    },
    {
      id: 2,
      name: "Logout",
      icon: logout,
    },
  ];

  const onMenuPress = (item) => {
    if (item.name == "Logout") {
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          Alert.alert("Success", "Signed out Successfully!");
          handleNavigateToWelcomeScreen();
        })
        .catch((error) => {
          // An error happened.
          Alert.alert("Error", "Unable to Sign Out!");
        });
    }
    item.path ? navigation.navigate(item.path) : null;
  };

  return (
    <View className="p-5 flex flex-1">
      <View className="items-center mt-14">
        <Image
          source={{ uri: userImageURL }}
          className=" rounded-full w-[100px] h-[100px]"
        />
        <Text style={{ color: "green" }} className="font-bold text-[35px] mt-2">
          {userName}
        </Text>
        <Text className="text-green-500 text-[22px] mt-">{email}</Text>
      </View>
      <FlatList
        style={{ marginTop: 20 }}
        data={menuList}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            className="flex-1 p-5 bg-green-800 border-[1px] items-center m-4 mt-10 rounded-lg border-green-700"
            onPress={() => onMenuPress(item)}
          >
            {item.icon && (
              <Image source={item.icon} style={{ width: 60, height: 60 }} />
            )}
            <Text className="text-[18px] font-bold mt-2 text-white">
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        // keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}
