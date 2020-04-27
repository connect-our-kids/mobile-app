import * as SecureStore from 'expo-secure-store';
import moment from 'moment';
import jwtDecode from 'jwt-decode';
import * as AuthSession from 'expo-auth-session';
import { Platform } from 'react-native';
import Axios from 'axios';
import { getEnvVars } from '../../environment';
import Constants from 'expo-constants';
import AuthSessionCustom from './AuthSessionCustom';
import { sendEvent } from './createEvent';

export interface IdToken {
    given_name?: string;
    family_name?: string;
    nickname?: string;
    name?: string;
    picture?: string;
    updated_at: string;
    email: string;
    email_verified: true;
    iss: string;
    sub: string;
    aud: string;
    iat: number;
    exp: number; // Number of seconds from epoch
    nonce?: string;
}

interface AccessToken {
    iss: string;
    sub: string;
    aud: string | string[];
    iat: number;
    exp: number; // Number of seconds from epoch
    azp: string;
    scope: string;
}

const refreshTokenName = 'cok_refresh_token';
const accessTokenName = 'cok_access_token2';
const idTokenName = 'cok_id_token';

const {
    auth0Domain,
    auth0Audience,
    auth0ClientId,
    auth0RedirectScheme,
} = getEnvVars();

/**
 * Get a token from secure storage and parse it. Returns undefined on failure.
 * Does NOT throw.
 * @param tokenName name of the token in secure storage
 */
async function getTokenFromSecureStorage<TokenType extends { exp: number }>(
    tokenName: string
): Promise<
    | {
          rawToken: string;
          decodedToken: TokenType;
          isExpired: boolean;
      }
    | undefined
> {
    try {
        //console.debug(`Retrieving ${tokenName} from secure storage`);
        const token = await SecureStore.getItemAsync(tokenName);
        if (token) {
            //console.debug(`Found ${tokenName}. Decoding it...`);
            const decodedToken = jwtDecode<TokenType>(token);
            if (decodedToken) {
                //console.debug(`Decoded ${tokenName}`);
                //console.debug(JSON.stringify(decodedToken, null, 2));
                const expiresAtUtc = moment.unix(decodedToken.exp).utc();
                const currentTimeUtc = moment.utc();

                if (currentTimeUtc > expiresAtUtc) {
                    console.log(
                        `${tokenName} expired ${moment
                            .duration(expiresAtUtc.diff(currentTimeUtc))
                            .humanize(true)}`
                    );
                    return {
                        rawToken: token,
                        decodedToken,
                        isExpired: true,
                    };
                } else if (currentTimeUtc > expiresAtUtc.subtract(1, 'hour')) {
                    console.log(
                        `${tokenName} expires ${moment
                            .duration(expiresAtUtc.diff(currentTimeUtc))
                            .humanize(true)}. Considering it expired.`
                    );
                    return {
                        rawToken: token,
                        decodedToken,
                        isExpired: true,
                    };
                } else {
                    console.log(
                        `${tokenName} expires ${moment
                            .duration(expiresAtUtc.diff(currentTimeUtc))
                            .humanize(true)}`
                    );
                    return {
                        rawToken: token,
                        decodedToken,
                        isExpired: false,
                    };
                }
            }
        } else {
            console.log(`${tokenName} not found in secure storage`);
        }
    } catch (error) {
        console.log(
            `Error while processing ${tokenName}. Error: ${error.message}`
        );
    }
    return undefined;
}

export async function getAccessTokenFromSecureStorage(): Promise<
    | {
          rawToken: string;
          decodedToken: AccessToken;
          isExpired: boolean;
      }
    | undefined
> {
    return getTokenFromSecureStorage<AccessToken>(accessTokenName);
}

export async function getIdTokenFromSecureStorage(): Promise<
    | {
          rawToken: string;
          decodedToken: IdToken;
          isExpired: boolean;
      }
    | undefined
> {
    return getTokenFromSecureStorage<IdToken>(idTokenName);
}

export async function getRefreshTokenFromSecureStorage(): Promise<
    string | undefined
> {
    const result = await SecureStore.getItemAsync(refreshTokenName);
    return result !== null ? result : undefined;
}

export async function clearAllTokensFromSecureStorage(): Promise<void> {
    await Promise.all([
        SecureStore.deleteItemAsync(accessTokenName),
        SecureStore.deleteItemAsync(refreshTokenName),
        SecureStore.deleteItemAsync(idTokenName),
    ]);
}

