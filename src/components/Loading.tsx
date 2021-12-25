import React from 'react';
import { Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export default function Loading() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size={40} color={'#000'} animating={true} />

      <Text style={{ fontSize: 16, marginTop: 10 }}>Obtendo informações do usuário autenticado.</Text>
    </View>
  );
}
