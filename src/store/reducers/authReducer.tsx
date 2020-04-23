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
            console.log(`Login start`);
            return {
                ...state,
                isLoggingIn: true,
            };
        case AuthTypes.LOGIN_SUCCESS:
            console.log(`Login success`);
            return {
                ...state,
                isLoggedIn: true,
                isLoggingIn: false,
                loginError: undefined,
                user: action.user,
            };
        case AuthTypes.LOGIN_FAILURE:
            console.log(`Login failure`);
            return {
                ...state,
                isLoggedIn: false,
                isLoggingIn: false,
                loginError: action.error,
            };
        case AuthTypes.CLEAR_LOGIN_ERROR:
            console.log(`Clear login error`);
            return {
                ...state,
                loginError: undefined,
            };
        case AuthTypes.LOG_OUT_START:
            console.log(`logout start`);
            return {
                ...state,
                isLoggingOut: true,
            };
        case AuthTypes.LOG_OUT_SUCCESS:
            console.log(`logout success`);
            return {
                ...state,
                isLoggingOut: false,
                isLoggedIn: false,
                loginError: undefined,
                logoutError: undefined,
                user: undefined,
            };
        case AuthTypes.LOG_OUT_FAILURE:
            console.log(`Logout failure`);
            return {
                ...state,
                isLoggingOut: false,
                logoutError: action.error,
            };
        // TODO move to local state
        case AuthTypes.SET_MODAL_VISIBLE:
            console.log(`set modal visible`);
            return {
                ...state,
                modalVisible: action.visible,
                videoAgree: false,
                videoVisible: false,
            };
        // TODO move to local state
        case AuthTypes.SET_VIDEO_AGREE_VISIBLE:
            console.log(`set video agree visible`);
            return {
                ...state,
                videoAgree: action.visible,
            };
        // TODO move to local state
        case AuthTypes.SET_VIDEO_PLAYER_VISIBLE:
            console.log(`set video player visible`);
            return {
                ...state,
                videoAgree: false,
                videoVisible: action.visible,
            };
        default:
            console.log('authreducer default');
            return state;
    }
};
