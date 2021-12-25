import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";

export default function NewMatchComponent() {
  return (
    <View style={styles.container}>
      <Button
        icon="plus"
        mode="contained"
        theme={{ roundness: 5 }}
        onPress={() => console.log("Pressed")}
      >
        Desafiar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // padding: 10,
  },
});
