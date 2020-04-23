import {
    FETCH_PEOPLE_SUCCESS,
    FETCH_PERSON,
    FETCH_PERSON_FAILURE,
    FETCH_PERSON_SUCCESS,
    FETCH_SEARCH_RESULT,
    FETCH_SEARCH_RESULT_FAILURE,
    RESET_PERSON,
    RESET_STATE,
    POPULATE_SEARCH_RESULTS,
    POPULATE_PERSON,
} from '../actions/actionTypes';

const initialState = {
    error: null,
    isFetching: false,
    person: null,
    possiblePersons: [],
    errorMessage: 'yes!',
};

export const peopleSearchReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PERSON:
        case FETCH_SEARCH_RESULT:
            return {
                ...state,
                isFetching: true,
            };
        case FETCH_PEOPLE_SUCCESS:
            return {
                ...state,
                isFetching: false,
                possiblePersons: [...action.payload],
                error: null,
            };
        case FETCH_PERSON_SUCCESS:
            return {
                ...state,
                isFetching: false,
                person: { ...action.payload },
                error: null,
            };
        case FETCH_PERSON_FAILURE:
            return {
                ...state,
                isFetching: false,
            };
        case FETCH_SEARCH_RESULT_FAILURE:
            console.log(' There was a FETCH_SEARCH_RESULT_FAILURE: ', action);
            return {
                error: action.payload,
                isFetching: false,
                person: null,
                possiblePersons: [],
                errorMessage: 'There was a problem performing the search',
            };
        case RESET_PERSON:
            return {
                ...state,
                person: null,
            };
        case RESET_STATE:
            return initialState;
        case POPULATE_SEARCH_RESULTS:
            return {
                ...state,
                possiblePersons: [...action.payload],
            };
        case POPULATE_PERSON:
            return {
                ...state,
                person: { ...action.payload },
            };
        default:
            return state;
    }
};
