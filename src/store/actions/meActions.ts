import { GraphQLError } from 'graphql';
import { RootState } from '../reducers';
import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ME_QUERY } from './fragments/me';
import { meQuery } from '../../generated/meQuery';
import { UserFullFragment } from '../../generated/UserFullFragment';

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

interface MeDispatch {
    (arg0: MeActionTypes): void;
}

// this action grabs all Me for a specified user
export const getMe = () => (
    dispatch: MeDispatch,
    getState: () => RootState,
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

export const clearMe = () => (dispatch: MeDispatch): void => {
    dispatch({ type: MeTypes.CLEAR_ME });
    // TODO actually clear data
};
