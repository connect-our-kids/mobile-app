import { casesDetailSlim_cases } from '../../generated/casesDetailSlim';
import { CasesTypes, CasesActionTypes } from '../actions';

export interface CasesState {
    results: casesDetailSlim_cases[];
    isLoadingCases: boolean;
    error?: string;
    isAddingCase: boolean;
    addingCaseError?: string;
    lastAddedCase?: casesDetailSlim_cases;
}

const initialState: CasesState = {
    results: [],
    isLoadingCases: false,
    isAddingCase: false,
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
                error: undefined,
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

        case CasesTypes.CREATE_CASE:
            return {
                ...state,
                isAddingCase: true,
                lastAddedCase: undefined,
                addingCaseError: undefined,
            };

        case CasesTypes.CREATE_CASE_FAILURE:
            return {
                ...state,
                isAddingCase: false,
                lastAddedCase: undefined,
                addingCaseError: action.error,
            };

        case CasesTypes.CREATE_CASE_SUCCESS:
            return {
                ...state,
                isAddingCase: false,
                lastAddedCase: action.case,
                addingCaseError: undefined,
            };

        default:
            return state;
    }
};
