import { getEnvVars } from '../../../environment';
import { GraphQLError } from 'graphql';
import { client } from './apollo';
import { ENGAGEMENTS_QUERY } from './fragments/engagement';
import {
    engagements,
    engagementsVariables,
    engagements_engagements,
} from '../../generated/engagements';

export enum ConnectionDataTypes {
    GET_ENGAGEMENTS_START = 'GET_ENGAGEMENTS_START',
    GET_ENGAGEMENTS_SUCCESS = 'GET_ENGAGEMENTS_SUCCESS',
    GET_ENGAGEMENTS_FAILURE = 'GET_ENGAGEMENTS_FAILURE',
    CLEAR_ENGAGEMENTS = 'CLEAR_ENGAGEMENTS',
    GET_DETAILS_START = 'GET_DETAILS_START',
    GET_DETAILS_SUCCESS = 'GET_DETAILS_SUCCESS',
    GET_DETAILS_FAILURE = 'GET_DOCUMENTS_FAILURE',
    CLEAR_DETAILS = 'CLEAR_DETAILS',
    SET_DETAILS = 'SET_DETAILS',
}

export interface GetCaseEngagementsStartAction {
    type: ConnectionDataTypes.GET_ENGAGEMENTS_START;
}

export interface GetCaseEngagementsSuccessAction {
    type: ConnectionDataTypes.GET_ENGAGEMENTS_SUCCESS;
    engagements: engagements_engagements[];
}

export interface GetCaseEngagementsFailureAction {
    type: ConnectionDataTypes.GET_ENGAGEMENTS_FAILURE;
    error: string;
}

export interface CaseClearEngagementAction {
    type: ConnectionDataTypes.CLEAR_ENGAGEMENTS;
}

export interface GetCaseDetailsStartAction {
    type: ConnectionDataTypes.GET_DETAILS_START;
}

export interface GetCaseDetailsSuccessAction {
    type: ConnectionDataTypes.GET_DETAILS_SUCCESS;
    details: engagements_engagements[];
}

export interface GetCaseDetailsFailureAction {
    type: ConnectionDataTypes.GET_DETAILS_FAILURE;
    error: string;
}

export interface CaseClearDetailsAction {
    type: ConnectionDataTypes.CLEAR_DETAILS;
}

export interface CaseSetDetailsAction {
    type: ConnectionDataTypes.SET_DETAILS;
}

export type ConnectionDataActionTypes =
    | GetCaseEngagementsStartAction
    | GetCaseEngagementsSuccessAction
    | GetCaseEngagementsFailureAction
    | CaseClearEngagementAction
    | GetCaseDetailsStartAction
    | GetCaseDetailsSuccessAction
    | GetCaseDetailsFailureAction
    | CaseClearDetailsAction
    | CaseSetDetailsAction;

export interface CaseEngagementsDispatch {
    (arg0: ConnectionDataActionTypes): void;
}

const { familyConnectionsURL } = getEnvVars();

export const getEngagements = (caseId: number, relationshipId: number) => (
    dispatch: CaseEngagementsDispatch
): void => {
    dispatch({ type: ConnectionDataTypes.GET_ENGAGEMENTS_START });

    client
        .query<engagements, engagementsVariables>({
            query: ENGAGEMENTS_QUERY,
            variables: { caseId: caseId },
        })
        .then(
            (result) => {
                console.log(
                    `Query success: ${JSON.stringify(result, null, 2)}`
                );
                dispatch({
                    type: ConnectionDataTypes.GET_ENGAGEMENTS_SUCCESS,
                    engagements: result.data.engagements.filter(
                        (engagement) =>
                            engagement.relationship?.id === relationshipId
                    ),
                });
            },
            (error: GraphQLError | Error) => {
                console.log(`Query error: ${JSON.stringify(error, null, 2)}`);

                dispatch({
                    type: ConnectionDataTypes.GET_ENGAGEMENTS_FAILURE,
                    error: error.message,
                });
            }
        );
};

export const clearEngagements = () => (
    dispatch: CaseEngagementsDispatch
): void => {
    dispatch({ type: ConnectionDataTypes.CLEAR_ENGAGEMENTS });
};

export const getDetails = (relationshipId: number) => (
    dispatch: CaseEngagementsDispatch
): void => {
    dispatch({ type: ConnectionDataTypes.GET_DETAILS_START });

    client
        .query<engagements, engagementsVariables>({
            query: ENGAGEMENTS_QUERY,
            variables: { caseId: caseId },
        })
        .then(
            (result) => {
                console.log(
                    `Query success: ${JSON.stringify(result, null, 2)}`
                );
                dispatch({
                    type: ConnectionDataTypes.GET_DETAILS_SUCCESS,
                    engagements: result.data.engagements.filter(
                        (engagement) =>
                            engagement.relationship?.id === relationshipId
                    ),
                });
            },
            (error: GraphQLError | Error) => {
                console.log(`Query error: ${JSON.stringify(error, null, 2)}`);

                dispatch({
                    type: ConnectionDataTypes.GET_DETAILS_FAILURE,
                    error: error.message,
                });
            }
        );
};

export const setDetails = (bool) => (dispatch) => {
    dispatch({ type: SET_DETAILS, payload: bool });
};
