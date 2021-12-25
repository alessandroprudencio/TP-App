import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

interface IButtonChallenge {
  submit: () => void;
  loading: boolean;
}

export default function ButtonChallenge({ submit, loading }: IButtonChallenge) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        marginBottom: Platform.OS === 'android' ? 20 : 0,
      }}
    >
      <Button style={{ height: 55, width: 280, justifyContent: 'center' }} mode="contained" onPress={() => submit()}>
        {!loading ? (
          <Text
            style={{
              textAlign: 'center',
              fontSize: 16,
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            DESAFIAR
          </Text>
        ) : (
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            DESAFIANDO...
          </Text>
        )}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({});
