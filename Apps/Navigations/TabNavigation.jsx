import { View, Text } from "react-native";
import React from "react";
import ExploreScreen from "../Screens/ExploreScreen";
import AddPostScreen from "../Screens/AddPostScreen";
import ProfileScreen from "../Screens/ProfileScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../Screens/HomeScreen";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import HomeScreenStackNavigation from "./HomeScreenStackNavigation";
import ExploreScreenStackNavigation from "./ExploreScreenStackNavigation";
import ProfileScreenStackNavigation from "./ProfileScreenStackNavigation";

const Tab = createBottomTabNavigator();
export default function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "black",
        tabBarActiveBackgroundColor: "lightgray",
      }}
    >
      <Tab.Screen
        name="Home-Nav"
        component={HomeScreenStackNavigation}
        options={{
          tabBarLabel: () => (
            <Text className="text-xs mb-2 text-black"> Home</Text>
          ),
          tabBarIcon: () => <AntDesign name="home" size={24} color="green" />,
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreenStackNavigation}
        options={{
          tabBarLabel: () => (
            <Text className="text-xs mb-2 text-black">Explore</Text>
          ),
          tabBarIcon: () => (
            <MaterialIcons name="explore" size={24} color="green" />
          ),
        }}
      />
      <Tab.Screen
        name="Add Post"
        component={AddPostScreen}
        options={{
          tabBarLabel: () => (
            <Text className="text-xs mb-2 text-black"> Add Post</Text>
          ),
          tabBarIcon: () => (
            <MaterialIcons name="post-add" size={24} color="green" />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreenStackNavigation}
        options={{
          tabBarLabel: () => (
            <Text className="text-xs mb-2 text-black"> Profile</Text>
          ),
          tabBarIcon: () => (
            <Ionicons name="person-circle" size={24} color="green" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
