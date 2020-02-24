import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import getEnvVars from '../../../environment';
export const GET_CASE_DATA_START = "GET_CASE_DATA_START";
export const GET_CASE_DATA_SUCCESS = "GET_CASE_DATA_SUCCESS";
export const GET_CASE_DATA_FAILURE = "GET_CASE_DATA_FAILURE";
export const CLEAR_CASE_DATA = "CLEAR_CASE_DATA";

// this action grabs the data from all cases

// define familyConnectionsURL from environment for axios calls
const { familyConnectionsURL } = getEnvVars()

export const getCaseData = (pk) => dispatch => {
    SecureStore.getItemAsync('cok_access_token')
        .then((accessToken) => {
            dispatch({ type: GET_CASE_DATA_START });
            axios
                .get(`${familyConnectionsURL}/api/v1/cases/${pk}/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                .then(res => {
                    dispatch({
                        type: GET_CASE_DATA_SUCCESS,
                        payload: res.data
                    });
                })
                .catch(err => {

                    dispatch({
                        type: GET_CASE_DATA_FAILURE,
                        payload: err.response
                    });
                });
        })
};

export const clearCaseData = () => dispatch => {
    dispatch({ type: CLEAR_CASE_DATA })
}
