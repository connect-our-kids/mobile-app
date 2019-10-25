import axios from 'axios';
import * as SecureStore from 'expo-secure-store'
import getEnvVars from '../../environment.js';
import { verifier, challenge } from './auth0Verifiers';
import Constants from 'expo-constants';

const { auth0ClientId } = getEnvVars();

// Get a Refresh Token using 'Authorization Code Flow' ( code ) and save to SecureStorage for use in retrieving new Access Tokens
const getRefreshToken = async () => {

  const code = await SecureStore.getItemAsync('cok_auth_code');
  const device = await Constants.deviceName;
  console.log('CODE DEVICE', code, device)
  const refreshParams = {
    client_id: auth0ClientId,
    code_verifier: verifier,
    // code_challenge: challenge,
    // response_type: 'code',
    audience: 'https://family-staging.connectourkids.org/api/v1/',
    scope: 'openid profile email offline_access',
    // redirect_uri: 'exp://127.0.0.1:19000/--/expo-auth-session',
    // state: 'asldfkj6748fjh9pjshhjs',
    code: code,
    grant_type: 'authorization_code',
    // code: code,
    // device: device,
  }

  axios
    .post('https://connectourkids.auth0.com/oauth/token', refreshParams)
    .then(res => {
      SecureStore.setItemAsync('cok_refresh_token', JSON.stringify(res.data.refresh_token))
      // SecureStore.setItemAsync('cok_access_token', JSON.stringify(res.data.access_token)),
      SecureStore.setItemAsync('cok_id_token', JSON.stringify(res.data.id_token))
      // console.log('res', res)
    })
    .catch(err => console.log(err))
    console.log('REFRESH', await SecureStore.getItemAsync('cok_refresh_token'))
}

export default getRefreshToken;