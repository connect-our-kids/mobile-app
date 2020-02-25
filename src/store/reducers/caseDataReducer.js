import {
    GET_CASE_DATA_START,
    GET_CASE_DATA_SUCCESS,
    GET_CASE_DATA_FAILURE,
    CLEAR_CASE_DATA,
} from '../actions/caseData';

const initialState = {
    caseData: {},
    isLoadingCaseData: false,
    caseDataError: '',
};

export const getCaseDataReducer = (state = initialState, action) => {
    switch (action.type) {
    case GET_CASE_DATA_START:
        return {
            ...state,
            isLoadingCaseData: true,
            caseDataError: '',
        };

    case GET_CASE_DATA_SUCCESS:

        return {
            ...state,
            isLoadingCaseData: false,
            caseData: { ...action.payload },
        };

    case GET_CASE_DATA_FAILURE:
        return {
            ...state,
            isLoadingCaseData: false,
            caseDataError: 'Error loading case data. Please try again later.',
        };

    case CLEAR_CASE_DATA:
        return {
            ...state,
            caseData: {},
        };

    default:
        return state;
    }
};
