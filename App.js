import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import WelcomeScreen from "./Apps/Screens/WelcomeScreen";
import LoginScreen from "./Apps/Screens/LoginScreen";
import SignupScreen from "./Apps/Screens/SignupScreen";
import TabNavigation from "./Apps/Navigations/TabNavigation";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); // Ignore all log notifications

if (__DEV__) {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (args[0] && args[0].indexOf("indexOf") > -1) {
      console.log("Caught indexOf error:", ...args);
    } else {
      originalConsoleError(...args);
    }
  };
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="WelcomeScreen"
          >
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignupScreen" component={SignupScreen} />
            <Stack.Screen
              name="MainTabs"
              component={TabNavigation}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}
