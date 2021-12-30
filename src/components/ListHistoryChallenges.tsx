import React, { useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, Text, View } from 'react-native';
import { Caption } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { IChallenge } from '../interfaces/challenge.interface';
import api from '../services/api';
import CardChallenge from './CardChallenge';

export default function ListHistoryChallenges() {
  const [history, setHistory] = useState<IChallenge[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    console.log('montou screen history');
    loadHistory();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);

    await loadHistory();

    setRefreshing(false);
  };

  const loadHistory = async () => {
    try {
      const challenges: Array<IChallenge> = await (await api.get(`challenges/${user._id}/players/history`)).data;

      setHistory(challenges);
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
        data={history}
        ListEmptyComponent={() => (
          <Caption style={{ textAlign: 'center' }}>Nenhuma partida realizada até o momento...</Caption>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 15 }}></View>}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <CardChallenge {...item} key={item._id} />}
      />
    </View>
  );
}
