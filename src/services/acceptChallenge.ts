import { Alert } from 'react-native';

export const acceptChallenge = () => {
  try {
    Alert.alert('Aceitar desafio?', 'Deseja realmente aceitar o desafio?', [
      // The "Yes" button
      {
        text: 'Não',
      },
      {
        text: 'Sim',
        onPress: async () => {
          console.log('accept challenge');
          // await api.put(`challenges/${challengeId}`);
        },
      },
    ]);
  } catch (error) {
    if (error instanceof Error) Alert.alert('Erro ao aceitar desafio', error.message);
  }
};
