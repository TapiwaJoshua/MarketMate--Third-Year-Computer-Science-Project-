import { View, Text } from "react-native";
import HomeScreen from "../Screens/HomeScreen";
import ItemList from "../Screens/ItemList";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ProductDetails from "../Screens/ProductDetails";
import EditPostScreen from "../Screens/EditPostScreen";
import PaymentScreen from "../Screens/PaymentScreen";

const Stack = createStackNavigator();

export default function HomeScreenStackNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="item-list"
        component={ItemList}
        options={({ route }) => ({
          title: route.params.category,
          headerStyle: {
            backgroundColor: "green",
          },
          headerTintColor: "#fff",
        })}
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
      <Stack.Screen
        name="edit-post"
        component={EditPostScreen}
        options={{
          headerStyle: {
            backgroundColor: "green",
          },
          headerTintColor: "#fff",
          headerTitle: "Edit Post",
        }}
      />
      <Stack.Screen
        name="payment"
        component={PaymentScreen}
        options={{
          headerStyle: {
            backgroundColor: "green",
          },
          headerTintColor: "#fff",
          headerTitle: "Make Payment",
        }}
      />
    </Stack.Navigator>
  );
}
