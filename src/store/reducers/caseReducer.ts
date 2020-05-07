import { CaseTypes, CaseActionTypes } from '../actions/caseAction';
import { caseDetailFull } from '../../generated/caseDetailFull';

export interface CaseDataState {
    results?: caseDetailFull;
    isLoading: boolean;
    error?: string;
    addedDocumentID?: number;
    documentError?: string;
    documentSuccess: boolean;
    isLoadingEngagements: boolean;
    engagementErrorToggle: boolean;
}

export const caseReducer = (
    state: CaseDataState = {
        isLoading: false,
        isLoadingEngagements: false,
        engagementErrorToggle: false,
        documentSuccess: false,
    },
    action: CaseActionTypes
): CaseDataState => {
    switch (action.type) {
        case CaseTypes.GET_CASE_START:
            return {
                ...state,
                isLoading: true,
            };

        case CaseTypes.GET_CASE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                results: action.case,
                error: undefined,
            };

        case CaseTypes.GET_CASE_FAILURE:
            return {
                ...state,
                isLoading: false,
                results: undefined,
                error: action.error,
            };

        case CaseTypes.CLEAR_CASE:
            return {
                ...state,
                isLoading: false,
                results: undefined,
                error: undefined,
            };

        case CaseTypes.CREATE_DOC_ENGAGEMENT_FAILURE:
            return {
                ...state,
                documentError: action.error,
            };

        case CaseTypes.CLEAR_DOCUMENT_ERROR:
            return {
                ...state,
                documentError: undefined,
            };

        case CaseTypes.CREATE_DOC_ENGAGEMENT_SUCCESS:
            return {
                ...state,
                documentSuccess: true,
                addedDocumentID: action.documentID,
            };

        case CaseTypes.CLEAR_DOCUMENT_SUCCESS:
            return {
                ...state,
                documentSuccess: false,
            };

        case CaseTypes.CREATE_CALL_ENGAGEMENT:
            return {
                ...state,
                isLoadingEngagements: true,
            };

        case CaseTypes.CREATE_NOTE_ENGAGEMENT:
            return {
                ...state,
                isLoadingEngagements: true,
            };

        case CaseTypes.CREATE_EMAIL_ENGAGEMENT:
            return {
                ...state,
                isLoadingEngagements: true,
            };

        case CaseTypes.CREATE_NOTE_ENGAGEMENT_SUCCESS:
            return {
                ...state,
                isLoadingEngagements: false,
            };

        case CaseTypes.CREATE_CALL_ENGAGEMENT_SUCCESS:
            return {
                ...state,
                isLoadingEngagements: false,
            };

        case CaseTypes.CREATE_EMAIL_ENGAGEMENT_SUCCESS:
            return {
                ...state,
                isLoadingEngagements: false,
            };

        case CaseTypes.CREATE_NOTE_ENGAGEMENT_FAILURE:
            return {
                ...state,
                engagementErrorToggle: true,
            };

        case CaseTypes.CREATE_CALL_ENGAGEMENT_FAILURE:
            return {
                ...state,
                engagementErrorToggle: true,
            };

        case CaseTypes.CREATE_EMAIL_ENGAGEMENT_FAILURE:
            return {
                ...state,
                engagementErrorToggle: true,
            };

        default:
            return state;
    }
};
