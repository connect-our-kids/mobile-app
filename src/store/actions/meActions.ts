import { GraphQLError } from 'graphql';
import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ME_QUERY } from './fragments/me';
import { meQuery } from '../../generated/meQuery';
import { UserFullFragment } from '../../generated/UserFullFragment';
import { ThunkResult } from '../store';
import { getSchema } from './schemaActions';

export enum MeTypes {
    GET_ME_START = 'GET_ME_START',
    GET_ME_SUCCESS = 'GET_ME_SUCCESS',
    GET_ME_FAILURE = 'GET_ME_FAILURE',
    CLEAR_ME = 'CLEAR_ME',
}

export interface GetMeStartAction {
    type: MeTypes.GET_ME_START;
}

export interface GetMeSuccessAction {
    type: MeTypes.GET_ME_SUCCESS;
    me: UserFullFragment;
}

export interface GetMeFailureAction {
    type: MeTypes.GET_ME_FAILURE;
    error: string;
}

export interface ClearMeAction {
    type: MeTypes.CLEAR_ME;
}

export type MeActionTypes =
    | GetMeStartAction
    | GetMeSuccessAction
    | GetMeFailureAction
    | ClearMeAction;

// this action calls the me query which return user information
// about the currently logged in user
export const getMe = (): ThunkResult<void> => (
    dispatch,
    getState,
    { client }: { client: ApolloClient<NormalizedCacheObject> }
) => {
    dispatch({ type: MeTypes.GET_ME_START });
    console.log('Loading me...');

    client
        .query<meQuery>({
            query: ME_QUERY,
        })
        .then(
            (result) => {
                console.log(`Loading me: success`);
                dispatch({
                    type: MeTypes.GET_ME_SUCCESS,
                    me: result.data.me,
                });
                const teamId = result.data.me.userTeam?.team.id;
                if (teamId !== undefined) {
                    dispatch(getSchema(teamId));
                }
            },
            (error: GraphQLError | Error) => {
                console.log(
                    `Loading me: error: ${JSON.stringify(error, null, 2)}`
                );

                dispatch({
                    type: MeTypes.GET_ME_FAILURE,
                    error: error.message,
                });
            }
        );
};

export const clearMe = (): ThunkResult<void> => (dispatch): void => {
    dispatch({ type: MeTypes.CLEAR_ME });
    // TODO actually clear data
};
