import React, { useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import ButtonFloatComponent from '../components/ButtonFloat';
import CardChallenge from '../components/CardChallenge';
import HeaderUserComponent from '../components/HeaderUser';
import { useAuth } from '../context/AuthContext';
import { IChallenge } from '../interfaces/challenge.interface';
import api from '../services/api';
import ModalChallengeScreen from './ModalChallenge';

export default function HomeScreen() {
  const [visibleModal, setVisibleModal] = useState<boolean>(false);

  const [challenges, setChallenges] = useState<IChallenge[]>([]);

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const { colors } = useTheme();

  const { user, setUser } = useAuth();

  useEffect(() => {
    if (user._id) {
      loadChallenges();

      getPositionRanking();
    }
  }, []);

  const loadChallenges = async () => {
    try {
      const challenges: Array<IChallenge> = await (await api.get(`challenges/${user._id}/players`)).data;

      setChallenges(challenges);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Erro', error.message);
      }
    }
  };

  const getPositionRanking = async () => {
    try {
      const { positionRanking, score } = await (await api.get(`players/${user._id}`)).data;

      setUser({ ...user, positionRanking, score });
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Erro', error.message);
      }
    }
  };

  const handleHideModal = () => {
    setVisibleModal(false);

    loadChallenges();
  };

  const onRefresh = async () => {
    setRefreshing(true);

    await loadChallenges();

    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <HeaderUserComponent />

      <Text style={{ fontSize: 14, marginBottom: 15, color: colors.smallText }}>Desafios ({challenges.length})</Text>

      <FlatList
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        initialNumToRender={1}
        data={challenges}
        ItemSeparatorComponent={() => <View style={{ height: 15 }}></View>}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View>
            <CardChallenge {...item} key={item._id} />
          </View>
        )}
      />

      <ButtonFloatComponent showModal={() => setVisibleModal(true)} />

      {visibleModal && <ModalChallengeScreen visibleModal={visibleModal} hideModal={() => handleHideModal()} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
