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

const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: introspectionResult,
});

const authLink: ApolloLink = setContext(async (_, { headers }) => {
    try {
        // get the authentication token
        const token = await getAuthToken();
        // return the headers to the context so httpLink can read them
        return {
            headers: {
                ...headers,
                authorization: `Bearer ${token}`,
            },
        };
    } catch (error) {
        // throw the same error that the server does so we can handle
        // it in the same way everywhere
        // TODO throw new Unathen();
    }
});

const { familyConnectionsURL } = getEnvVars();
const uri = `${familyConnectionsURL}/graphql`;
export const client = new ApolloClient({
    link: authLink.concat(createUploadLink({ uri })),
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
