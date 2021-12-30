import React, { useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, View } from 'react-native';
import { Caption } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { useChallenge } from '../context/ChallengeContext';
import { IChallenge } from '../interfaces/challenge.interface';
import api from '../services/api';
import CardChallenge from './CardChallenge';

export default function ListChallenges() {
  const [challenges, setChallenges] = useState<IChallenge[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { user } = useAuth();
  const { isRefreshChallenges } = useChallenge();

  useEffect(() => {
    loadChallenges();
  }, []);

  useEffect(() => {
    if (isRefreshChallenges) {
      loadChallenges();
    }
  }, [isRefreshChallenges]);

  const onRefresh = async () => {
    setRefreshing(true);

    await loadChallenges();

    setRefreshing(false);
  };

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

  return (
    <View style={{ backgroundColor: 'white', height: '100%' }}>
      <FlatList
        style={{ marginVertical: 15 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        initialNumToRender={1}
        data={challenges}
        ListEmptyComponent={() => <Caption style={{ textAlign: 'center' }}>Nenhum desafio até o momento...</Caption>}
        ItemSeparatorComponent={() => <View style={{ height: 15 }}></View>}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <CardChallenge {...item} key={item._id} />}
      />
    </View>
  );
}
