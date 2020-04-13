import { client } from './apollo';
import { GraphQLError } from 'graphql';
import {
    relationshipDetailFull,
    relationshipDetailFullVariables,
    relationshipDetailFull_relationship,
} from '../../generated/relationshipDetailFull';
import { RELATIONSHIP_DETAIL_FULL_QUERY } from './fragments/relationship';

export enum RelationshipTypes {
    GET_RELATIONSHIP_START = 'GET_RELATIONSHIP_START',
    GET_RELATIONSHIP_SUCCESS = 'GET_RELATIONSHIP_SUCCESS',
    GET_RELATIONSHIP_FAILURE = 'GET_RELATIONSHIP_FAILURE',
    CLEAR_RELATIONSHIP = 'CLEAR_RELATIONSHIP',
}

export interface RelationshipStartAction {
    type: RelationshipTypes.GET_RELATIONSHIP_START;
}

export interface RelationshipSuccessAction {
    type: RelationshipTypes.GET_RELATIONSHIP_SUCCESS;
    relationship?: relationshipDetailFull_relationship;
}

export interface RelationshipFailureAction {
    type: RelationshipTypes.GET_RELATIONSHIP_FAILURE;
    error: string;
}

export interface RelationshipClearAction {
    type: RelationshipTypes.CLEAR_RELATIONSHIP;
}

export type RelationshipActionTypes =
    | RelationshipStartAction
    | RelationshipSuccessAction
    | RelationshipFailureAction
    | RelationshipClearAction;

export interface RelationshipDispatch {
    (arg0: RelationshipActionTypes): void;
}

export const getRelationship = (caseId: number, relationshipId: number) => (
    dispatch: RelationshipDispatch
): void => {
    dispatch({ type: RelationshipTypes.GET_RELATIONSHIP_START });
    console.log(`Loading relationship ${relationshipId}...`);

    client
        .query<relationshipDetailFull, relationshipDetailFullVariables>({
            query: RELATIONSHIP_DETAIL_FULL_QUERY,
            variables: { caseId: caseId, relationshipId: relationshipId },
        })
        .then(
            (result) => {
                console.log(`Loading relationship ${relationshipId}: success`);
                dispatch({
                    type: RelationshipTypes.GET_RELATIONSHIP_SUCCESS,
                    relationship: result.data.relationship || undefined, // convert from null to undefined if necessary
                });
            },
            (error: GraphQLError | Error) => {
                console.log(
                    `Loading relationship ${relationshipId}: error: ${JSON.stringify(
                        error,
                        null,
                        2
                    )}`
                );

                dispatch({
                    type: RelationshipTypes.GET_RELATIONSHIP_FAILURE,
                    error: error.message,
                });
            }
        );
};

export const clearRelationship = () => (
    dispatch: RelationshipDispatch
): void => {
    dispatch({ type: RelationshipTypes.CLEAR_RELATIONSHIP });
    // TODO actually clear data
};
