import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MyProducts from "../Screens/MyProducts";
import ProfileScreen from "../Screens/ProfileScreen";
import ProductDetails from "../Screens/ProductDetails";

const Stack = createStackNavigator();

export default function ProfileScreenStackNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="profile-tab"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="my-products"
        component={MyProducts}
        options={{
          headerStyle: {
            backgroundColor: "green",
          },
          headerTintColor: "#fff",
          headerTitle: "My Products",
        }}
      />
      <Stack.Screen
        name="product-details"
        component={ProductDetails}
        options={{
          headerStyle: {
            backgroundColor: "green",
          },
          headerTintColor: "#fff",
          headerTitle: "Product Details",
        }}
      />
    </Stack.Navigator>
  );
}
