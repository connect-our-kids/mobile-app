import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import getEnvVars from '../../../environment';
export const GET_CASE_CONNECTIONS_START = 'GET_CASE_CONNECTIONS_START';
export const GET_CASE_CONNECTIONS_SUCCESS = 'GET_CASE_CONNECTIONS_SUCCESS';
export const GET_CASE_CONNECTIONS_FAILURE = 'GET_CASE_CONNECTIONS_FAILURE';
export const CLEAR_CASE_CONNECTIONS = 'CLEAR_CASE_CONNECTIONS';

// this action grabs all connections for a specified case

// define familyConnectionsURL from environment for axios calls
const { familyConnectionsURL } = getEnvVars();

export const getCaseConnections = (pk) => (dispatch) => {
    SecureStore.getItemAsync('cok_access_token')
        .then((accessToken) => {
            dispatch({ type: GET_CASE_CONNECTIONS_START });
            axios
                .get(`${familyConnectionsURL}/api/v1/cases/${pk}/relationships/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => {
                    // console.log("Case data: " + JSON.stringify(res), null, 4);
                    dispatch({
                        type: GET_CASE_CONNECTIONS_SUCCESS,
                        payload: res.data.results,
                    });
                })
                .catch((err) => {

                    dispatch({
                        type: GET_CASE_CONNECTIONS_FAILURE,
                        payload: err.response,
                    });
                });
        });
};

// to prevent data persistance during case switching
export const clearCaseConnections = () => (dispatch) => {
    dispatch({ type: CLEAR_CASE_CONNECTIONS });
};
