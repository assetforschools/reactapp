import * as React from "react";
import { Image, Text, View, StyleSheet, Button } from "react-native";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function (props) {
  const [expoPushToken, setExpoPushToken] = React.useState("");
  const [notificationData, setNotificationData] = React.useState({
    tokenShow: false,
    token: null,
  });
  const notificationListener = React.useRef();
  const responseListener = React.useRef();

  React.useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotificationData({
          tokenShow: true,
          token: notification.request.content.body,
        });
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Click notification", response);
        console.log(response);
        setNotificationData({
          tokenShow: true,
          token: response.notification.request.content.body,
        });
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return !notificationData.tokenShow ? (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/Link-card.png")}
        style={{ width: 250, marginBottom: 20 }}
      />
      <Text style={styles.pTag}>please go to</Text>
      <Text style={styles.pTag}>ASSET website and login.</Text>
      <Text></Text>
      <Text style={styles.pTag}>The token will be sent to your</Text>
      <Text style={styles.pTag}>mobile once you have entered</Text>
      <Text style={styles.pTag}>your login credentials</Text>
      <Text style={styles.pTag}>on the website.</Text>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      />
    </View>
  ) : (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/Success.png")}
        style={{ width: 250, marginBottom: 20 }}
      />
      <Text style={styles.pTag}>Your one time token is</Text>
      <Text></Text>
      <Text></Text>
      <Text
        style={{
          color: "#7030A0",
          fontSize: 32,
          fontFamily: "Avenir-Heavy",
          textAlign: "center",
          marginBottom: 10,
        }}
      >
        {notificationData.token}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 20,
  },
  pTag: {
    color: "#7030A0",
    fontSize: 18,
    fontFamily: "Avenir-Heavy",
    textAlign: "center",
  },
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Asset Login Token",
    body: "365463",
    data: { type: "token" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}
