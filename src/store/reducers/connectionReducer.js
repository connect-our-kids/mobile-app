import {
    GET_ENGAGEMENTS_START,
    GET_ENGAGEMENTS_SUCCESS,
    GET_ENGAGEMENTS_FAILURE,
    CLEAR_ENGAGEMENTS,

    GET_DOCUMENTS_START,
    GET_DOCUMENTS_SUCCESS,
    GET_DOCUMENTS_FAILURE,
    CLEAR_DOCUMENTS,

    GET_DETAILS_START,
    GET_DETAILS_SUCCESS,
    GET_DETAILS_FAILURE,
    CLEAR_DETAILS,
    SET_DETAILS,
} from '../actions/connectionData';

const initialState = {
    engagements: [],
    isLoadingEngagements: false,
    engagementsError: '',
    documents: [],
    isLoadingDocuments: false,
    documentsError: '',
    details: {},
    isLoadingDetails: false,
    detailsError: '',
    detailsTab: false,
};

export const connectionReducer = (state = initialState, action) => {
    switch (action.type) {
    case GET_ENGAGEMENTS_START:
        return {
            ...state,
            isLoadingEngagements: true,
            engagementsError: '',
        };

    case GET_ENGAGEMENTS_SUCCESS:
        return {
            ...state,
            isLoadingEngagements: false,
            engagements: action.payload,
        };

    case GET_ENGAGEMENTS_FAILURE:
        return {
            ...state,
            isLoadingConnections: false,
            engagementsError: 'Error loading engagements data. Please try again later.',
        };

    case CLEAR_ENGAGEMENTS:
        return {
            engagements: [],
        };

    case GET_DOCUMENTS_START:
        return {
            ...state,
            isLoadingDocuments: true,
            documentsError: '',
        };

    case GET_DOCUMENTS_SUCCESS:

        return {
            ...state,
            isLoadingDocuments: false,
            documents: action.payload,
        };

    case GET_DOCUMENTS_FAILURE:
        return {
            ...state,
            isLoadingDocuments: false,
            documentsError: 'Error loading documents. Please try again later.',
        };

    case CLEAR_DOCUMENTS:
        return {
            documents: [],
        };

    case GET_DETAILS_START:
        return {
            ...state,
            isLoadingDetails: true,
            detailsError: '',
        };

    case GET_DETAILS_SUCCESS:
        return {
            ...state,
            isLoadingDetails: false,
            details: { ...action.payload[0] },
        };

    case GET_DETAILS_FAILURE:
        return {
            ...state,
            isLoadingDetails: false,
            detailsError: 'Error loading details data. Please try again later.',
        };

    case CLEAR_DETAILS:
        return {
            details: {},
        };
    case SET_DETAILS:
        return {
            ...state,
            isLoadingDetails: false,
            detailsTab: action.payload,
        };
    default:
        return state;
    }
};
