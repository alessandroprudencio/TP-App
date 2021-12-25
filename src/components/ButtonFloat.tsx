import React from "react";
import { StyleSheet } from "react-native";
import { FAB, useTheme } from "react-native-paper";

export default function ButtonFloatComponent({ showModal }: any) {
  const { colors } = useTheme();

  return (
    <FAB
      style={[styles.fab, { backgroundColor: colors.primary }]}
      icon="plus"
      onPress={() => showModal()}
    />
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    marginVertical: 30,
    marginHorizontal: 15,
    right: 0,
    bottom: 0,
  },
});
