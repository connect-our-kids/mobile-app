import Constants from 'expo-constants';
import qs from 'qs';
import { Linking } from 'expo';
import * as ExpoWebBrowser from 'expo-web-browser';
import assert from 'assert';

const BASE_URL = 'https://auth.expo.io';
let _authLock = false;

function getDefaultReturnUrl() {
    return Linking.makeUrl('expo-auth-session');
}

async function _openWebBrowserAsync(startUrl: string, returnUrl: string) {
    // $FlowIssue: Flow thinks the awaited result can be a promise
    const result = await ExpoWebBrowser.openAuthSessionAsync(
        startUrl,
        returnUrl
    );
    if (result.type === 'cancel' || result.type === 'dismiss') {
        return { type: result.type };
    }
    return result;
}

export function getQueryParams(
    url: string
): { errorCode: string | null; params: { [key: string]: string } } {
    const parts = url.split('#');
    const hash = parts[1];
    const partsWithoutHash = parts[0].split('?');
    const queryString = partsWithoutHash[partsWithoutHash.length - 1];

    // Get query string (?hello=world)
    const parsedSearch = qs.parse(queryString, { parseArrays: false });

    // Pull errorCode off of params
    const errorCode = (parsedSearch.errorCode ?? null) as string | null;
    assert(
        typeof errorCode === 'string' || errorCode === null,
        `The "errorCode" parameter must be a string if specified`
    );
    delete parsedSearch.errorCode;

    // Get hash (#abc=example)
    let parsedHash = {};
    if (parts[1]) {
        parsedHash = qs.parse(hash);
    }

    // Merge search and hash
    const params = {
        ...parsedSearch,
        ...parsedHash,
    };

    return {
        errorCode,
        params,
    };
}

async function startAsync(options: { returnUrl?: string; authUrl: string }) {
    const returnUrl = options.returnUrl || getDefaultReturnUrl();
    const authUrl = options.authUrl;
    // const startUrl = getStartUrl(authUrl, returnUrl);
    const startUrl = authUrl;

    console.log('startUrl', startUrl);

    // Prevent accidentally starting to an empty url
    if (!authUrl) {
        throw new Error(
            'No authUrl provided to AuthSessionCustom.startAsync. An authUrl is required -- it points to the page where the user will be able to sign in.'
        );
    }
    // Prevent multiple sessions from running at the same time, WebBrowser doesn't
    // support it this makes the behavior predictable.
    if (_authLock) {
        if (__DEV__) {
            console.warn(
                'Attempted to call AuthSessionCustom.startAsync multiple times while already active. Only one AuthSessionCustom can be active at any given time.'
            );
        }
        return { type: 'locked' };
    }
    // About to start session, set lock
    _authLock = true;
    let result;
    try {
        result = await _openWebBrowserAsync(startUrl, returnUrl);
    } finally {
        // WebBrowser session complete, unset lock
        _authLock = false;
    }

    // Handle failures
    if (!result) {
        throw new Error('Unexpected missing AuthSession result');
    }

    // do a type check for url field
    const hasUrl = (input: unknown): input is { url: string } => {
        return !!input && !!(input as { url: string }).url;
    };

    if (!hasUrl(result)) {
        if (result.type) {
            return result;
        } else {
            throw new Error('Unexpected AuthSession result with missing type');
        }
    }
    const { params, errorCode } = getQueryParams(result.url);
    return {
        type: errorCode ? 'error' : 'success',
        params,
        errorCode,
        url: result.url,
    };
}
function dismiss() {
    ExpoWebBrowser.dismissAuthSession();
}

function _warnIfAnonymous(id: string, url: string) {
    if (id.startsWith('@anonymous/')) {
        console.warn(
            `You are not currently signed in to Expo on your development machine. As a result, the redirect URL for AuthSession will be "${url}". If you are using an OAuth provider that requires whitelisting redirect URLs, we recommend that you do not whitelist this URL -- instead, you should sign in to Expo to acquired a unique redirect URL. Additionally, if you do decide to publish this app using Expo, you will need to register an account to do it.`
        );
    }
}

function getRedirectUrl() {
    const redirectUrl = `${BASE_URL}/${Constants.manifest.id}`;
    if (__DEV__) {
        _warnIfAnonymous(Constants.manifest.id, redirectUrl);
    }
    return redirectUrl;
}

function getStartUrl(authUrl: string, returnUrl: string) {
    const queryString = qs.stringify({
        authUrl,
        returnUrl,
    });
    return `${getRedirectUrl()}/start?${queryString}`;
}

export default {
    dismiss,
    getRedirectUrl,
    getStartUrl,
    getDefaultReturnUrl,
    startAsync,
};
