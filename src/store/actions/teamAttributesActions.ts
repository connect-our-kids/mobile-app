import { GraphQLError } from 'graphql';
import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { TEAM_ATTRIBUTES_QUERY } from './fragments/teamAttributes';
import { getTeamAttributes } from '../../generated/getTeamAttributes';
import { TeamAttributeDetail } from '../../generated/TeamAttributeDetail';
import { ThunkResult } from '../store';
// import { getSchema } from './schemaActions';

export enum TeamAttributeTypes {
    GET_TEAM_ATTRIBUTES_START = 'GET_TEAM_ATTRIBUTES_START',
    GET_TEAM_ATTRIBUTES_SUCCESS = 'GET_TEAM_ATTRIBUTES_SUCCESS',
    GET_TEAM_ATTRIBUTES_FAILURE = 'GET_TEAM_ATTRIBUTES_FAILURE',
    CLEAR_TEAM_ATTRIBUTES = 'CLEAR_TEAM_ATTRIBUTES',
}

export interface GetTeamAttributesStartAction {
    type: TeamAttributeTypes.GET_TEAM_ATTRIBUTES_START;
}

export interface GetTeamAttributesSuccessAction {
    type: TeamAttributeTypes.GET_TEAM_ATTRIBUTES_SUCCESS;
    attributes: TeamAttributeDetail;
}

export interface GetTeamAttributesFailureAction {
    type: TeamAttributeTypes.GET_TEAM_ATTRIBUTES_FAILURE;
    error: string;
}

export interface ClearTeamAttributesAction {
    type: TeamAttributeTypes.CLEAR_TEAM_ATTRIBUTES;
}

export type TeamAttributesActionTypes =
    | GetTeamAttributesStartAction
    | GetTeamAttributesSuccessAction
    | GetTeamAttributesFailureAction
    | ClearTeamAttributesAction;

// this action calls the teamAttribute query which returns
// the currently logged in user's team's attributes
export const getAttributes = (teamId: number): ThunkResult<void> => (
    dispatch,
    getState,
    { client }: { client: ApolloClient<NormalizedCacheObject> }
) => {
    dispatch({ type: TeamAttributeTypes.GET_TEAM_ATTRIBUTES_START });
    console.log('Loading team attributes...');

    client
        .query<getTeamAttributes>({
            query: TEAM_ATTRIBUTES_QUERY,
            variables: { teamId },
        })
        .then(
            (result) => {
                console.log(`Loading team attributes: success`);
                dispatch({
                    type: TeamAttributeTypes.GET_TEAM_ATTRIBUTES_SUCCESS,
                    attributes: result.data.teamAttributes,
                });
                // result.data.attributes.forEach((team) => {
                //     dispatch(getSchema(team.team.id));
                // });
            },
            (error: GraphQLError | Error) => {
                console.log(
                    `Loading team attributes: error: ${JSON.stringify(
                        error,
                        null,
                        2
                    )}`
                );

                dispatch({
                    type: TeamAttributeTypes.GET_TEAM_ATTRIBUTES_FAILURE,
                    error: error.message,
                });
            }
        );
};

export const clearTeamAttributes = (): ThunkResult<void> => (
    dispatch
): void => {
    dispatch({ type: TeamAttributeTypes.CLEAR_TEAM_ATTRIBUTES });
    // TODO actually clear data
};
