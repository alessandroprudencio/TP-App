import moment from 'moment';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../context/AuthContext';
import { useChallenge } from '../context/ChallengeContext';
import { IChallenge } from '../interfaces/challenge.interface';
import ButtonAcceptDecline from './ButtonAcceptDecline';
import ButtonFinallyChallenge from './ButtonFinnalyChallenge';
import ModalMessageComponent from './ModalMessage';

export default function CardChallenge(challenge: IChallenge) {
  const [showMessage, setShowMessage] = useState<boolean>(false);

  // const { setSelectedChallenge } = useChallenge();

  const { user } = useAuth();

  const formattedName = (name: string) => {
    const convertArray = name.split(' ');

    if (convertArray.length > 1) return `${convertArray[0]} ${convertArray[1].charAt(0)}.`;

    return name;
  };

  const formattedAvatar = (avatar: string) => (avatar ? { uri: avatar } : require('../assets/boy.png'));

  const renderCard = () => {
    switch (challenge.status) {
      case 'REALIZADO':
        break;

      case 'ACEITO':
        return <ButtonFinallyChallenge {...challenge} />;

      case 'PENDENTE':
        if (challenge.requester !== user._id) return <ButtonAcceptDecline challengeId={challenge._id} />;

        return (
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Icon size={14} style={{ marginRight: 5 }} name="clock-outline"></Icon>
            <Text>Aguardando...</Text>
          </View>
        );
    }
  };

  return (
    <View style={[styles.container]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.date}>{moment(challenge.dateTimeChallenge).format('DD/MM/yyyy H:mm')}</Text>

        {challenge.message && (
          <TouchableOpacity
            onPress={() => {
              // setSelectedChallenge(challenge);
              setShowMessage(true);
            }}
          >
            <Icon name="message" color="grey" size={20} onPress={() => console.log('Pressed')} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.avatars}>
        <View style={{ flex: 0.32, alignItems: 'center' }}>
          <Avatar.Image style={styles.avatar} size={60} source={formattedAvatar(challenge.players[0].avatar)} />

          <Text style={styles.playerName}>{formattedName(challenge.players[0].name)}</Text>
        </View>

        <View style={styles.centerItem}>{renderCard()}</View>

        <View style={{ flex: 0.32, alignItems: 'center' }}>
          <Avatar.Image style={styles.avatar} size={60} source={formattedAvatar(challenge.players[1].avatar)} />

          <Text style={styles.playerName}>{formattedName(challenge.players[1].name)}</Text>
        </View>
      </View>

      {challenge.message && (
        <ModalMessageComponent message={challenge.message} showMessage={showMessage} setShowMessage={setShowMessage} />
      )}
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
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  avatar: {
    borderColor: 'grey',
    borderWidth: 1,
  },

  playerName: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  centerItem: {
    flex: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
