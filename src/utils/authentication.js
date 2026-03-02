// @flow
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTHENTICATION_STORAGE_KEY = 'token';
const USER_ID_STORAGE_KEY = 'user_id';


export function getAuthenticationToken() {
  return AsyncStorage.getItem(AUTHENTICATION_STORAGE_KEY);
}

export async function setAuthenticationToken(token) {
  return AsyncStorage.setItem(AUTHENTICATION_STORAGE_KEY, token);
}

export async function clearAuthenticationToken() {
  return AsyncStorage.removeItem(AUTHENTICATION_STORAGE_KEY);
}

export function getUserId() {
  return AsyncStorage.getItem(USER_ID_STORAGE_KEY);
}

export async function setUserId(token) {
  return AsyncStorage.setItem(USER_ID_STORAGE_KEY, token);
}

export async function clearUserId() {
  return AsyncStorage.removeItem(USER_ID_STORAGE_KEY);
}


