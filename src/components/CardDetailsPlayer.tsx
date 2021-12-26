import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from 'react-native-paper';
import { IPlayer } from '../interfaces/player.interface';

export default function CardDetailsPlayerComponent({ name, positionRanking, score, avatar }: IPlayer) {
  const formattedAvatar = (avatar: string) => (avatar ? { uri: avatar } : require('../assets/boy.png'));

  return (
    <View style={[styles.container]}>
      <View style={styles.avatars}>
        <View style={{ flex: 0.5, alignItems: 'center' }}>
          <Avatar.Image style={styles.avatar} size={95} source={formattedAvatar(avatar)} />
          <Text style={styles.playerName}>{name}</Text>
        </View>

        <View
          style={{
            flex: 0.7,
            alignItems: 'center',
          }}
        >
          <Text style={styles.infoText}>Número {positionRanking || '0'} no ranking</Text>
          <Text style={styles.infoText}>{score || '0'} pontos</Text>
          <Text style={styles.infoText}>10-2 (V-D)</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 10,
    padding: 10,
    height: 145,
    backgroundColor: '#efefef',
  },
  date: {
    fontSize: 14,
    fontWeight: '500',
  },
  avatars: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  avatar: {
    borderColor: 'grey',
    borderWidth: 1,
  },
  playerName: {
    textAlign: 'center',
    marginTop: 10,
  },
  centerItem: {
    justifyContent: 'center',
  },
  infoText: {
    fontWeight: 'bold',
    marginTop: 10,
  },
});
