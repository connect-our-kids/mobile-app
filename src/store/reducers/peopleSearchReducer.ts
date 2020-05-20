import { PeopleSearchActionTypes, PeopleSearchTypes } from '../actions';

export interface PeopleSearchState {
    isFetching: boolean;
    person?: Record<string, unknown>;
    possiblePersons: Record<string, unknown>[];
    errorMessage?: string;
}

const initialState: PeopleSearchState = {
    isFetching: false,
    possiblePersons: [],
};

export const peopleSearchReducer = (
    state = initialState,
    action: PeopleSearchActionTypes
): PeopleSearchState => {
    switch (action.type) {
        case PeopleSearchTypes.FETCH_PERSON:
            return {
                ...state,
                isFetching: true,
            };
        case PeopleSearchTypes.FETCH_SEARCH_RESULT:
            return {
                ...state,
                isFetching: true,
            };
        case PeopleSearchTypes.FETCH_PEOPLE_SUCCESS:
            return {
                ...state,
                isFetching: false,
                possiblePersons: [...action.result],
                errorMessage: undefined,
            };
        case PeopleSearchTypes.FETCH_PERSON_SUCCESS:
            return {
                ...state,
                isFetching: false,
                person: { ...action.person },
                errorMessage: undefined,
            };
        case PeopleSearchTypes.FETCH_PERSON_FAILURE:
            return {
                ...state,
                isFetching: false,
            };
        case PeopleSearchTypes.FETCH_SEARCH_RESULT_FAILURE:
            return {
                isFetching: false,
                person: undefined,
                possiblePersons: [],
                errorMessage: 'There was a problem performing the search',
            };
        case PeopleSearchTypes.RESET_PERSON:
            return {
                ...state,
                person: undefined,
            };
        case PeopleSearchTypes.RESET_STATE:
            return initialState;
        default:
            return state;
    }
};
