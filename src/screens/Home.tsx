import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import ButtonFloatComponent from '../components/ButtonFloat';
import HeaderUserComponent from '../components/HeaderUser';
import ListChallenges from '../components/ListChallenges';
import ListHistoryChallenges from '../components/ListHistoryChallenges';
import { useAuth } from '../context/AuthContext';
import { useChallenge } from '../context/ChallengeContext';
import api from '../services/api';
import ModalChallengeScreen from './ModalChallenge';

enum Tabs {
  CHALLENGES = 'CHALLENGES',
  HISTORY = 'HISTORY',
}

const Tab = createMaterialTopTabNavigator();

export default function HomeScreen() {
  const [visibleModal, setVisibleModal] = useState<boolean>(false);

  const { colors } = useTheme();

  const { user, setUser } = useAuth();

  const { setIsRefreshChallenges } = useChallenge();

  useEffect(() => {
    if (user._id) {
      getPositionRanking();
    }
  }, []);

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

    setIsRefreshChallenges(true);
  };

  return (
    <View style={styles.container}>
      <HeaderUserComponent />

      <Tab.Navigator initialRouteName="Desafios">
        <Tab.Screen
          options={{
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.placeholder,
            tabBarIndicatorStyle: { backgroundColor: colors.primary },
          }}
          name={'Desafios'}
          component={ListChallenges}
        />
        <Tab.Screen
          options={{
            lazy: true,
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.placeholder,
            tabBarIndicatorStyle: { backgroundColor: colors.primary },
          }}
          name={`Histórico`}
          component={ListHistoryChallenges}
        />
      </Tab.Navigator>

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
