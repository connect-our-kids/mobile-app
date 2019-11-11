import {
  LOG_OUT,
  SET_MODAL_VISIBLE,
  SET_VIDEO_AGREE_VISIBLE,
  SET_VIDEO_PLAYER_VISIBLE,
  SET_USER_CREDS,
  SET_LOGGED_IN_TRUE
} from './actionTypes';
import { sendEvent } from './../../helpers/createEvent';
import * as SecureStore from 'expo-secure-store'
import jwtDecode from 'jwt-decode';


export const logOut = email => {
  sendEvent(email, 'click', 'logout');
  return { type: LOG_OUT };
};

export const setUserCreds = (decodedToken, auth0Data) => {
  console.log('decoded Token, Auth0data', decodedToken, auth0Data)
  return { type: SET_USER_CREDS, decodedToken, auth0Data };
};

export const authChecker = () => dispatch => {
  SecureStore.getItemAsync('cok_id_token')
  .then(res => {
    if (res) {
      const decodedIdToken = jwtDecode(res)
      dispatch({ type: SET_LOGGED_IN_TRUE, payload: decodedIdToken })
    }
  })
  .catch(err => 'error')
}

// Sign Up Modal Sequence Actions
export const setModalVisible = visible => {
  return { type: SET_MODAL_VISIBLE, payload: visible };
};

export const setAgreeModalVisible = visible => {
  return { type: SET_VIDEO_AGREE_VISIBLE, payload: visible };
};

export const setVideoPlayerModalVisible = visible => {
  return { type: SET_VIDEO_PLAYER_VISIBLE, payload: visible };
};
