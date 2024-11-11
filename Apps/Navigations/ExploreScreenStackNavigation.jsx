import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ExploreScreen from "../Screens/ExploreScreen";
import ItemList from "../Screens/ItemList";
import ProductDetails from "../Screens/ProductDetails";

const Stack = createStackNavigator();

export default function ExploreScreenStackNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ExploreScreen"
        component={ExploreScreen}
        options={{
          headerShown: false,
        }}
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
    </Stack.Navigator>
  );
}
