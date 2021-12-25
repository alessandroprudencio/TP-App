import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

export default function ButtonFinallyChallenge() {
  return (
    <View style={styles.container}>
      <Button icon="check" mode="contained" theme={{ roundness: 5 }} onPress={() => console.log('Pressed')}>
        Finalizar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // padding: 10,
  },
});
