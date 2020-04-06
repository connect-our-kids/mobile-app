import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { getEnvVars } from '../../environment';
// import { verifier, challenge } from './auth0Verifiers';
import Constants from 'expo-constants';

const { auth0ClientId, auth0Audience } = getEnvVars();

// Get a Refresh Token using 'Authorization Code Flow' ( code ) and save to SecureStorage for use in retrieving new Access Tokens
const getRefreshToken = async () => {
    const code = await SecureStore.getItemAsync('cok_auth_code');
    // const device = Constants.deviceName;

    const refreshParams = {
        client_id: auth0ClientId,
        // code_verifier: verifier,
        // code_challenge: challenge,
        // response_type: 'code',
        audience: auth0Audience,
        scope: 'openid profile email offline_access',
        // redirect_uri: 'exp://127.0.0.1:19000/--/expo-auth-session',
        // state: 'asldfkj6748fjh9pjshhjs',
        code: code,
        grant_type: 'authorization_code',
        // code: code,
        // device: device,
    };

    axios
        .post('https://connectourkids.auth0.com/oauth/token', refreshParams)
        .then(async (res) => {
            await SecureStore.setItemAsync(
                'cok_refresh_token',
                res.data.refresh_token
            );
            // SecureStore.setItemAsync('cok_access_token', JSON.stringify(res.data.access_token)),
            await SecureStore.setItemAsync('cok_id_token', res.data.id_token);
        })
        .catch((err) => console.log(err));
};

export default getRefreshToken;