export async function storeAllTokensInSecureStorage({
    idToken,
    accessToken,
    refreshToken,
}: {
    idToken: string;
    accessToken: string;
    refreshToken: string;
}): Promise<void> {
    await Promise.all([
        SecureStore.setItemAsync(idTokenName, idToken),
        SecureStore.setItemAsync(accessTokenName, accessToken),
        SecureStore.setItemAsync(refreshTokenName, refreshToken),
    ]);
}

/**
 * Check to see if we are logged in based on tokens
 * stored in Secure Storage. If we have an Id token
 * and refresh token we consider that logged in.
 *
 * Returns decoded id token when logged in and undefined
 * when not.
 */
export async function isLoggedInInternal(): Promise<
    | {
          idTokenDecoded: IdToken;
      }
    | undefined
> {
    const idToken = await getIdTokenFromSecureStorage();
    const refreshToken = await getRefreshTokenFromSecureStorage();
    if (idToken && refreshToken) {
        return { idTokenDecoded: idToken.decodedToken };
    }
    return undefined;
}

export async function logOutInternal(): Promise<{ error?: string }> {
    console.log('Calling logout internal');
    const idTokenResult = await getIdTokenFromSecureStorage();
    const email = idTokenResult?.decodedToken.email;
    await sendEvent(email, 'click', 'logout', 'start');
    try {
        await clearAllTokensFromSecureStorage();
        await sendEvent(email, 'click', 'logout', 'success');
        return {}; // success
    } catch (error) {
        await sendEvent(email, 'click', 'logout', 'failure', error);
        return {
            error: error?.message ?? 'Unknown error',
        };
    }
}
interface RefreshTokenGrantResponse {
    access_token: string;
    id_token: string;
    scope: string;
    expires_in: number;
    token_type: string;
}

const toQueryString = (params: Record<string, string>): string => {
    return (
        '?' +
        Object.entries(params)
            .map(
                ([key, value]) =>
                    `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
            )
            .join('&')
    );
};

/**
 * Refresh access token and return results. This function
 * will NOT throw.
 */
async function refreshAccessTokenInternal(): Promise<
    | {
          rawToken: string;
          decodedToken: AccessToken;
      }
    | undefined
> {
    console.log(`Attempting refresh access token`);
    try {
        const refreshToken = await SecureStore.getItemAsync(refreshTokenName);
        if (!refreshToken) {
            console.log(
                'Refresh token not found in secure storage. Need user to login.'
            );
            return undefined;
        }

        // at this point we have a code and id_token. Use the code to get
        // the access and refresh tokens
        const tokenParams = {
            client_id: auth0ClientId,
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            scope: 'offline_access openid profile email', // retrieve the user's profile
            audience: auth0Audience,
            redirect_uri:
                Platform.OS != 'ios'
                    ? AuthSession.getRedirectUrl()
                    : auth0RedirectScheme,
        };

        //console.log(`Sending refresh access token POST to Auth0`);
        const tokenResponse = await Axios.post<RefreshTokenGrantResponse>(
            `https://${auth0Domain}/oauth/token`,
            tokenParams
        );
        //console.debug('Refresh Token response:');
        //console.debug(JSON.stringify(tokenResponse.data, null, 2));

        // update access and id tokens in Secure Storage
        await SecureStore.setItemAsync(
            accessTokenName,
            tokenResponse.data.access_token
        );

        await SecureStore.setItemAsync(
            idTokenName,
            tokenResponse.data.id_token
        );

        console.log(`Successfully refreshed auth token`);
        return {
            rawToken: tokenResponse.data.access_token,
            decodedToken: jwtDecode<AccessToken>(
                tokenResponse.data.access_token
            ),
        };
    } catch (error) {
        console.log(
            `Error while refreshing access token. Error: ${error?.message}`
        );
    }
    return undefined;
}

/**
 * Returns an Auth token or throws if unsuccessful. If there is not a valid auth token
 * in secure storage this function will attempt to use the refresh token
 * to get a new auth token.
 */
export async function getAuthToken(): Promise<string> {
    // get access token (if it exists and is not expired)
    const accessTokenResult = await getAccessTokenFromSecureStorage();
    // if access token exists and is NOT expired, return it
    if (accessTokenResult && !accessTokenResult.isExpired) {
        return accessTokenResult.rawToken;
    }

    // access token doesn't exist or is expired. Use refresh token to get new one
    const results = await refreshAccessTokenInternal();
    if (results) {
        return results.rawToken;
    }
    throw new Error('Unable to get auth token');
}

interface AuthorizationCodeGrantResponse {
    access_token: string;
    refresh_token: string;
    id_token: string;
    scope: string;
    expires_in: number;
    token_type: string;
}

interface LoginResultSuccess {
    result: 'success';
    idToken: IdToken;
}

