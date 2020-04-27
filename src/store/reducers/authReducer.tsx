import { AuthTypes, AuthActionTypes } from '../actions';
import { IdToken } from '../../helpers/auth';

export interface AuthState {
    isLoggedIn: boolean;
    isLoggingIn: boolean;
    loginError?: string;
    user?: IdToken;
    isLoggingOut: boolean;
    logoutError?: string;
    modalVisible: boolean; // TODO move to local storage
    videoAgree: boolean; // TODO move to local storage
    videoVisible: boolean; // TODO move to local storage
}

const initialState: AuthState = {
    isLoggedIn: false,
    isLoggingIn: false,
    isLoggingOut: false,
    modalVisible: false,
    videoAgree: false,
    videoVisible: false,
};

export const authReducer = (
    state = initialState,
    action: AuthActionTypes
): AuthState => {
    switch (action.type) {
        case AuthTypes.LOGIN_START:
            return {
                ...state,
                isLoggingIn: true,
            };
        case AuthTypes.LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                isLoggingIn: false,
                loginError: undefined,
                user: action.user,
            };
        case AuthTypes.LOGIN_FAILURE:
            return {
                ...state,
                isLoggedIn: false,
                isLoggingIn: false,
                loginError: action.error,
            };
        case AuthTypes.CLEAR_LOGIN_ERROR:
            return {
                ...state,
                loginError: undefined,
            };
        case AuthTypes.LOG_OUT_START:
            return {
                ...state,
                isLoggingOut: true,
            };
        case AuthTypes.LOG_OUT_SUCCESS:
            return {
                ...state,
                isLoggingOut: false,
                isLoggedIn: false,
                loginError: undefined,
                logoutError: undefined,
                user: undefined,
            };
        case AuthTypes.LOG_OUT_FAILURE:
            return {
                ...state,
                isLoggingOut: false,
                logoutError: action.error,
            };
        // TODO move to local state
        case AuthTypes.SET_MODAL_VISIBLE:
            return {
                ...state,
                modalVisible: action.visible,
                videoAgree: false,
                videoVisible: false,
            };
        // TODO move to local state
        case AuthTypes.SET_VIDEO_AGREE_VISIBLE:
            return {
                ...state,
                videoAgree: action.visible,
            };
        // TODO move to local state
        case AuthTypes.SET_VIDEO_PLAYER_VISIBLE:
            return {
                ...state,
                videoAgree: false,
                videoVisible: action.visible,
            };
        default:
            return state;
    }
};
