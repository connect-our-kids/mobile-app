import {
    GET_CASE_CONNECTIONS_START,
    GET_CASE_CONNECTIONS_SUCCESS,
    GET_CASE_CONNECTIONS_FAILURE,
    CLEAR_CASE_CONNECTIONS,
} from '../actions/caseConnections';

const initialState = {
    caseConnections: [],
    isLoadingConnections: false,
    connectionsError: '',
};

export const getCaseConnectionsReducer = (state = initialState, action) => {
    switch (action.type) {
    case GET_CASE_CONNECTIONS_START:
        return {
            ...state,
            isLoadingConnections: true,
            connectionsError: '',
        };

    case GET_CASE_CONNECTIONS_SUCCESS:

        return {
            ...state,
            isLoadingConnections: false,
            caseConnections: action.payload,
        };

    case GET_CASE_CONNECTIONS_FAILURE:
        return {
            ...state,
            isLoadingConnections: false,
            connectionsError: 'Error loading case connections. Please try again later.',
        };

    case CLEAR_CASE_CONNECTIONS:
        return {
            ...state,
            caseConnections: [],
        };

    default:
        return state;
    }
};
