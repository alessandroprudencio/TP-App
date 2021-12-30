import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Keyboard, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Dialog, IconButton, Modal, Portal, RadioButton, Text, TextInput, Title } from 'react-native-paper';
import { useChallenge } from '../context/ChallengeContext';
import { IPlayer } from '../interfaces/player.interface';
import api from '../services/api';

interface IModalSetResult {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  players: IPlayer[];
  challengeId: string;
}

interface ISet {
  firstValue: string;
  secondValue: string;
}

interface IErroSet {
  indice: number;
  firstValue: boolean;
  secondValue: boolean;
}

interface IError {
  winPlayer: boolean;
  sets: Array<IErroSet>;
}

export default function ModalSetResult({ isVisible, setIsVisible, players, challengeId }: IModalSetResult) {
  const [hasError, setHasError] = useState<IError>({
    winPlayer: false,
    sets: [],
  });

  const { setIsRefreshChallenges } = useChallenge();

  const [showDropDown, setShowDropDown] = useState(false);

  const [inputValue, setInputValues] = useState<ISet[]>([]);

  const [numInputs, setNumInputs] = useState<number>(3);

  const [winPlayer, setWinPlayer] = useState<any>({} as IPlayer);

  useEffect(() => {
    if (!isVisible) {
      initialState();
    }
  }, [isVisible]);

  const initialState = () => {
    setShowDropDown(false);
    setInputValues([]);
    setNumInputs(3);
    setNumInputs(3);
    setWinPlayer({});
  };

  const handleEndMatch = async () => {
    try {
      if (!winPlayer._id) setHasError((oldValue) => ({ ...oldValue, winPlayer: true }));

      validationAllInputsSets();

      const checkExistErrors = hasError.sets.map((obj) => {
        return obj.firstValue || obj.secondValue;
      });

      if (Object.values(hasError).includes(true) || checkExistErrors.includes(true)) return;

      const result = inputValue.map((set: { firstValue: string; secondValue: string }) => {
        return { set: set.firstValue + '-' + set.secondValue };
      });

      const body = { winPlayer: winPlayer._id, result };

      await api.post(`challenges/${challengeId}/set-result`, body);

      setIsVisible(false);

      setIsRefreshChallenges(true);
    } catch (error) {
      if (error instanceof Error) Alert.alert('Erro ao finalizar partida', error.message);
    }
  };

  const handleValue = (indice: number, firstValue?: string, secondValue?: string) => {
    const object = {
      firstValue: firstValue === undefined ? inputValue[indice]?.firstValue : firstValue,
      secondValue: secondValue === undefined ? inputValue[indice]?.secondValue : secondValue,
    };

    validationCurrentInputSet(indice, object.firstValue, object.secondValue);

    const oldInputsValues = inputValue;

    oldInputsValues[indice] = object;

    setInputValues(oldInputsValues);
  };

  const validationAllInputsSets = () => {
    for (let i = 0; i < numInputs; i++) {
      const oldErrosSet = hasError.sets;

      const isExist = oldErrosSet.findIndex((item) => item.indice === i);

      if (isExist >= 0) {
        const newSets = {
          indice: i,
          firstValue: oldErrosSet[isExist].firstValue,
          secondValue: oldErrosSet[isExist].secondValue,
        };

        oldErrosSet[isExist] = newSets;

        setHasError((oldValue) => ({
          ...oldValue,
          sets: [...oldErrosSet],
        }));
      } else {
        const newSets = {
          indice: i,
          firstValue: true,
          secondValue: true,
        };

        setHasError((oldValue) => ({
          ...oldValue,
          sets: [...oldValue.sets, newSets],
        }));
      }
    }
  };

  const validationCurrentInputSet = (indice: number, firstValue?: string, secondValue?: string) => {
    const newSets = {
      indice: indice,
      firstValue: !firstValue,
      secondValue: !secondValue,
    };

    // check already exist in erros
    const oldErrosSet = hasError.sets;

    const isExist = oldErrosSet.findIndex((item) => item.indice === indice);

    if (isExist >= 0) {
      oldErrosSet[isExist] = newSets;

      setHasError((oldValue) => ({
        ...oldValue,
        sets: [...oldErrosSet],
      }));
    } else {
      setHasError((oldValue) => ({
        ...oldValue,
        sets: [...oldValue.sets, newSets],
      }));
    }
  };

  const addSet = useCallback(() => {
    setNumInputs((value) => value + 1);
  }, []);

  const removeSet = (i: number) => {
    setNumInputs((value) => value - 1);
  };

  const inputs: JSX.Element[] = [];

  for (let i = 0; i < numInputs; i++) {
    inputs.push(
      <View key={i}>
        <Text style={{ marginBottom: 0, marginTop: 10 }}>Set {i + 1}</Text>

        <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
          <View style={{ width: 140 }}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(value) => handleValue(i, value, undefined)}
              label="Valor 1"
              error={hasError.sets?.find((item) => item.indice === i)?.firstValue}
              mode="outlined"
            />
          </View>

          <View style={{ width: 140 }}>
            <TextInput
              style={styles.input}
              onChangeText={(value) => handleValue(i, undefined, value)}
              keyboardType="numeric"
              label="Valor 2"
              error={hasError.sets?.find((item) => item.indice === i)?.secondValue}
              mode="outlined"
            />
          </View>

          <View style={{ justifyContent: 'center' }}>
            <IconButton icon="close" color="red" size={20} onPress={() => removeSet(i)} />
          </View>
        </View>
      </View>,
    );
  }

  return (
    <Portal>
      <Modal
        visible={isVisible}
        dismissable={false}
        contentContainerStyle={[styles.containerStyle, { borderRadius: 5 }]}
      >
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 0,
            paddingTop: 0,
          }}
        >
          <Title>Insira o resultado da partida</Title>

          <IconButton icon="close" size={30} onPress={() => setIsVisible(false)} />
        </View>

        {/* Dropdown */}
        <View style={{ marginBottom: 10 }}>
          <TextInput
            style={styles.input}
            onFocus={() => {
              Keyboard.dismiss();
              setShowDropDown(true);
            }}
            error={hasError.winPlayer}
            label="Selecione o Ganhador"
            value={winPlayer.name}
            mode="outlined"
          />

          <Portal>
            <Dialog visible={showDropDown} onDismiss={() => setShowDropDown(false)}>
              <Dialog.Title>Selecione o ganhador:</Dialog.Title>

              <Dialog.Content>
                <RadioButton.Group
                  onValueChange={(value) => {
                    setWinPlayer({ _id: value, name: players.find((p: any) => p._id === value)?.name });

                    setHasError((oldValue) => ({ ...oldValue, winPlayer: false }));

                    setShowDropDown(false);
                  }}
                  value={winPlayer._id}
                >
                  {players?.map((player: IPlayer) => (
                    <View style={{ alignItems: 'flex-start' }} key={player._id}>
                      <RadioButton.Item
                        style={{
                          paddingLeft: 0,
                        }}
                        position="leading"
                        mode="android"
                        label={player.name}
                        value={player._id}
                      />
                    </View>
                  ))}
                </RadioButton.Group>
              </Dialog.Content>
            </Dialog>
          </Portal>
        </View>

        {/* Inputs */}
        <ScrollView keyboardShouldPersistTaps="always" keyboardDismissMode="on-drag" style={{ flex: 1 }}>
          {inputs}
        </ScrollView>

        <Button style={{ marginBottom: 10, marginTop: 10 }} icon="plus" mode="text" onPress={addSet}>
          Add Set
        </Button>

        <Button
          style={{ marginBottom: 20, height: 40, justifyContent: 'center' }}
          mode="contained"
          onPress={() => handleEndMatch()}
        >
          Finalizar Partida
        </Button>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    // padding: 10,
  },

  containerStyle: {
    backgroundColor: 'white',
    paddingTop: 0,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    minHeight: 500,
  },

  input: {
    height: 40,
    backgroundColor: 'white',
  },
});
