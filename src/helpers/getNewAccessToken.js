import axios from 'axios';
import * as SecureStore from 'expo-secure-store'
import getEnvVars from '../../environment.tsx';

const { auth0ClientId } = getEnvVars();

// Get New Access Token and ID Token using Refresh Token
const getNewAccessToken = async () => {

    const refresh_token = await SecureStore.getItemAsync('cok_refresh_token');

    const newAccessParams = {
        client_id: auth0ClientId,
        redirect_uri: 'exp://127.0.0.1:19000/--/expo-auth-session',
        // client_secret: '', GET CLIENT SECRET FROM TRAVIS
        grant_type: 'refresh_token',
        response_type: 'token',
        refresh_token: refresh_token
    }

    axios
        .post('https://connectourkids.auth0.com/oauth/token', newAccessParams)
        .then(async res => {
            await SecureStore.setItemAsync('cok_access_token', res.data.access_token);
            await SecureStore.setItemAsync('cok_id_token', res.data.id_token);

            return res.data;
        })
        .catch(err => console.log(err))

    const cok_access_token = await SecureStore.getItemAsync('cok_access_token')

}

export default getNewAccessToken;
