import {
    CASE_DETAIL_FULL_QUERY,
    addEngagementCache,
    addRelationshipToCache,
    CREATE_RELATIONSHIP_MUTATION,
} from './fragments/cases';
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
    CreateRelationshipInput,
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
import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ThunkResult } from '../store';
import {
    createRelationshipMutation,
    createRelationshipMutationVariables,
    createRelationshipMutation_createRelationship,
} from '../../generated/createRelationshipMutation';

export enum CaseTypes {
    GET_CASE_START = 'GET_CASE_START',
    GET_CASE_SUCCESS = 'GET_CASE_SUCCESS',
    GET_CASE_FAILURE = 'GET_CASE_FAILURE',
    CREATE_RELATIONSHIP_START = 'CREATE_RELATIONSHIP_START',
    CREATE_RELATIONSHIP_SUCCESS = 'CREATE_RELATIONSHIP_SUCCESS',
    CREATE_RELATIONSHIP_FAILURE = 'CREATE_RELATIONSHIP_FAILURE',
    CREATE_RELATIONSHIP_CLEAR = 'CREATE_RELATIONSHIP_CLEAR',
    CLEAR_CASE = 'CLEAR_CASE',
    CLEAR_DOCUMENT_ERROR = 'CLEAR_DOCUMENT_ERROR',
    CLEAR_DOCUMENT_SUCCESS = 'CLEAR_DOCUMENT_SUCCESS',
    CREATE_DOC_ENGAGEMENT = 'CREATE_DOC_ENGAGEMENT',
    CREATE_DOC_ENGAGEMENT_SUCCESS = 'CREATE_DOC_ENGAGEMENT_SUCCESS',
    CREATE_DOC_ENGAGEMENT_FAILURE = 'CREATE_DOC_ENGAGEMENT_FAILURE',
    CLEAR_ENGAGEMENT_SUCCESS = 'CLEAR_ENGAGEMENT_SUCCESS',
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

export interface CreateRelationshipStartAction {
    type: CaseTypes.CREATE_RELATIONSHIP_START;
}

export interface CreateRelationshipSuccessAction {
    type: CaseTypes.CREATE_RELATIONSHIP_SUCCESS;
    relationship: createRelationshipMutation_createRelationship;
}

export interface CreateRelationshipFailureAction {
    type: CaseTypes.CREATE_RELATIONSHIP_FAILURE;
    error: string;
}

export interface CreateRelationshipClearAction {
    type: CaseTypes.CREATE_RELATIONSHIP_CLEAR;
}

export interface CaseClearAction {
    type: CaseTypes.CLEAR_CASE;
}

export interface DocumentClearErrorAction {
    type: CaseTypes.CLEAR_DOCUMENT_ERROR;
}

export interface DocumentClearSuccessAction {
    type: CaseTypes.CLEAR_DOCUMENT_SUCCESS;
}

export interface EngagementClearSuccessAction {
    type: CaseTypes.CLEAR_ENGAGEMENT_SUCCESS;
}

export interface CreateDocEngagementAction {
    type: CaseTypes.CREATE_DOC_ENGAGEMENT;
}

export interface CreateDocEngagementSuccessAction {
    type: CaseTypes.CREATE_DOC_ENGAGEMENT_SUCCESS;
    documentID?: number;
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
    noteID?: number;
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
    callID?: number;
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
    emailID?: number;
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
    | CreateRelationshipStartAction
    | CreateRelationshipSuccessAction
    | CreateRelationshipFailureAction
    | CreateRelationshipClearAction
    | DocumentClearErrorAction
    | DocumentClearSuccessAction
    | CreateDocEngagementAction
    | CreateDocEngagementSuccessAction
    | CreateDocEngagementFailureAction
    | EngagementClearSuccessAction
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

export const getCase = (caseId: number): ThunkResult<void> => (
    dispatch: CaseDispatch,
    _getState,
    { client }: { client: ApolloClient<NormalizedCacheObject> }
): void => {
    dispatch({ type: CaseTypes.GET_CASE_START });
    console.log(`Loading case ${caseId}...`);

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

export const clearCase = (): ThunkResult<void> => (
    dispatch: CaseDispatch
): void => {
    dispatch({ type: CaseTypes.CLEAR_CASE });
    // TODO actually clear data
};

export const createRelationship = (
    caseId: number,
    value: CreateRelationshipInput
): ThunkResult<void> => (
    dispatch: CaseDispatch,
    _getState,
    { client }: { client: ApolloClient<NormalizedCacheObject> }
): void => {
    dispatch({ type: CaseTypes.CREATE_RELATIONSHIP_START });
    console.log(`Creating relationship for case ${caseId}...`);

    client
        .mutate<
            createRelationshipMutation,
            createRelationshipMutationVariables
        >({
            mutation: CREATE_RELATIONSHIP_MUTATION, // TODO mutation here
            variables: { caseId, value },
            update: (cache, result) => {
                if (result.data) {
                    addRelationshipToCache(
                        caseId,
                        result.data.createRelationship,
                        cache
                    );
                }
            },
        })
        .then(
            (res) => {
                if (res.data) {
                    console.log(
                        `Creating relationship for case ${caseId}: success`
                    );

                    dispatch({
                        type: CaseTypes.CREATE_RELATIONSHIP_SUCCESS,
                        relationship: res.data.createRelationship,
                    });
                } else {
                    console.log(
                        `Creating relationship for case ${caseId}: error: no data`
                    );
                    dispatch({
                        type: CaseTypes.CREATE_RELATIONSHIP_FAILURE,
                        error: 'no data',
                    });
                }
            },
            (error: GraphQLError | Error) => {
                console.log(
                    `Creating relationship for case ${caseId}: error: ${JSON.stringify(
                        error,
                        null,
                        2
                    )}`
                );
                dispatch({
                    type: CaseTypes.CREATE_RELATIONSHIP_FAILURE,
                    error: error.message,
                });
            }
        );
};

export const clearCreateRelationship = (): ThunkResult<void> => (
    dispatch: CaseDispatch
): void => {
    dispatch({ type: CaseTypes.CREATE_RELATIONSHIP_CLEAR });
};

export const createDocEngagement = (
    caseId: number,
    value: CreateEngagementDocument
): ThunkResult<void> => (
    dispatch: CaseDispatch,
    _getState,
    { client }: { client: ApolloClient<NormalizedCacheObject> }
): void => {
    dispatch({ type: CaseTypes.CREATE_DOC_ENGAGEMENT });
    console.log(`Creating document for ${caseId}...`);

    client
        .mutate<
            createEngagementDocumentMutation,
            createEngagementDocumentMutationVariables
        >({
            mutation: CREATE_DOC_ENGAGEMENT_MUTATION, // TODO mutation here
            variables: { caseId, value },
            update: (cache, result) => {
                if (result.data) {
                    addEngagementCache(
                        caseId,
                        result.data.createEngagementDocument,
                        cache
                    );
                }
            },
        })
        .then(
            (res) => {
                console.log(`Creating document for ${caseId}: success`);

                dispatch({
                    type: CaseTypes.CREATE_DOC_ENGAGEMENT_SUCCESS,
                    documentID: res.data?.createEngagementDocument.id,
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

export const docClearSuccess = () => (dispatch: CaseDispatch): void => {
    //new document back to false
    dispatch({
        type: CaseTypes.CLEAR_DOCUMENT_SUCCESS,
    });
};

export const docClearError = () => (dispatch: CaseDispatch): void => {
    //resets document error to undefined
    dispatch({
        type: CaseTypes.CLEAR_DOCUMENT_ERROR,
    });
};

export const createNoteEngagement = (
    caseId: number,
    value: CreateEngagementNote
): ThunkResult<void> => (
    dispatch: CaseDispatch,
    getState,
    { client }: { client: ApolloClient<NormalizedCacheObject> }
): void => {
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
            (res) => {
                console.log(`Creating note for ${caseId}: success`);
                dispatch({
                    type: CaseTypes.CREATE_NOTE_ENGAGEMENT_SUCCESS,
                    noteID: res.data?.createEngagementNote.id,
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
): ThunkResult<void> => (
    dispatch: CaseDispatch,
    getState,
    { client }: { client: ApolloClient<NormalizedCacheObject> }
): void => {
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
            (res) => {
                console.log(`Creating call for ${caseId}: success`);
                dispatch({
                    type: CaseTypes.CREATE_CALL_ENGAGEMENT_SUCCESS,
                    callID: res.data?.createEngagementCall.id,
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
): ThunkResult<void> => (
    dispatch: CaseDispatch,
    getState,
    { client }: { client: ApolloClient<NormalizedCacheObject> }
): void => {
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
            (res) => {
                console.log(`Creating email for ${caseId}: success`);
                dispatch({
                    type: CaseTypes.CREATE_EMAIL_ENGAGEMENT_SUCCESS,
                    emailID: res.data?.createEngagementEmail.id,
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

export const clearEngagementSuccess = () => (dispatch: CaseDispatch): void => {
    //new engagement back to false
    dispatch({
        type: CaseTypes.CLEAR_ENGAGEMENT_SUCCESS,
    });
};
