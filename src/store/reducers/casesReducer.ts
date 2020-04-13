import { casesDetailSlim_cases } from '../../generated/casesDetailSlim';
import { CasesTypes, CasesActionTypes } from '../actions';

export interface CasesState {
    results: casesDetailSlim_cases[];
    isLoadingCases: boolean;
    error?: string;
}

const initialState: CasesState = {
    results: [],
    isLoadingCases: true,
    error: undefined,
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
                error: '',
            };

        case CasesTypes.GET_USER_CASES_SUCCESS:
            return {
                ...state,
                isLoadingCases: false,
                results: action.cases,
            };

        case CasesTypes.GET_USER_CASES_FAILURE:
            return {
                ...state,
                isLoadingCases: false,
                error: action.error,
            };

        case CasesTypes.CLEAR_USER_CASES:
            return {
                ...state,
                results: [],
            };

        default:
            return state;
    }
};
