import * as React from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";

export const Splash = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
      <ImageBackground
        source={require("../assets/images/start-banner-img.png")}
        style={styles.image}
      >
        <Image
          style={styles.logo}
          source={require("../assets/images/logo.png")}
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 250,
    height: 100,
    resizeMode: "contain",
  },
  text: {
    color: "grey",
    fontSize: 30,
    fontWeight: "bold",
  },
});
