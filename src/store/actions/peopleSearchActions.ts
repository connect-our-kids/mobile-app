import axios from 'axios';
import {
    FETCH_PEOPLE_SUCCESS,
    FETCH_PERSON,
    FETCH_PERSON_FAILURE,
    FETCH_PERSON_SUCCESS,
    FETCH_SEARCH_RESULT,
    FETCH_SEARCH_RESULT_FAILURE,
    RESET_PERSON,
    RESET_STATE,
} from './actionTypes';

import { getEnvVars } from '../../../environment';
import { sendEvent, createOptions } from '../../helpers/createEvent';
import { getAuthToken, getIdTokenFromSecureStorage } from '../../helpers/auth';
import { ThunkResult } from '../store';

const { peopleSearchURL } = getEnvVars();

export const fetchPerson = (
    body: Record<string, unknown>,
    email: string
): ThunkResult<void> => async (dispatch) => {
    dispatch({ type: FETCH_PERSON });
    // getting tokens is allowed to fail as we can send this query
    // without authentication
    try {
        body['authToken'] = await getAuthToken();
        body['idToken'] = (await getIdTokenFromSecureStorage())?.rawToken;
    } catch (error) {
        // ignore
    }

    try {
        const result = await axios.post(`${peopleSearchURL}`, body);
        if (result.status >= 200 && result.status <= 300) {
            dispatch({
                type: FETCH_PERSON_SUCCESS,
                payload: result.data.person,
            });
            const options = createOptions(0, null, null);
            sendEvent(email, 'search', 'person', 'success', options);
        } else {
            dispatch({
                type: FETCH_PERSON_FAILURE,
                payload: result.statusText,
            });
            sendEvent(email, 'search', 'person', 'failed');
        }
    } catch (error) {
        dispatch({ type: FETCH_PERSON_FAILURE, payload: error });
        sendEvent(email, 'search', 'person', 'failed');
    }
};

export const fetchSearchResult = (
    body: Record<string, unknown>,
    cb: () => void, // TODO this is not the correct way to get results. They should be dispatched to store
    email: string
): ThunkResult<void> => async (dispatch) => {
    console.log('fetchSearchResult ', body, 'cb ', cb, 'email ', email);
    dispatch({ type: FETCH_SEARCH_RESULT });
    // getting tokens is allowed to fail as we can send this query
    // without authentication
    try {
        body['authToken'] = await getAuthToken();
        body['idToken'] = (await getIdTokenFromSecureStorage())?.rawToken;
    } catch (error) {
        // ignore
    }

    let isPerson = false;
    let options;
    axios
        .post(`${peopleSearchURL}`, body.requestObject)
        .then((res) => {
            if (res.data.possible_persons) {
                options = createOptions(
                    res.data.possible_persons.length,
                    null,
                    null
                );
                dispatch({
                    type: FETCH_PEOPLE_SUCCESS,
                    payload: res.data.possible_persons,
                });
                sendEvent(email, 'search', 'person', 'success', options);
            } else if (res.data.person) {
                options = createOptions(0, null, null);
                isPerson = true;
                dispatch({
                    type: FETCH_PERSON_SUCCESS,
                    payload: res.data.person,
                });
                sendEvent(email, 'search', 'person', 'success', options);
            } else if (
                res.data.persons_count === 0 ||
                res.data['@persons_count'] === 0
            ) {
                dispatch({
                    type: FETCH_SEARCH_RESULT_FAILURE,
                    data: res.data.query,
                    query: res.data.query,
                    payload: true,
                });
                sendEvent(email, 'search', 'person', 'success', options);
            }
        })
        .then(() => {
            if (isPerson) {
                cb();
            }
        })
        .catch((err) => {
            dispatch({ type: FETCH_SEARCH_RESULT_FAILURE, payload: err });
            sendEvent(email, 'search', 'person', 'failed');
        });
};

export const resetPerson = () => {
    return { type: RESET_PERSON };
};

export const resetState = () => {
    return { type: RESET_STATE };
};

export const sendSearchErrorMessage = (errorObject) => {
    return {
        type: FETCH_SEARCH_RESULT_FAILURE,
        payload: errorObject,
    };
};
