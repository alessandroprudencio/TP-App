import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../routes';

export default function HeaderUserComponent() {
  const { navigate } = useNavigation<NavigationProp<RootStackParamList>>();

  const { user, logout } = useAuth();

  return (
    <>
      <View style={styles.container}>
        <View style={styles.leftItem}>
          <Text>
            Olá, <Text style={styles.name}>{user.name}</Text>
          </Text>
          <TouchableOpacity onPress={logout}>
            <Text style={styles.logout}>
              {' '}
              <Icon size={18} name="logout" color={'black'} />
              Sair
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.centerItem}>
          <Avatar.Image style={styles.avatar} size={120} source={require('../assets/boy.png')} />

          {user.positionRanking && (
            <Text style={styles.ranking}>
              Número <Text style={{ fontWeight: 'bold' }}>{user.positionRanking}</Text> no ranking
            </Text>
          )}
        </View>

        <View style={styles.rightItem}>
          <TouchableOpacity
            onPress={() => navigate('Category', { categoryId: user.category._id, categoryName: user.category.name })}
          >
            <Text style={styles.category}>{user.category?.name}</Text>
          </TouchableOpacity>

          <Text style={styles.score}>{user.score || '0'} pontos</Text>

          <Text style={styles.vd}>10-2 (V-D)</Text>
        </View>
      </View>

      <View style={styles.divider} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 14,
    fontWeight: '500',
  },
  centerItem: {
    alignItems: 'center',
  },
  leftItem: {
    width: '30%',
  },
  rightItem: {
    alignItems: 'flex-end',
    width: '30%',
  },
  category: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  logout: {
    fontSize: 16,
    marginTop: '100%',
    fontWeight: 'bold',
  },
  score: {
    marginTop: 10,
  },
  vd: {
    marginTop: 10,
  },
  divider: {
    marginVertical: 15,
    backgroundColor: '#ccc',
    height: 1,
    width: '100%',
  },
  avatars: {
    flex: 1,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  avatar: {
    borderColor: 'grey',
    borderWidth: 1,
  },
  ranking: {
    marginTop: 15,
  },
  name: {
    fontWeight: 'bold',
  },
});
