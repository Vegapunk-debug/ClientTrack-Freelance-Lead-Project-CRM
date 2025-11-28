import axios from "axios";
import Constants from 'expo-constants';
import * as SecureStore from "expo-secure-store";

const ApiURL = () => {
  const debuggerHost = Constants.expoConfig?.hostUri;
  if (debuggerHost) {
    const host = debuggerHost.split(':')[0];
    return `http://${host}:3000`;
  }
  return "http://localhost:3000";
};

import * as SecureStore from "expo-secure-store";

const API = axios.create({
  baseURL: "http://11.6.2.181:3000",   //your LAN IP
});

API.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
