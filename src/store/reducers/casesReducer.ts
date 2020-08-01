import { casesDetailSlim_cases } from '../../generated/casesDetailSlim';
import { CasesTypes, CasesActionTypes } from '../actions';

export interface CasesState {
    results: casesDetailSlim_cases[];
    isLoadingCases: boolean;
    resultsLoaded: boolean;
    error?: string;
}

const initialState: CasesState = {
    results: [],
    isLoadingCases: false,
    resultsLoaded: false,
};

export const casesReducer = (
    state: CasesState = initialState,
    action: CasesActionTypes
): CasesState => {
    switch (action.type) {
        case CasesTypes.GET_USER_CASES_START:
            return {
                ...state,
                isLoadingCases: true,
                resultsLoaded: false,
                error: undefined,
            };

        case CasesTypes.GET_USER_CASES_SUCCESS:
            return {
                ...state,
                isLoadingCases: false,
                resultsLoaded: true,
                results: action.cases,
            };

        case CasesTypes.GET_USER_CASES_FAILURE:
            return {
                ...state,
                isLoadingCases: false,
                resultsLoaded: false,
                error: action.error,
            };

        case CasesTypes.CLEAR_USER_CASES:
            return {
                ...state,
                isLoadingCases: false,
                resultsLoaded: false,
                results: [],
                error: undefined,
            };

        default:
            return state;
    }
};
