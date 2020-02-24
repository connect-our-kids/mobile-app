import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import getEnvVars from '../../../environment';
export const GET_ENGAGEMENTS_START = "GET_ENGAGEMENTS_START";
export const GET_ENGAGEMENTS_SUCCESS = "GET_ENGAGEMENTS_SUCCESS";
export const GET_ENGAGEMENTS_FAILURE = "GET_ENGAGEMENTS_FAILURE";
export const CLEAR_ENGAGEMENTS = "CLEAR_ENGAGEMENTS";

export const GET_DOCUMENTS_START = "GET_DOCUMENTS_START";
export const GET_DOCUMENTS_SUCCESS = "GET_DOCUMENTS_SUCCESS";
export const GET_DOCUMENTS_FAILURE = "GET_DOCUMENTS_FAILURE";
export const CLEAR_DOCUMENTS = "CLEAR_DOCUMENTS";

export const GET_DETAILS_START = "GET_DETAILS_START"
export const GET_DETAILS_SUCCESS = "GET_DETAILS_SUCCESS"
export const GET_DETAILS_FAILURE = "GET_DOCUMENTS_FAILURE"

export const SET_DETAILS = 'SET_DETAILS'
// https://family-staging.connectourkids.org/api/v1/individualperson/?

// this action grabs the history of engagements between specific child and person

// define familyConnectionsURL from environment for axios calls
const { familyConnectionsURL } = getEnvVars()

export const getEngagements = (id) => dispatch => {
    SecureStore.getItemAsync('cok_access_token')
        .then((accessToken) => {
            dispatch({ type: GET_ENGAGEMENTS_START });
            axios
                .get(`${familyConnectionsURL}/api/v1/person/${id}/histories/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                .then(res => {

                    dispatch({
                        type: GET_ENGAGEMENTS_SUCCESS,
                        // filter out Reminders as they are not properly implemented yet
                        payload: res.data.results.filter(engagement => engagement.data_type !== 'R')
                    });
                })
                .catch(err => {

                    dispatch({
                        type: GET_ENGAGEMENTS_FAILURE,
                        payload: err.response
                    });
                });
        })
};

export const clearEngagements = () => dispatch => {
    dispatch({ type: CLEAR_ENGAGEMENTS })
}

// grab the documents for specific person

export const getDocuments = (id) => dispatch => {
    SecureStore.getItemAsync('cok_access_token')
        .then((accessToken) => {
            dispatch({ type: GET_DOCUMENTS_START });
            axios
                .get(`${familyConnectionsURL}/api/v1/person/${id}/documents/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                .then(res => {
                    // console.log('res getDocs', res.data.results);
                    dispatch({
                        type: GET_DOCUMENTS_SUCCESS,
                        payload: res.data.results
                    });
                })
                .catch(err => {
                    console.log(err);
                    dispatch({
                        type: GET_DOCUMENTS_FAILURE,
                        payload: err.response
                    });
                });
        })
};

export const clearDocuments = () => dispatch => {
    dispatch({ type: CLEAR_DOCUMENTS })
}

export const getDetails = (id) => dispatch => {
    SecureStore.getItemAsync('cok_access_token')
        .then((accessToken) => {
            dispatch({ type: GET_DETAILS_START });
            axios
                .get(`${familyConnectionsURL}/api/v1/individualperson/?id=${id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                .then(res => {

                    dispatch({
                        type: GET_DETAILS_SUCCESS,
                        payload: res.data.results
                    });
                })
                .catch(err => {
                    dispatch({
                        type: GET_DETAILS_FAILURE,
                        payload: err.response
                    });
                });
        })
}

export const setDetails = (bool) => dispatch => {
    dispatch({ type: SET_DETAILS, payload: bool })
}
