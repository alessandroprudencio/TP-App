import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { URL_API } from '../config';

const instance = axios.create({
  baseURL: URL_API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    if (error.response?.status === 401) {
      return await AsyncStorage.multiRemove(['@token', '@user', '@pushToken']);
    }

    return Promise.reject(error);
  },
);

export default instance;
