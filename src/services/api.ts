import axios from 'axios';
import { URL_API } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async function (error) {
    if (error.response.status === 401) {
      return await AsyncStorage.multiRemove(['@token', '@user', '@pushToken']);
    }

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  },
);

export default instance;
