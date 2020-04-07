
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import * as SecureStore from 'expo-secure-store';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { getEnvVars } from '../../../environment';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const { familyConnectionsURL } = getEnvVars();

const httpLink = createHttpLink({
    uri: `${familyConnectionsURL}/graphql`,
});

const authLink: ApolloLink = setContext(async (_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = await SecureStore.getItemAsync('cok_access_token');
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    name: Platform.OS,
    version: `${Constants.nativeBuildVersion}`,
});
