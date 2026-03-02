import Axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import {ENV} from '../config/env';
import {getAuthenticationToken} from './authentication';

const SUCCESS = 'success';
const TIMEOUT = 60000;

export function get(path, {params} = {}) {
  let queryString = '';

  if (params && typeof params === 'object') {
    const query = new URLSearchParams(params).toString();
    queryString = `?${query}`;
  }

  return sendRequestAPI('GET', `${path}${queryString}`);
}

export function postAPI(path, body, formData = false) {
  return sendRequestAPI('POST', path, body, formData);
}

export function put(path, body, formData = false) {
  return sendRequestAPI('PUT', path, body, formData);
}

export function remove(path) {
  return sendRequestAPI('DELETE', path);
}

function buildUrl(path) {
  return ENV.BASE_URL + path;
}

async function getHeaders(formData = false) {
  const token = await getAuthenticationToken();
  let headers = {
    'Content-Type': formData ? 'multipart/form-data' : 'application/json',
  };

  if (token) {
    headers = {
      ...headers,
      Authorization: `Bearer ${token}`,
    };
  }
  console.log('HEADERS:', headers);
  return headers;
}

async function sendRequestAPI(
  method,
  path,
  body = undefined,
  formData = false,
) {
  try {
    const endpoint = buildUrl(path);
    const headers = await getHeaders(formData);

    const isConnected = await NetInfo.fetch().then(state => state.isConnected);
    if (!isConnected) {
      alert('No internet connection.', true);
      return;
    }
    console.log(endpoint);

    const response = await Axios({
      url: endpoint,
      method,
      headers,
      data: body,
      timeout: TIMEOUT,
    });

    if (response.data?.status !== SUCCESS) {
      if (response.data.message === 'Not Authorized!') {
        alert(
          'You are not authorized, Please sign in again!',
          response.data.message,
          () => onLogout(),
        );
      } else {
        console.log(response.data.message, true);
      }
    }

    return response;
  } catch (error) {
    console.log('API ERROR:', error);
    // alert('Network/Service issue.', true);
    throw error;
  }
}
