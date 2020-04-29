import {
    IdToken,
    loginInternal,
    isLoggedInInternal,
    logOutInternal,
} from '../../helpers/auth';
import { ThunkResult } from '../store';
import { clearUserCases } from './casesActions';
import { getMe, clearMe } from './meActions';
import { clearCase } from './caseAction';
import { clearSchema } from './schemaActions';
import { clearRelationship } from './relationshipAction';
import * as Sentry from 'sentry-expo';

export enum AuthTypes {
    LOG_OUT_START = 'LOG_OUT_START',
    LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS',
    LOG_OUT_FAILURE = 'LOG_OUT_FAILURE',
    LOGIN_START = 'LOGIN_START',
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',
    LOGIN_FAILURE = 'LOGIN_FAILURE',
    CLEAR_LOGIN_ERROR = 'CLEAR_LOGIN_ERROR',
    SET_MODAL_VISIBLE = 'SET_MODAL_VISIBLE', // TODO move to local state in component
    SET_VIDEO_AGREE_VISIBLE = 'SET_VIDEO_AGREE_VISIBLE', // TODO move to local state in component
    SET_VIDEO_PLAYER_VISIBLE = 'SET_VIDEO_PLAYER_VISIBLE', // TODO move to local state in component
}

export interface AuthLogOutStartAction {
    type: AuthTypes.LOG_OUT_START;
}

export interface AuthLogOutSuccessAction {
    type: AuthTypes.LOG_OUT_SUCCESS;
}

export interface AuthLogOutFailureAction {
    type: AuthTypes.LOG_OUT_FAILURE;
    error: string;
}

export interface AuthLoginStartAction {
    type: AuthTypes.LOGIN_START;
}

export interface AuthLoginSuccessAction {
    type: AuthTypes.LOGIN_SUCCESS;
    user: IdToken;
}

export interface AuthLoginFailureAction {
    type: AuthTypes.LOGIN_FAILURE;
    /**
     * when user cancels we do not set an error
     */
    error?: string;
}

export interface ClearLoginErrorAction {
    type: AuthTypes.CLEAR_LOGIN_ERROR;
}

// TODO move to local state
export interface AuthSetModalVisibleAction {
    type: AuthTypes.SET_MODAL_VISIBLE;
    visible: boolean;
}

// TODO move to local state
export interface AuthSetVideoAgreeVisibleAction {
    type: AuthTypes.SET_VIDEO_AGREE_VISIBLE;
    visible: boolean;
}

// TODO move to local state
export interface AuthSetVideoPlayerVisibleAction {
    type: AuthTypes.SET_VIDEO_PLAYER_VISIBLE;
    visible: boolean;
}

export type AuthActionTypes =
    | AuthLogOutStartAction
    | AuthLogOutSuccessAction
    | AuthLogOutFailureAction
    | AuthLoginStartAction
    | AuthLoginSuccessAction
    | AuthLoginFailureAction
    | ClearLoginErrorAction
    | AuthSetModalVisibleAction // TODO move to local state
    | AuthSetVideoAgreeVisibleAction // TODO move to local state
    | AuthSetVideoPlayerVisibleAction; // TODO move to local state

export const logout = (): ThunkResult<void> => async (
    dispatch,
    getState,
    { client }
) => {
    console.log(`Logout requested`);
    const currentState = getState();
    if (currentState.auth.isLoggingOut) {
        console.log(`Logout already in process. Ignoring`);
        return;
    }
    if (currentState.auth.isLoggingIn) {
        console.log(`Login in process. Ignoring`);
        return;
    }

    if (!currentState.auth.isLoggedIn) {
        console.log(`Already logged out. Ignoring`);
        return;
    }

    dispatch({
        type: AuthTypes.LOG_OUT_START,
    });
    const logOutResult = await logOutInternal();
    // clear all cache in Apollo
    const result = await client.clearStore();
    console.log(`Clear Apollo store result: ${result}`);
    dispatch(clearCase());
    dispatch(clearUserCases());
    dispatch(clearMe());
    dispatch(clearSchema());
    dispatch(clearRelationship());
    // TODO clear the family connections navigator stack so we start
    // at the cases view

    // clear user info from sentry
    Sentry.configureScope((scope) => scope.setUser(null));

    if (logOutResult.error) {
        console.log(`Failed to log out. Error: ${logOutResult.error}`);
        dispatch({
            type: AuthTypes.LOG_OUT_FAILURE,
            error: logOutResult.error,
        });
    } else {
        dispatch({
            type: AuthTypes.LOG_OUT_SUCCESS,
        });
    }
};

