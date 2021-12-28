import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { IPlayer } from '../interfaces/player.interface';
import api from '../services/api';

export const AuthContext = createContext({
  isLogged: false,
  user: {} as IPlayer,
  setToken: (_token: string) => {},
  setUser: (_user: IPlayer) => {},
  logout: () => {},
  isLoading: true,
});

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<IPlayer>({} as IPlayer);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getToken();

    return () => {
      setUser({} as IPlayer);

      setToken(null);

      setIsLoading(true);
    };
  }, []);

  const getToken = async () => {
    const existToken = await AsyncStorage.getItem('@token');

    const existUser = await AsyncStorage.getItem('@user');

    if (existToken && existUser) {
      api.defaults.headers.common['Authorization'] = `Bearer ${existToken}`;

      setToken(existToken);

      setUser(JSON.parse(existUser));
    } else {
      await logout();
    }

    setIsLoading(false);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['@token', '@user', '@pushToken']);

    setToken(null);

    setUser({} as IPlayer);
  };

  return (
    <AuthContext.Provider value={{ isLogged: !!token, user, isLoading, setToken, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
