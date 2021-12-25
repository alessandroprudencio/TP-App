import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ScoreComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.score}> 6 - 1</Text>
      <Text style={styles.score}> 1 - 4</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // padding: 10,
  },
  score: {
    fontSize: 18,
    fontWeight: "400",
  },
});
