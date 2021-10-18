import * as React from "react";
import { Image, Text, View, StyleSheet } from "react-native";

export const Info = (props) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/Forgot-password.png")}
        style={{ width: 250 }}
      />
      <Text
        style={{
          color: "#7030A0",
          fontSize: 32,
          fontFamily: "Avenir-Heavy",
          textAlign: "center",
          marginBottom: 10,
        }}
      >
        ASSET for Virtual Schools
      </Text>
      <Text style={styles.pTag}>Support email</Text>
      <Text style={styles.pTag}>virtualschools@assetforschools.co.uk</Text>
      <Text style={styles.pTag}></Text>
      <Text style={styles.pTag}>Support Line</Text>
      <Text style={styles.pTag}>020 7183 83 57</Text>
    </View>
  );
};

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
