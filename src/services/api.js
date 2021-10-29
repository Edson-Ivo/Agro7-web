import axios from 'axios';
import { getCookieFromBrowser } from '../helpers/cookies';
import { AUTH_COOKIE_TOKEN } from './constants';

export const api = axios.create({
  // baseURL: 'https://agrofind.com.br'
  baseURL: 'https://agro7dev.herokuapp.com'
});

api.interceptors.request.use(config => {
  const token = getCookieFromBrowser(AUTH_COOKIE_TOKEN);
  config.headers.Authorization = token ? `Bearer ${token}` : '';

  return config;
});
