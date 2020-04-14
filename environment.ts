/*****************************
 * environment.ts
 * path: '/environment.ts' (root of your project)
 ******************************/

// Be sure to add any new environment variables here! Import them for your Redux Actions.

import Constants from 'expo-constants';

export interface EnvConfig {
    auth0Domain: string;
    auth0ClientId: string;
    auth0Audience: string;
    familyConnectionsURL: string;
    auth0RedirectScheme: string;
    peopleSearchURL: string;
    eventTrackingURL: string;
}

const ENV: { dev: EnvConfig; staging: EnvConfig; prod: EnvConfig } = {
    dev: {
        auth0Domain: 'login.connectourkids.org',
        auth0ClientId: '3dKTXilDyoCV3YP06e90059KI6bPERYQ',
        auth0Audience: 'https://api-staging.connectourkids.org/',
        familyConnectionsURL: 'https://family-staging.connectourkids.org',
        auth0RedirectScheme: 'exp://127.0.0.1:19000/--/expo-auth-session',
        peopleSearchURL: 'https://dev.search.connectourkids.org/api/search-v2',
        eventTrackingURL: 'https://dev.search.connectourkids.org/api/sendEvent',
    },
    staging: {
        auth0Domain: 'login.connectourkids.org',
        auth0ClientId: '3dKTXilDyoCV3YP06e90059KI6bPERYQ',
        auth0Audience: 'https://api-staging.connectourkids.org/',
        familyConnectionsURL: 'https://family-staging.connectourkids.org',
        auth0RedirectScheme: 'exp://127.0.0.1:19000/--/expo-auth-session',
        peopleSearchURL: 'https://dev.search.connectourkids.org/api/search-v2',
        eventTrackingURL: 'https://dev.search.connectourkids.org/api/sendEvent',
    },
    prod: {
        auth0Domain: 'login.connectourkids.org',
        auth0ClientId: 'QzXVCpRPy4m6IOPpm6Jl644nQIvpTknR',
        auth0Audience: 'https://api.connectourkids.org/',
        auth0RedirectScheme:
            'connectourkids://127.0.0.1:19000/--/expo-auth-session',
        familyConnectionsURL: 'https://family.connectourkids.org',
        peopleSearchURL: 'https://search.connectourkids.org/api/search-v2',
        eventTrackingURL: 'https://search.connectourkids.org/api/sendEvent',
    },
};

export function getEnvVars(env = Constants.manifest.releaseChannel): EnvConfig {
    // This variable is set to true when react-native is running in Dev mode.
    // __DEV__ is true when run locally, but false when published.

    if (__DEV__ || env === 'dev') {
        return ENV.dev;
    } else if (env === 'staging') {
        return ENV.staging;
    } else if (env === 'default' || env === 'prod') {
        return ENV.prod;
    } else {
        console.warn(
            `Invalid environment config: '${env}'. Using production configuration`
        );
        return ENV.prod;
    }
}
