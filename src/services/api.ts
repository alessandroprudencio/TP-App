import axios from 'axios';
import { URL_API } from '../config';

const instance = axios.create({
  baseURL: URL_API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
