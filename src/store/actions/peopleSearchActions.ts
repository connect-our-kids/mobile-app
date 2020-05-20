import axios from 'axios';
import { getEnvVars } from '../../../environment';
import { sendEvent, createOptions } from '../../helpers/createEvent';
import { getAuthToken, getIdTokenFromSecureStorage } from '../../helpers/auth';
import { ThunkResult } from '../store';

const { peopleSearchURL } = getEnvVars();

export enum PeopleSearchTypes {
    FETCH_PERSON = 'FETCH_PERSON',
    FETCH_PERSON_FAILURE = 'FETCH_PERSON_FAILURE',
    FETCH_PERSON_SUCCESS = 'FETCH_PERSON_SUCCESS',
    FETCH_SEARCH_RESULT = 'FETCH_SEARCH_RESULT',
    FETCH_SEARCH_RESULT_FAILURE = 'FETCH_SEARCH_RESULT_FAILURE',
    FETCH_PEOPLE_SUCCESS = 'FETCH_PEOPLE_SUCCESS',
    RESET_PERSON = 'RESET_PERSON',
    RESET_STATE = 'RESET_STATE',
}

export interface PeopleSearchPointerStartAction {
    type: PeopleSearchTypes.FETCH_PERSON;
}

export interface PeopleSearchPointerSuccessAction {
    type: PeopleSearchTypes.FETCH_PERSON_SUCCESS;
    person: Record<string, unknown>;
}

export interface PeopleSearchPointerFailureAction {
    type: PeopleSearchTypes.FETCH_PERSON_FAILURE;
    error: string;
}

export interface PeopleSearchGeneralStartAction {
    type: PeopleSearchTypes.FETCH_SEARCH_RESULT;
}

export interface PeopleSearchGeneralSuccessAction {
    type: PeopleSearchTypes.FETCH_PEOPLE_SUCCESS;
    result: Record<string, never>[];
}

export interface PeopleSearchGeneralFailureAction {
    type: PeopleSearchTypes.FETCH_SEARCH_RESULT_FAILURE;
    error: string;
}

export interface PeopleSearchResetPersonAction {
    type: PeopleSearchTypes.RESET_PERSON;
}

export interface PeopleSearchResetStateAction {
    type: PeopleSearchTypes.RESET_STATE;
}

export type PeopleSearchActionTypes =
    | PeopleSearchPointerStartAction
    | PeopleSearchPointerSuccessAction
    | PeopleSearchPointerFailureAction
    | PeopleSearchGeneralStartAction
    | PeopleSearchGeneralSuccessAction
    | PeopleSearchGeneralFailureAction
    | PeopleSearchResetPersonAction
    | PeopleSearchResetStateAction;

export interface PeopleSearchDispatch {
    (arg0: PeopleSearchActionTypes): void;
}

export const pointerSearch = (
    body: Record<string, unknown>
): ThunkResult<void> => async (dispatch: PeopleSearchDispatch, getState) => {
    dispatch({ type: PeopleSearchTypes.FETCH_PERSON });
    console.log(`Running people search...`);

    const email = getState().me.results?.email ?? getState().auth.user?.email;
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
                type: PeopleSearchTypes.FETCH_PERSON_SUCCESS,
                person: result.data.person,
            });
            sendEvent(email, 'search', 'person', 'success');
        } else {
            dispatch({
                type: PeopleSearchTypes.FETCH_PERSON_FAILURE,
                error: result.statusText ?? 'Unknown error',
            });
            sendEvent(email, 'search', 'person', 'failed');
        }
    } catch (error) {
        dispatch({
            type: PeopleSearchTypes.FETCH_PERSON_FAILURE,
            error: error?.message ?? 'Unknown error',
        });
        sendEvent(email, 'search', 'person', 'failed');
    }
};

export const generalSearch = (
    body: Record<string, unknown>,
    cb: () => void = () => {
        return;
    } // TODO this is not the correct way to get results. They should be dispatched to store
): ThunkResult<void> => async (dispatch: PeopleSearchDispatch, getState) => {
    dispatch({ type: PeopleSearchTypes.FETCH_SEARCH_RESULT });

    const email = getState().me.results?.email ?? getState().auth.user?.email;

    // getting tokens is allowed to fail as we can send this query
    // without authentication
    try {
        body['authToken'] = await getAuthToken();
        body['idToken'] = (await getIdTokenFromSecureStorage())?.rawToken;
    } catch (error) {
        // ignore
    }

    let isPerson = false;
    axios
        .post(`${peopleSearchURL}`, body)
        .then((res) => {
            if (res.data.possible_persons) {
                const options = createOptions(
                    res.data.possible_persons.length,
                    null,
                    null
                );
                dispatch({
                    type: PeopleSearchTypes.FETCH_PEOPLE_SUCCESS,
                    result: res.data.possible_persons,
                });
                sendEvent(email, 'search', 'person', 'success', options);
            } else if (res.data.person) {
                const options = createOptions(0, null, null);
                isPerson = true;
                dispatch({
                    type: PeopleSearchTypes.FETCH_PERSON_SUCCESS,
                    person: res.data.person,
                });
                sendEvent(email, 'search', 'person', 'success', options);
            } else if (
                res.data.persons_count === 0 ||
                res.data['@persons_count'] === 0
            ) {
                dispatch({
                    type: PeopleSearchTypes.FETCH_SEARCH_RESULT_FAILURE,
                    error: res.data ?? 'Unknown error',
                });
                sendEvent(email, 'search', 'person', 'failure');
            }
        })
        .then(() => {
            if (isPerson) {
                cb();
            }
        })
        .catch((err) => {
            dispatch({
                type: PeopleSearchTypes.FETCH_SEARCH_RESULT_FAILURE,
                error: err?.message ?? 'Unknown error',
            });
            sendEvent(email, 'search', 'person', 'failed');
        });
};

export const resetPerson = () => {
    return { type: PeopleSearchTypes.RESET_PERSON };
};

export const resetState = () => {
    return { type: PeopleSearchTypes.RESET_STATE };
};

export const sendSearchErrorMessage = (errorObject: unknown) => {
    return {
        type: PeopleSearchTypes.FETCH_SEARCH_RESULT_FAILURE,
        payload: errorObject,
    };
};
