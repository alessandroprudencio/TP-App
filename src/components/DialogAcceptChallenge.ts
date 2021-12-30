import moment from 'moment';
import { Alert } from 'react-native';
import api from '../services/api';

const DialogAcceptChallenge = async (challengeId: string) =>
  new Promise((resolve, reject) => {
    Alert.alert(
      'Aceitar desafio?',
      'Deseja realmente aceitar o desafio?',
      [
        {
          text: 'Cancelar',
          onPress: async () => {
            return false;
          },
        },
        {
          text: 'Sim',
          onPress: async () => {
            try {
              await api.put(`challenges/${challengeId}`, {
                dateTimeResponse: moment().toISOString(),
                status: 'ACEITO',
              });

              return resolve(true);
            } catch (error) {
              if (error instanceof Error) Alert.alert('Erro ao aceitar desafio', error.message);

              reject(false);
            }
          },
        },
      ],
      { cancelable: false },
    );
  });

export default DialogAcceptChallenge;
