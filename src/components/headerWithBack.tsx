import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HeaderWithBack({ handleBack, title, style }: any) {
  return (
    <View style={[styles.header, { ...style }]}>
      <TouchableOpacity style={styles.button} onPress={() => handleBack()}>
        <Icon style={{ width: '100%' }} name="arrow-left" size={35} />
      </TouchableOpacity>

      <View style={styles.viewTitle}>
        <Title style={styles.title}>{title}</Title>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  button: {
    position: 'absolute',
    zIndex: 1,
  },

  viewTitle: {
    flex: 1,
  },

  title: {
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});
