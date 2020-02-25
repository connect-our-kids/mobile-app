import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import getEnvVars from '../../../environment';
export const GET_USER_CASES_START = 'GET_USER_CASES_START';
export const GET_USER_CASES_SUCCESS = 'GET_USER_CASES_SUCCESS';
export const GET_USER_CASES_FAILURE = 'GET_USER_CASES_FAILURE';
export const CLEAR_USER_CASES = 'CLEAR_USER_CASES';

// this action grabs all cases for a specified user

// define familyConnectionsURL from environment for axios calls
const { familyConnectionsURL } = getEnvVars();

export const getUserCases = () => (dispatch) => {
    SecureStore.getItemAsync('cok_access_token')
        .then((accessToken) => {
            dispatch({ type: GET_USER_CASES_START });
            axios
                .get(`${familyConnectionsURL}/api/v1/cases/?page=1&page_size=100&status=Open`, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    dispatch({
                        type: GET_USER_CASES_SUCCESS,
                        payload: res.data,
                    });
                })
                .catch((error) => {
                    dispatch({
                        type: GET_USER_CASES_FAILURE,
                        payload: error.response.data,

                    });
                });
        });

};

export const clearUserCases = () => (dispatch) => {
    dispatch({ type: CLEAR_USER_CASES });
};
