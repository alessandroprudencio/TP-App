import moment from 'moment';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Caption } from 'react-native-paper';
import { IChallenge } from '../interfaces/challenge.interface';
import ModalSetResult from './ModalSetResult';

export default function ButtonFinallyChallenge({ dateTimeResponse, _id, players }: IChallenge) {
  const formattedDate = moment(new Date(dateTimeResponse)).format('DD/MM/yyyy H:m');

  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Button icon="check" mode="contained" theme={{ roundness: 5 }} onPress={() => setIsVisible(true)}>
        Finalizar
      </Button>

      {dateTimeResponse && <Caption style={{ textAlign: 'center' }}>Aceito em: {formattedDate}</Caption>}

      <ModalSetResult isVisible={isVisible} setIsVisible={setIsVisible} players={players} challengeId={_id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // padding: 10,
  },
  containerStyle: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    minHeight: 480,
  },
});
