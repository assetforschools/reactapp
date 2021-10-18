import axios from "axios";
import * as React from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";

import { Settings } from "../Utils/Settings";

export const Login = (props) => {
  const [number, onChangeNumber] = React.useState("7734212652");
  const [otp, setOtp] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [formStep, setFormStep] = React.useState(1);
  const [responseData, setResponseData] = React.useState(null);

  const loginFormSubmit = () => {
    if (number.length < 10 || !number.startsWith(7)) {
      Alert.alert("Warning", "Phone number is invalid!", [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "OK" },
      ]);
      return;
    }

    setLoading(true);

    //send data to the api
    axios
      .post(
        `${
          Settings.API_BASE_URI
        }/rest/requestOtp?mobNumber=${encodeURIComponent("+44")}${number}`
      )
      .then((res) => {
        console.log(res.data);

        setLoading(false);
        if (!res.data.status) {
          Alert.alert("Warning", res.data.message, [
            {
              text: "Cancel",
              style: "cancel",
            },
            { text: "OK" },
          ]);
        } else {
          setResponseData(res.data);
          setFormStep(2);
        }
      })
      .catch((err) => {
        setLoading(false);
        Alert.alert("Warning", "Sorry something went wrong!", [
          {
            text: "Cancel",
            style: "cancel",
          },
          { text: "OK" },
        ]);
      });
  };

  const otpFormSubmit = () => {
    if (otp.length < 6) {
      Alert.alert("Warning", "OTP format is invalid!", [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "OK" },
      ]);
      return;
    }
    setLoading(true);

    console.log(
      `${Settings.API_BASE_URI}/rest/verifyOtp?userId=${
        responseData.userId
      }&mobNumber=${encodeURIComponent("44")}${number}&otp=${otp}`
    );

    //send data to the api
    axios
      .post(
        `${Settings.API_BASE_URI}/rest/verifyOtp?userId=${
          responseData.userId
        }&mobNumber=${encodeURIComponent("44")}${number}&otp=${otp}`
      )
      .then(async (res) => {
        console.log("response data", res.data);

        setLoading(false);
        if (!res.data.status) {
          Alert.alert("Warning", "Sorry your OTP is not correct.", [
            {
              text: "Cancel",
              style: "cancel",
            },
            { text: "OK" },
          ]);
        } else {
          console.log("ok");
          await AsyncStorage.setItem("userID", res.data.userId.toString());
          await AsyncStorage.setItem("loggedIn", "true");
          await AsyncStorage.setItem("mobNumber", number.toString());
          console.log("Worked", res.data);
          props.setLoggedIn(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        Alert.alert("Warning", "Sorry something went wrong!", [
          {
            text: "Cancel",
            style: "cancel",
          },
          { text: "OK" },
        ]);
      });
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      {!loading ? (
        formStep === 1 ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text
              style={{
                color: "#7030A0",
                fontSize: 32,
                fontFamily: "Avenir-Heavy",
              }}
            >
              Your Phone
            </Text>
            <Text
              style={{
                color: "#7030A0",
                fontSize: 18,
                fontFamily: "Avenir-Heavy",
              }}
            >
              Please enter your phone number
            </Text>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                marginTop: 5,
                fontFamily: "Avenir-Heavy",
              }}
            >
              <Text style={{ color: "#7030A0" }}>+44</Text>
              <TextInput
                style={{
                  ...styles.input,
                  borderColor: "#7030A0",
                  fontFamily: "Avenir-Heavy",
                }}
                onChangeText={onChangeNumber}
                value={number}
                placeholder="4444333333"
                keyboardType="numeric"
                maxLength={10}
                onSubmitEditing={() => loginFormSubmit()}
              />
            </View>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setFormStep(1)}
            >
              <Ionicons name="arrow-back-outline" size={22} color="#FFF" />
            </TouchableOpacity>
            <Text
              style={{
                color: "#7030A0",
                fontSize: 32,
                fontFamily: "Avenir-Heavy",
              }}
            >
              +44 {number}
            </Text>
            <Text
              style={{
                color: "#7030A0",
                fontSize: 18,
                marginTop: 5,
                fontFamily: "Avenir-Heavy",
              }}
            >
              We have sent an SMS with a code.
            </Text>
            <Text
              style={{
                color: "#7030A0",
                fontSize: 18,
                fontFamily: "Avenir-Heavy",
              }}
            >
              Please enter here
            </Text>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                marginTop: 5,
              }}
            >
              <TextInput
                style={{
                  ...styles.input,
                  borderColor: "#7030A0",
                  fontFamily: "Avenir-Heavy",
                }}
                onChangeText={setOtp}
                value={otp}
                placeholder="otp"
                keyboardType="numeric"
                maxLength={6}
                onSubmitEditing={() => otpFormSubmit()}
              />
            </View>
          </View>
        )
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="small" color="#7030A0" />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    minHeight: 35,
    borderRadius: 5,
    width: 200,
  },
  backButton: {
    position: "absolute",
    height: 40,
    width: 40,
    backgroundColor: "#7030A0",
    top: 80,
    left: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
});
