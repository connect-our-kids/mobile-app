import { STATIC_DATA_QUERY } from './fragments/schema';
import { GraphQLError } from 'graphql';
import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import {
    staticDataQuery,
    staticDataQueryVariables,
} from '../../generated/staticDataQuery';
import { ThunkResult } from '../store';

export enum SchemaTypes {
    GET_SCHEMA_START = 'GET_SCHEMA_START',
    GET_SCHEMA_SUCCESS = 'GET_SCHEMA_SUCCESS',
    GET_SCHEMA_FAILURE = 'GET_SCHEMA_FAILURE',
    CLEAR_SCHEMA = 'CLEAR_SCHEMA',
}

export interface GetSchemaStartAction {
    type: SchemaTypes.GET_SCHEMA_START;
}

export interface GetSchemaSuccessAction {
    type: SchemaTypes.GET_SCHEMA_SUCCESS;
    schema: staticDataQuery;
}

export interface GetSchemaFailureAction {
    type: SchemaTypes.GET_SCHEMA_FAILURE;
    error: string;
}

export interface ClearSchemaAction {
    type: SchemaTypes.CLEAR_SCHEMA;
}

export type SchemaActionTypes =
    | GetSchemaStartAction
    | GetSchemaSuccessAction
    | GetSchemaFailureAction
    | ClearSchemaAction;

interface SchemaDispatch {
    (arg0: SchemaActionTypes): void;
}

// this action grabs all schema for a specified user
export const getSchema = (teamId: number): ThunkResult<void> => (
    dispatch: SchemaDispatch,
    getState,
    { client }: { client: ApolloClient<NormalizedCacheObject> }
) => {
    dispatch({ type: SchemaTypes.GET_SCHEMA_START });
    console.log('Loading schema...');

    client
        .query<staticDataQuery, staticDataQueryVariables>({
            query: STATIC_DATA_QUERY,
            variables: { teamId },
        })
        .then(
            (result) => {
                console.log(`Loading schema: success`);
                dispatch({
                    type: SchemaTypes.GET_SCHEMA_SUCCESS,
                    schema: result.data,
                });
            },
            (error: GraphQLError | Error) => {
                console.log(
                    `Loading schema: error: ${JSON.stringify(error, null, 2)}`
                );

                dispatch({
                    type: SchemaTypes.GET_SCHEMA_FAILURE,
                    error: error.message,
                });
            }
        );
};

export const clearSchema = (): ThunkResult<void> => (
    dispatch: SchemaDispatch
): void => {
    dispatch({ type: SchemaTypes.CLEAR_SCHEMA });
    // TODO actually clear data
};
