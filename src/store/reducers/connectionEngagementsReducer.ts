import {
    POST_CONNECTION_ENGAGEMENTS_START,
    POST_CONNECTION_ENGAGEMENTS_SUCCESS,
    POST_CONNECTION_ENGAGEMENTS_FAILURE,
    CLEAR_CONNECTION_ENGAGEMENTS,
    POST_CONNECTION_DOCUMENT_START,
    POST_CONNECTION_DOCUMENT_SUCCESS,
    POST_CONNECTION_DOCUMENT_FAILURE,
} from '../actions/connectionEngagements';

const initialState = {
    engagementsData: {},
    isLoadingEngagements: false,
    engagementsError: '',
    docsData: {},
    isLoadingDocs: false,
    docsError: '',
};

export const connectionEngagementsReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_CONNECTION_ENGAGEMENTS_START:
            return {
                ...state,
                isLoadingEngagements: true,
                engagementsError: '',
            };

        case POST_CONNECTION_ENGAGEMENTS_SUCCESS:
            return {
                ...state,
                isLoadingEngagements: false,
                engagementsData: action.payload,
            };

        case POST_CONNECTION_ENGAGEMENTS_FAILURE:
            return {
                ...state,
                isLoadingEngagements: false,
                engagementsError:
                    'Error adding engagement. Please try again later.',
            };

        case POST_CONNECTION_DOCUMENT_START:
            return {
                ...state,
                isLoadingDocs: true,
                docsError: '',
            };

        case POST_CONNECTION_DOCUMENT_SUCCESS:
            return {
                ...state,
                isLoadingDocs: false,
                docsData: action.payload,
            };

        case POST_CONNECTION_DOCUMENT_FAILURE:
            return {
                ...state,
                isLoadingDocs: false,
                docsError: 'Error adding document. Please try again later.',
            };

        default:
            return state;
    }
};
