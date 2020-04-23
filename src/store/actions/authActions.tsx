import { RootState } from '../reducers';
import {
    IdToken,
    loginInternal,
    isLoggedInInternal,
    logOutInternal,
} from '../../helpers/auth';
import { ThunkResult } from '../store';

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

export interface AuthDispatch {
    (arg0: AuthActionTypes): void;
}

export const logout = (): ThunkResult<void> => async (
    dispatch: AuthDispatch,
    getState: () => RootState
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
    getState: () => RootState
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
            break;
    }
};

export const clearLoginError = () => (dispatch: AuthDispatch) => {
    dispatch({
        type: AuthTypes.CLEAR_LOGIN_ERROR,
    });
};

/**
 * Initializes the redux store with auth data from SecureStorage
 */
/*
export const initializeAuth = () => async (dispatch: AuthDispatch) => {
    console.log(`Initializing auth`);

    dispatch({
        type: AuthTypes.LOGIN_START,
    });

    try {
        console.log(`Initializing auth2`);
        const idToken = await getIdTokenFromSecureStorage();
        const accessToken = await getAccessTokenFromSecureStorage();
        const refreshToken = await getRefreshTokenFromSecureStorage();

        if (idToken && refreshToken) {
            if (accessToken && !accessToken.isExpired) {
                // everything is good. No need to hit the internet
                dispatch({
                    type: AuthTypes.LOGIN_SUCCESS,
                    user: idToken.decodedToken,
                });
                return;
            } else {
                // attempt to refresh our access token
                const refreshTokenResponse = await refreshAccessToken();
                console.log(`Initializing auth - success`);
                if (refreshTokenResponse) {
                    // auth is good. return success
                    dispatch({
                        type: AuthTypes.LOGIN_SUCCESS,
                        user: idToken.decodedToken,
                    });
                    return;
                }
            }
        }
    } catch (error) {
        console.debug(`Error initializing auth. Error: ${error.message}`);
        console.debug(JSON.stringify(error, null, 2));
    }
    console.log(`Initializing auth - fail`);
    dispatch({
        type: AuthTypes.LOGIN_FAILURE,
    });
};

/*
export const authChecker = () => (dispatch: AuthDispatch) => {
    SecureStore.getItemAsync(accessTokenName)
        .then((res) => {
            if (res) {
                dispatch({ type: AuthTypes.SET_ACCESS_TOKEN, payload: res });
                SecureStore.getItemAsync(idTokenName).then((res) => {
                    if (res) {
                        const decodedIdToken = jwtDecode(res);
                        dispatch({
                            type: AuthTypes.SET_ID_TOKEN,
                            payload: decodedIdToken,
                        });
                        dispatch({
                            type: AuthTypes.SET_LOGGED_IN_STATUS,
                            payload: true,
                        });
                    } else {
                        dispatch({
                            type: AuthTypes.SET_LOGGED_IN_STATUS,
                            payload: false,
                        });
                    }
                });
            } else {
                dispatch({
                    type: AuthTypes.SET_LOGGED_IN_STATUS,
                    payload: false,
                });
            }
        })
        .catch((err) => console.log(err));
};
 */

// Sign Up Modal Sequence Actions
export const setModalVisible = (visible: boolean) => (
    dispatch: AuthDispatch
) => {
    dispatch({ type: AuthTypes.SET_MODAL_VISIBLE, visible });
};

export const setAgreeModalVisible = (visible: boolean) => (
    dispatch: AuthDispatch
) => {
    console.log(`Set agree modal visible = ${visible}`);
    dispatch({ type: AuthTypes.SET_VIDEO_AGREE_VISIBLE, visible });
};

export const setVideoPlayerModalVisible = (visible: boolean) => (
    dispatch: AuthDispatch
) => {
    dispatch({ type: AuthTypes.SET_VIDEO_PLAYER_VISIBLE, visible });
};
