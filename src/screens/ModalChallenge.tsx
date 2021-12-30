import moment from 'moment';
import React, { createRef, useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { TextInputMask } from 'react-native-masked-text';
import { Avatar, Caption, TextInput as TextInputPaper, useTheme } from 'react-native-paper';
import ButtonChallenge from '../components/ButtonChallenge';
import HeaderWithBack from '../components/headerWithBack';
import { useAuth } from '../context/AuthContext';
import { IChallenge } from '../interfaces/challenge.interface';
import { IPlayer } from '../interfaces/player.interface';
import api from '../services/api';

const windowWidth = Dimensions.get('screen').width;

const height = Dimensions.get('window').height;

const messageHeight =
  Platform.OS === 'android'
    ? { minHeight: height * 0.18, maxHeight: height * 0.18 }
    : { minHeight: height * 0.2, maxHeight: height * 0.2 };

interface IError {
  date: boolean;
  time: boolean;
  message: boolean;
  opponent: boolean;
}

export default function ModalChallengeScreen({ visible, hideModal }: any) {
  const { colors } = useTheme();

  const [challenge, setChallenge] = useState<IChallenge>({} as IChallenge);

  const { user } = useAuth();

  const [date, setDate] = useState<string>();
  const [time, setTime] = useState<string>();

  const [opponents, setOpponents] = useState<IPlayer[]>([]);

  const [loading, setLoading] = useState(false);

  const [opponentSelected, setOpponentSelected] = useState<string>();

  const [hasError, setHasError] = useState<IError>({} as IError);

  const dateRef = createRef<TextInputMask>();
  const timeRef = createRef<TextInputMask>();

  useEffect(() => {
    loadOpponents();

    return () => setOpponents([]);
  }, []);

  const loadOpponents = async () => {
    const players: IPlayer[] = await (await api.get('/players')).data;

    const filteredOpponents = players.filter((p) => p._id !== user._id);

    setOpponents(filteredOpponents);
  };

  const selectPlayer = (playerId: string) => {
    setOpponentSelected(playerId);

    const players = [];

    players.push(
      { _id: user._id },
      {
        _id: playerId,
      },
    );

    setChallenge({ ...challenge, players });
  };

  const submit = async () => {
    try {
      if (!date || !time || !challenge.message! || !challenge.players) {
        return setHasError((oldValue) => ({
          ...oldValue,
          date: !date,
          time: !time,
          message: !challenge.message,
          opponent: !challenge.players,
        }));
      }

      setLoading(true);

      const requester = user._id;

      const formattedDate = moment(date, 'dd/mm/yyyy').format('yyyy-mm-DD');

      const dateTimeChallenge = moment(formattedDate + ' ' + time).toISOString();

      const payload = { ...challenge, dateTimeChallenge, requester };

      await api.post('/challenges', payload);

      hideModal();
    } catch (error) {
      if (error instanceof Error) Alert.alert('Erro ao desafiar jogador', error.message);
    } finally {
      setLoading(false);
    }
  };

  const formattedAvatar = (avatar: string) => {
    return avatar ? { uri: avatar } : require('../assets/boy.png');
  };

  return (
    <View style={styles.centeredView}>
      <Modal onRequestClose={() => hideModal()} animationType="slide" visible={visible}>
        <SafeAreaView style={{ flex: 1 }}>
          <HeaderWithBack style={{ marginHorizontal: 15 }} title="Novo desafio" handleBack={() => hideModal()} />

          <ScrollView bounces={false} contentContainerStyle={styles.modalView}>
            <View>
              {/* Input Date */}
              <TextInputPaper
                outlineColor={colors.grey}
                keyboardType="numeric"
                label="Data"
                error={hasError?.date}
                returnKeyType="done"
                mode="outlined"
                style={styles.input}
                render={(props) => (
                  <TextInputMask
                    {...props}
                    value={date}
                    type={'custom'}
                    options={{
                      mask: '99/99/9999',
                      validator: function (value, settings) {
                        return true;
                      },
                    }}
                    onChangeText={(date) => {
                      props.onChangeText?.(date);
                      setDate(date);
                    }}
                    ref={dateRef}
                  />
                )}
              />

              {/* Input Hour */}
              <TextInputPaper
                outlineColor={colors.grey}
                keyboardType="numeric"
                label="Horario"
                returnKeyType="done"
                error={hasError?.time}
                mode="outlined"
                style={styles.input}
                render={(props) => (
                  <TextInputMask
                    {...props}
                    value={time}
                    type={'custom'}
                    options={{
                      mask: '99:99',
                    }}
                    onChangeText={(time) => {
                      props.onChangeText?.(time);
                      setTime(time);
                    }}
                    ref={timeRef}
                  />
                )}
              />

              {/* Select Player */}
              <View style={styles.section}>
                <Text style={[styles.label, { color: hasError?.opponent ? colors.error : colors.text }]}>
                  Selecione o adversário:
                </Text>

                {opponents.length > 0 ? (
                  <FlatList
                    horizontal={true}
                    data={opponents}
                    ItemSeparatorComponent={(item) => (
                      <View
                        key={item._id}
                        style={{
                          flex: 1,
                          justifyContent: 'space-between',
                          width: (windowWidth / 3) * 0.45,
                        }}
                      />
                    )}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                      <View style={{ alignItems: 'center', flex: 1 }}>
                        <TouchableOpacity
                          onPress={() => {
                            selectPlayer(item._id);

                            setHasError((oldValue) => ({ ...oldValue, opponent: false }));
                          }}
                        >
                          <Avatar.Image
                            style={[
                              styles.avatar,
                              {
                                borderColor: colors.secondary,
                                borderWidth: opponentSelected === item._id ? 5 : 0,
                              },
                            ]}
                            size={90}
                            source={formattedAvatar(item.avatar)}
                          />
                        </TouchableOpacity>
                        <Text
                          style={[styles.playerName, { fontWeight: opponentSelected === item._id ? 'bold' : 'normal' }]}
                        >
                          {item.name}
                        </Text>
                      </View>
                    )}
                  />
                ) : (
                  <Caption>Nenhum adversario encontrado.</Caption>
                )}
              </View>

              {/* Message */}
              <View style={styles.section}>
                <Text style={styles.label}>Mensagem:</Text>

                <TextInputPaper
                  onChangeText={(message) => setChallenge({ ...challenge, message })}
                  blurOnSubmit={false}
                  multiline={true}
                  underlineColorAndroid="transparent"
                  editable
                  error={hasError?.message}
                  mode="flat"
                  style={messageHeight}
                  numberOfLines={12}
                  maxLength={250}
                  textAlignVertical="top"
                />
              </View>
            </View>

            <View style={{ bottom: 0, position: 'absolute', alignSelf: 'center' }}>
              <ButtonChallenge loading={loading} submit={() => submit()} />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
  },
  modalView: {
    flexGrow: 1,
    // justifyContent: 'space-evenly',
    marginHorizontal: 15,
  },
  textAreaContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  header: {
    height: 100,
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  section: {
    marginVertical: 20,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  playerName: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  avatars: {
    flex: 1,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderRadius: 30,
    borderColor: '#ccc',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
