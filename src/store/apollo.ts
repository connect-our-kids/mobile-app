import { ApolloClient } from 'apollo-client';
import {
    InMemoryCache,
    IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { getEnvVars } from '../../environment';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import introspectionResult from '../generated/fragmentTypes';
import { getAuthToken } from '../helpers/auth';
import { onError } from 'apollo-link-error';

const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: introspectionResult,
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
    // TODO ignore authentication errors from local source
    if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
            // TODO log to Sentry
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
        );
    }

    if (networkError) {
        console.log(`[Network error]: ${networkError}`);
    }
});

const authLink: ApolloLink = setContext(async (_, { headers }) => {
    // try {
    // get the authentication token
    const token = await getAuthToken();
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: `Bearer ${token}`,
        },
    };
    //  } catch (error) {
    // throw the same error that the server does so we can handle
    // it in the same way everywhere
    //      console.log('Got error in auth');
    // TODO throw new Unathen();
    //  }
});

const { familyConnectionsURL } = getEnvVars();
const uri = `${familyConnectionsURL}/graphql`;
export const client = new ApolloClient({
    link: errorLink.concat(authLink).concat(createUploadLink({ uri })),
    cache: new InMemoryCache({
        fragmentMatcher,
        cacheRedirects: {
            Query: {
                workpad: (_, { workpadId }, { getCacheKey }) =>
                    getCacheKey({ __typename: 'CaseWorkpad', id: workpadId }),
                case: (_, { caseId }, { getCacheKey }) =>
                    getCacheKey({ __typename: 'Case', id: caseId }),
                relationship: (_, { id }, { getCacheKey }) =>
                    getCacheKey({ __typename: 'Relationship', id }),
            },
        },
    }),
    name: Platform.OS,
    version: `${Constants.nativeBuildVersion}`,
});
