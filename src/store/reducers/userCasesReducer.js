import {
    GET_USER_CASES_START,
    GET_USER_CASES_SUCCESS,
    GET_USER_CASES_FAILURE,
    CLEAR_USER_CASES
} from "../actions/userCases";


const initialState = {
    results: [],
    isLoadingCases: true,
    error: ""
};

export const getUserCasesReducer = (state = initialState, action) => {
    switch (action.type) {
    case GET_USER_CASES_START:

        return {
            ...state,
            isLoadingCases: true,
            error: ""
        };

    case GET_USER_CASES_SUCCESS:
        return {
            ...state,
            isLoadingCases: false,
            // ...action.payload,
            ...action.payload
        };

    case GET_USER_CASES_FAILURE:
        return {
            ...state,
            isLoadingCases: false,
            error: "Error loading case data. Please try again later."
        };

    case CLEAR_USER_CASES:
        return {
            ...state,
            results: []
        };

    default:
        return state;
    }
};
