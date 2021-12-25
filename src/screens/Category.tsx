import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import CardDetailsPlayerComponent from '../components/CardDetailsPlayer';
import HeaderWithBackComponent from '../components/headerWithBack';
import { ICategory } from '../interfaces/category.interface';
import { RootStackParamList } from '../routes';
import api from '../services/api';

export default function CategoryScreen() {
  const [players, setPlayers] = useState<Array<any>>();
  const [categoryName, setCategoryName] = useState<string>();
  const { navigate } = useNavigation<NavigationProp<RootStackParamList>>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'Category'>>();

  const { colors } = useTheme();

  const getData = async () => {
    try {
      setCategoryName(params.categoryName);

      const response: ICategory = await (await api.get(`categories/${params.categoryId}`)).data;

      setPlayers(response.players);
    } catch (error) {
      return Alert.alert('Erro ao buscar jogadores desta categoria.');
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <HeaderWithBackComponent style={{ marginBottom: 10 }} title={categoryName} handleBack={() => navigate('Home')} />

      <Text style={{ color: colors.smallText, fontSize: 14, marginBottom: 15 }}>Jogadores ({players?.length})</Text>

      <FlatList
        data={players}
        ItemSeparatorComponent={({}) => <View style={{ height: 15 }}></View>}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => <CardDetailsPlayerComponent {...item} key={item._id} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
