import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HeaderWithBack({ handleBack, title, style }: any) {
  return (
    <View style={[styles.header, { ...style }]}>
      <View
        style={{
          flex: 1,
          alignSelf: 'center',
        }}
      >
        <TouchableOpacity onPress={() => handleBack()}>
          <Icon name="arrow-left" size={35} />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flex: 0.5,
          position: 'absolute',
          alignSelf: 'center',
        }}
      >
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
