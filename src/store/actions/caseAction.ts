import { client } from './apollo';
import { CASE_DETAIL_FULL_QUERY, addEngagementCache } from './fragments/cases';
import { GraphQLError } from 'graphql';
import {
    caseDetailFull,
    caseDetailFullVariables,
} from '../../generated/caseDetailFull';
import {
    CREATE_DOC_ENGAGEMENT_MUTATION,
    CREATE_NOTE_ENGAGEMENT_MUTATION,
    CREATE_CALL_ENGAGEMENT_MUTATION,
    CREATE_EMAIL_ENGAGEMENT_MUTATION,
} from './fragments/engagement';
import {
    createEngagementDocumentMutation,
    createEngagementDocumentMutationVariables,
} from '../../generated/createEngagementDocumentMutation';
import {
    CreateEngagementDocument,
    CreateEngagementNote,
    CreateEngagementCall,
    CreateEngagementEmail,
} from '../../generated/globalTypes';
import {
    createEngagementNoteMutation,
    createEngagementNoteMutationVariables,
} from '../../generated/createEngagementNoteMutation';
import {
    createEngagementCallMutation,
    createEngagementCallMutationVariables,
} from '../../generated/createEngagementCallMutation';
import {
    createEngagementEmailMutation,
    createEngagementEmailMutationVariables,
} from '../../generated/createEngagementEmailMutation';

