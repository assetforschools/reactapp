import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, TouchableOpacity, View } from "react-native";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Login } from "./Screens/LoginScreen";
import { Splash } from "./Screens/SpalshScreen";
import Home from "./Screens/HomeScreen";
import { Info } from "./Screens/InfoScreen";

function Logout(props) {
  const loggedOut = async () => {
    await AsyncStorage.removeItem("userID");
    await AsyncStorage.removeItem("loggedIn");
    await AsyncStorage.removeItem("mobNumber");
    console.log(props.setLoggedIn);
    props.setLoggedIn(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        style={{
          color: "#7030A0",
          fontSize: 32,
          fontFamily: "Avenir-Heavy",
          textAlign: "center",
          marginBottom: 10,
        }}
      >
        Are you sure ?
      </Text>
      <TouchableOpacity
        style={{
          marginTop: 10,
          backgroundColor: "#7030A0",
          paddingVertical: 8,
          paddingHorizontal: 30,
          borderRadius: 5,
        }}
        onPress={() => loggedOut()}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 18,
            fontFamily: "Avenir-Heavy",
            textAlign: "center",
          }}
        >
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  let [fontsLoaded] = useFonts({
    "Avenir-Heavy": require("./assets/font/Avenir-Heavy/Avenir-Heavy.ttf"),
  });

  const [isStateReady, setStateReady] = React.useState(false);
  const [isLoggedIn, setLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      const isLoggedInFromLocaStorage = await AsyncStorage.getItem("loggedIn");
      if (isLoggedInFromLocaStorage !== "true") {
        setLoggedIn(true);
      }
    };

    checkAuth();
    setTimeout(() => {
      setStateReady(true);
    }, 2000);
  }, []);

  return isStateReady && fontsLoaded ? (
    isLoggedIn ? (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "Home") {
                iconName = "home-outline";
              } else if (route.name === "Info") {
                iconName = "information-circle-outline";
              } else if (route.name === "Logout") {
                iconName = "log-out-outline";
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarLabel: () => {
              return null;
            },
            headerShown: false,
            tabBarActiveTintColor: "#7030A0",
            tabBarInactiveTintColor: "gray",
          })}
        >
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Info" component={Info} />
          <Tab.Screen
            name="Logout"
            children={() => <Logout setLoggedIn={setLoggedIn} />}
          />
        </Tab.Navigator>
      </NavigationContainer>
    ) : (
      <Login setLoggedIn={setLoggedIn} />
    )
  ) : (
    <Splash />
  );
}