interface LoginResultCancelled {
    result: 'cancelled';
}

interface LoginResultError {
    result: 'error';
    error: string;
}

/**
 * Perform OAuth Login using Auth0. Do NOT call this directly. Use
 * the login action in authActions instead.
 *
 * Returns IdToken on success, undefined on user cancel,
 * and string with error message on failure
 */
export async function loginInternal(): Promise<
    LoginResultError | LoginResultCancelled | LoginResultSuccess
> {
    try {
        const authorizeParams = toQueryString({
            client_id: auth0ClientId,
            redirect_uri:
                Platform.OS != 'ios'
                    ? AuthSession.getRedirectUrl()
                    : auth0RedirectScheme,
            audience: auth0Audience,
            response_type: 'code id_token', // id_token will return a JWT token
            scope: 'offline_access openid profile email', // retrieve the user's profile
            device: Constants.deviceName ?? 'Unknown',
            prompt: 'login',
            nonce: Math.random().toString(36), // ideally, this will be a random value
        });

        // TODO only print this if environment is dev/staging
        console.log('Send the following URL to Travis');
        console.log(AuthSession.getRedirectUrl());
        const authUrl = `https://${auth0Domain}/authorize` + authorizeParams;

        // Perform the authentication - AuthSessionCustom creates an authentication session in your browser behind the scenes.
        // This is why after your first login, you only need to hit 'Authorize' in Auth0 and you don't have to type in username/password every time.
        // If you clear Safari cache or other browser cache, you lose this session and will need to fully login with username and password
        const authorizeResponse =
            Platform.OS !== 'ios'
                ? await AuthSession.startAsync({ authUrl: authUrl })
                : await AuthSessionCustom.startAsync({ authUrl: authUrl });

        console.debug('AuthSession Response:');
        console.debug(JSON.stringify(authorizeResponse, null, 2));

        if (authorizeResponse.params?.error) {
            console.debug(
                `Failed to login. Error: ${authorizeResponse?.error_description}`
            );
            return {
                result: 'error',
                error: `${authorizeResponse.params?.error}: ${
                    authorizeResponse.params.error_description ??
                    'Unknown error'
                }`,
            };
        }
        // if user cancels login process, terminate method
        else if (
            authorizeResponse.type === 'dismiss' ||
            authorizeResponse.type === 'cancel'
        ) {
            // user cancelled
            return { result: 'cancelled' };
        } else if (authorizeResponse.type !== 'success') {
            return {
                result: 'error',
                error: `Unknown response code of '${authorizeResponse.type}'`,
            };
        }
        // check shape of data
        else if (
            !authorizeResponse.params.code ||
            !authorizeResponse.params.id_token
        ) {
            // incorrect shape of response
            return {
                result: 'error',
                error: `Response to authorization does not contain code and or id_token`,
            };
        }

        // at this point we have a code and id_token. Use the code to get
        // the access and refresh tokens
        const tokenParams = {
            client_id: auth0ClientId,
            grant_type: 'authorization_code',
            code: authorizeResponse.params.code,
            scope: 'offline_access openid profile email', // retrieve the user's profile
            audience: auth0Audience,
            redirect_uri:
                Platform.OS != 'ios'
                    ? AuthSession.getRedirectUrl()
                    : auth0RedirectScheme,
        };

        console.log(`Sending authorization_code response`);
        const tokenResponse = await Axios.post<AuthorizationCodeGrantResponse>(
            `https://${auth0Domain}/oauth/token`,
            tokenParams
        );
        console.debug('Token response:');
        console.debug(JSON.stringify(tokenResponse.data, null, 2));

        // check shape of data
        if (!tokenResponse.data) {
            // incorrect shape of response
            return {
                result: 'error',
                error: `Response to token request does not contain access_token and/or refresh_token`,
            };
        }

        console.log(authorizeResponse.params.id_token);

        const decodedIdToken = jwtDecode<IdToken>(
            authorizeResponse.params.id_token
        );

        console.log('after decode id token');

        if (decodedIdToken === undefined) {
            return {
                result: 'error',
                error: `Unable to decode id token: ${authorizeResponse.params.id_token}`,
            };
        }

        console.log('before store all token');
        await storeAllTokensInSecureStorage({
            idToken: authorizeResponse.params.id_token,
            accessToken: tokenResponse.data.access_token,
            refreshToken: tokenResponse.data.refresh_token,
        });

        console.log('after store all tokens');
        return { result: 'success', idToken: decodedIdToken };
    } catch (error) {
        console.log('Caught error');
        JSON.stringify(error, null, 2);
        return error.message ?? 'unknown error';
    }
}
