import { client } from './apollo';
import { CASE_DETAIL_FULL_QUERY } from './fragments/cases';
import { GraphQLError } from 'graphql';
import {
    caseDetailFull,
    caseDetailFullVariables,
} from '../../generated/caseDetailFull';
import { CREATE_DOC_ENGAGEMENT_MUTATION } from './fragments/engagement';
import {
    createEngagementDocumentMutation,
    createEngagementDocumentMutationVariables,
} from '../../generated/createEngagementDocumentMutation';
import { CreateEngagementDocument } from '../../generated/globalTypes';

export enum CaseTypes {
    GET_CASE_START,
    GET_CASE_SUCCESS,
    GET_CASE_FAILURE,
    CLEAR_CASE,
    CREATE_DOC_ENGAGEMENT,
    CREATE_DOC_ENGAGEMENT_SUCCESS,
    CREATE_DOC_ENGAGEMENT_FAILURE,
}

export interface CaseStartAction {
    type: CaseTypes.GET_CASE_START;
}

export interface CaseSuccessAction {
    type: CaseTypes.GET_CASE_SUCCESS;
    case: caseDetailFull;
}

export interface CaseFailureAction {
    type: CaseTypes.GET_CASE_FAILURE;
    error: string;
}

export interface CaseClearAction {
    type: CaseTypes.CLEAR_CASE;
}

export interface CreateDocEngagementAction {
    type: CaseTypes.CREATE_DOC_ENGAGEMENT;
}

export interface CreateDocEngagementSuccessAction {
    type: CaseTypes.CREATE_DOC_ENGAGEMENT_SUCCESS;
}

export interface CreateDocEngagementFailureAction {
    type: CaseTypes.CREATE_DOC_ENGAGEMENT_FAILURE;
    error: string;
}

export type CaseActionTypes =
    | CaseStartAction
    | CaseSuccessAction
    | CaseFailureAction
    | CaseClearAction
    | CreateDocEngagementAction
    | CreateDocEngagementSuccessAction
    | CreateDocEngagementFailureAction;

export interface CaseDispatch {
    (arg0: CaseActionTypes): void;
}

export const getCase = (caseId: number) => (dispatch: CaseDispatch): void => {
    dispatch({ type: CaseTypes.GET_CASE_START });
    console.log(`Loading case ${caseId}...`);

    client
        .query<caseDetailFull, caseDetailFullVariables>({
            query: CASE_DETAIL_FULL_QUERY,
            variables: { caseId: caseId },
        })
        .then(
            (result) => {
                console.log(`Loading case ${caseId}: success`);
                dispatch({
                    type: CaseTypes.GET_CASE_SUCCESS,
                    case: result.data,
                });
            },
            (error: GraphQLError | Error) => {
                console.log(
                    `Loading case ${caseId}: error: ${JSON.stringify(
                        error,
                        null,
                        2
                    )}`
                );

                dispatch({
                    type: CaseTypes.GET_CASE_FAILURE,
                    error: error.message,
                });
            }
        );
};

export const clearCase = () => (dispatch: CaseDispatch): void => {
    dispatch({ type: CaseTypes.CLEAR_CASE });
    // TODO actually clear data
};

export const createDocEngagement = (
    caseId: number,
    value: CreateEngagementDocument
) => (dispatch: CaseDispatch): void => {
    dispatch({ type: CaseTypes.CREATE_DOC_ENGAGEMENT });
    console.log(`Creating document for ${caseId}...`);

    client
        .mutate<
            createEngagementDocumentMutation,
            createEngagementDocumentMutationVariables
        >({
            mutation: CREATE_DOC_ENGAGEMENT_MUTATION, // TODO mutation here
            variables: { caseId, value },
        })
        .then(
            () => {
                console.log(`Creating document for ${caseId}: success`);
                dispatch({
                    type: CaseTypes.CREATE_DOC_ENGAGEMENT_SUCCESS,
                });
            },
            (error: GraphQLError | Error) => {
                console.log(
                    `Creating document for ${caseId}: error: ${JSON.stringify(
                        error,
                        null,
                        2
                    )}`
                );

                dispatch({
                    type: CaseTypes.CREATE_DOC_ENGAGEMENT_FAILURE,
                    error: error.message,
                });
            }
        );
};