export enum CaseTypes {
    GET_CASE_START = 'GET_CASE_START',
    GET_CASE_SUCCESS = 'GET_CASE_SUCCESS',
    GET_CASE_FAILURE = 'GET_CASE_FAILURE',
    CLEAR_CASE = 'CLEAR_CASE',
    CREATE_DOC_ENGAGEMENT = 'CREATE_DOC_ENGAGEMENT',
    CREATE_DOC_ENGAGEMENT_SUCCESS = 'CREATE_DOC_ENGAGEMENT_SUCCESS',
    CREATE_DOC_ENGAGEMENT_FAILURE = 'CREATE_DOC_ENGAGEMENT_FAILURE',
    CREATE_NOTE_ENGAGEMENT = 'CREATE_NOTE_ENGAGEMENT',
    CREATE_NOTE_ENGAGEMENT_SUCCESS = 'CREATE_NOTE_ENGAGEMENT_SUCCESS',
    CREATE_NOTE_ENGAGEMENT_FAILURE = 'CREATE_NOTE_ENGAGEMENT_FAILURE',
    CREATE_CALL_ENGAGEMENT = 'CREATE_CALL_ENGAGEMENT',
    CREATE_CALL_ENGAGEMENT_SUCCESS = 'CREATE_CALL_ENGAGEMENT_SUCCESS',
    CREATE_CALL_ENGAGEMENT_FAILURE = 'CREATE_CALL_ENGAGEMENT_FAILURE',
    CREATE_EMAIL_ENGAGEMENT = 'CREATE_EMAIL_ENGAGEMENT',
    CREATE_EMAIL_ENGAGEMENT_SUCCESS = 'CREATE_EMAIL_ENGAGEMENT_SUCCESS',
    CREATE_EMAIL_ENGAGEMENT_FAILURE = 'CREATE_EMAIL_ENGAGEMENT_FAILURE',
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

export interface CreateNoteEngagementAction {
    type: CaseTypes.CREATE_NOTE_ENGAGEMENT;
}

export interface CreateNoteEngagementSuccessAction {
    type: CaseTypes.CREATE_NOTE_ENGAGEMENT_SUCCESS;
}

export interface CreateNoteEngagementFailureAction {
    type: CaseTypes.CREATE_NOTE_ENGAGEMENT_FAILURE;
    error: string;
}

export interface CreateCallEngagementAction {
    type: CaseTypes.CREATE_CALL_ENGAGEMENT;
}

export interface CreateCallEngagementSuccessAction {
    type: CaseTypes.CREATE_CALL_ENGAGEMENT_SUCCESS;
}

export interface CreateCallEngagementFailureAction {
    type: CaseTypes.CREATE_CALL_ENGAGEMENT_FAILURE;
    error: string;
}
export interface CreateEmailEngagementAction {
    type: CaseTypes.CREATE_EMAIL_ENGAGEMENT;
}

export interface CreateEmailEngagementSuccessAction {
    type: CaseTypes.CREATE_EMAIL_ENGAGEMENT_SUCCESS;
}

export interface CreateEmailEngagementFailureAction {
    type: CaseTypes.CREATE_EMAIL_ENGAGEMENT_FAILURE;
    error: string;
}

export type CaseActionTypes =
    | CaseStartAction
    | CaseSuccessAction
    | CaseFailureAction
    | CaseClearAction
    | CreateDocEngagementAction
    | CreateDocEngagementSuccessAction
    | CreateDocEngagementFailureAction
    | CreateNoteEngagementAction
    | CreateNoteEngagementSuccessAction
    | CreateNoteEngagementFailureAction
    | CreateCallEngagementAction
    | CreateCallEngagementSuccessAction
    | CreateCallEngagementFailureAction
    | CreateEmailEngagementAction
    | CreateEmailEngagementSuccessAction
    | CreateEmailEngagementFailureAction;

export interface CaseDispatch {
    (arg0: CaseActionTypes): void;
}

export const getCase = (caseId: number) => (dispatch: CaseDispatch): void => {
    dispatch({ type: CaseTypes.GET_CASE_START });
    console.log(`Loading case ${caseId}...`);

    // get token
    // if (no token) {

    //}

    client
        .watchQuery<caseDetailFull, caseDetailFullVariables>({
            query: CASE_DETAIL_FULL_QUERY,
            variables: { caseId: caseId },
        })
        .subscribe(
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

export const createNoteEngagement = (
    caseId: number,
    value: CreateEngagementNote
) => (dispatch: CaseDispatch): void => {
    dispatch({ type: CaseTypes.CREATE_NOTE_ENGAGEMENT });
    console.log(`Creating note for ${caseId}...`);

    client
        .mutate<
            createEngagementNoteMutation,
            createEngagementNoteMutationVariables
        >({
            mutation: CREATE_NOTE_ENGAGEMENT_MUTATION, // TODO mutation here
            variables: { caseId, value },
            update: (cache, result) => {
                if (result.data) {
                    addEngagementCache(
                        caseId,
                        result.data.createEngagementNote,
                        cache
                    );
                }
            },
        })
        .then(
            () => {
                console.log(`Creating note for ${caseId}: success`);
                dispatch({
                    type: CaseTypes.CREATE_NOTE_ENGAGEMENT_SUCCESS,
                });
            },
            (error: GraphQLError | Error) => {
                console.log(
                    `Creating note for ${caseId}: error: ${JSON.stringify(
                        error,
                        null,
                        2
                    )}`
                );

                dispatch({
                    type: CaseTypes.CREATE_NOTE_ENGAGEMENT_FAILURE,
                    error: error.message,
                });
            }
        );
};

export const createCallEngagement = (
    caseId: number,
    value: CreateEngagementCall
) => (dispatch: CaseDispatch): void => {
    dispatch({ type: CaseTypes.CREATE_CALL_ENGAGEMENT });
    console.log(`Creating call for ${caseId}...`);

    client
        .mutate<
            createEngagementCallMutation,
            createEngagementCallMutationVariables
        >({
            mutation: CREATE_CALL_ENGAGEMENT_MUTATION, // TODO mutation here
            variables: { caseId, value },
            update: (cache, result) => {
                if (result.data) {
                    addEngagementCache(
                        caseId,
                        result.data.createEngagementCall,
                        cache
                    );
                }
            },
        })
        .then(
            () => {
                console.log(`Creating call for ${caseId}: success`);
                dispatch({
                    type: CaseTypes.CREATE_CALL_ENGAGEMENT_SUCCESS,
                });
            },
            (error: GraphQLError | Error) => {
                console.log(
                    `Creating call for ${caseId}: error: ${JSON.stringify(
                        error,
                        null,
                        2
                    )}`
                );

                dispatch({
                    type: CaseTypes.CREATE_CALL_ENGAGEMENT_FAILURE,
                    error: error.message,
                });
            }
        );
};

export const createEmailEngagement = (
    caseId: number,
    value: CreateEngagementEmail
) => (dispatch: CaseDispatch): void => {
    dispatch({ type: CaseTypes.CREATE_EMAIL_ENGAGEMENT });
    console.log(`Creating email for ${caseId}...`);

    client
        .mutate<
            createEngagementEmailMutation,
            createEngagementEmailMutationVariables
        >({
            mutation: CREATE_EMAIL_ENGAGEMENT_MUTATION,
            variables: { caseId, value },
            update: (cache, result) => {
                if (result.data) {
                    addEngagementCache(
                        caseId,
                        result.data.createEngagementEmail,
                        cache
                    );
                }
            },
        })
        .then(
            () => {
                console.log(`Creating email for ${caseId}: success`);
                dispatch({
                    type: CaseTypes.CREATE_EMAIL_ENGAGEMENT_SUCCESS,
                });
            },
            (error: GraphQLError | Error) => {
                console.log(
                    `Creating email for ${caseId}: error: ${JSON.stringify(
                        error,
                        null,
                        2
                    )}`
                );

                dispatch({
                    type: CaseTypes.CREATE_EMAIL_ENGAGEMENT_FAILURE,
                    error: error.message,
                });
            }
        );
};