/**
 * Perform OAuth Login using Auth0.
 * @param refreshOnly Do not show user login screen. Only try to refresh the tokens.
 */
export const login = (refreshOnly = false): ThunkResult<void> => async (
    dispatch,
    getState
) => {
    console.log(`${refreshOnly ? 'Refresh' : 'Full'} login requested...`);

    // If there is a current login operation in process do nothing
    const currentState = getState();
    if (currentState.auth.isLoggingIn) {
        console.log(`Login already in process. Ignoring`);
        return;
    }

    if (currentState.auth.isLoggingOut) {
        console.log(`Logout in process. Ignoring`);
        return;
    }

    // If the current token is not expired do nothing
    if (currentState.auth.isLoggedIn) {
        console.log(`Already logged in. Ignoring`);
        return;
    }

    dispatch({
        type: AuthTypes.LOGIN_START,
    });

    const isLoggedIn = await isLoggedInInternal();
    if (isLoggedIn) {
        // everything is good. No need to hit the internet
        console.log(
            `Found existing id and refresh tokens in Secure Storage. Done`
        );
        dispatch({
            type: AuthTypes.LOGIN_SUCCESS,
            user: isLoggedIn.idTokenDecoded,
        });
        // add user info to sentry
        Sentry.configureScope(function (scope) {
            scope.setUser({
                email: isLoggedIn.idTokenDecoded.email,
                id: isLoggedIn.idTokenDecoded.sub,
                username: isLoggedIn.idTokenDecoded.name,
            });
        });
        dispatch(getMe());
        return;
    }

    if (refreshOnly) {
        // user only requested a refresh
        dispatch({
            type: AuthTypes.LOGIN_FAILURE,
        });
        return;
    }

    // if no refresh_token exists, then this is a first time and we need to perform initial /authorize endpoint
    const loginResult = await loginInternal();
    console.log('Login result: ');
    console.log(JSON.stringify(loginResult, null, 2));

    switch (loginResult.result) {
        case 'cancelled':
            console.log(`Login cancelled by user`);
            dispatch({
                type: AuthTypes.LOGIN_FAILURE,
            });
            break;
        case 'error':
            console.log(`Login failed. Error: ${loginResult.error}`);
            dispatch({
                type: AuthTypes.LOGIN_FAILURE,
                error: loginResult.error,
            });
            break;
        case 'success':
            console.log(`Successfully logged in`);

            dispatch({
                type: AuthTypes.LOGIN_SUCCESS,
                user: loginResult.idToken,
            });

            // add user info to sentry
            Sentry.configureScope(function (scope) {
                scope.setUser({
                    email: loginResult.idToken.email,
                    id: loginResult.idToken.sub,
                    username: loginResult.idToken.name,
                });
            });
            dispatch(getMe());
            break;
    }
};

export const clearLoginError = (): ThunkResult<void> => (dispatch) => {
    dispatch({
        type: AuthTypes.CLEAR_LOGIN_ERROR,
    });
};

// Sign Up Modal Sequence Actions
export const setModalVisible = (visible: boolean): ThunkResult<void> => (
    dispatch
) => {
    dispatch({ type: AuthTypes.SET_MODAL_VISIBLE, visible });
};

export const setAgreeModalVisible = (visible: boolean): ThunkResult<void> => (
    dispatch
) => {
    console.log(`Set agree modal visible = ${visible}`);
    dispatch({ type: AuthTypes.SET_VIDEO_AGREE_VISIBLE, visible });
};

export const setVideoPlayerModalVisible = (
    visible: boolean
): ThunkResult<void> => (dispatch) => {
    dispatch({ type: AuthTypes.SET_VIDEO_PLAYER_VISIBLE, visible });
};
