import { CaseTypes, CaseActionTypes } from '../actions/caseAction';
import { caseDetailFull } from '../../generated/caseDetailFull';

export interface CaseDataState {
    results?: caseDetailFull;
    isLoading: boolean;
    error?: string;
}

export const caseReducer = (
    state: CaseDataState = { isLoading: false },
    action: CaseActionTypes
): CaseDataState => {
    switch (action.type) {
        case CaseTypes.GET_CASE_START:
            return {
                ...state,
                isLoading: true,
            };

        case CaseTypes.GET_CASE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                results: action.case,
                error: undefined,
            };

        case CaseTypes.GET_CASE_FAILURE:
            return {
                ...state,
                isLoading: false,
                results: undefined,
                error: action.error,
            };

        case CaseTypes.CLEAR_CASE:
            return {
                ...state,
            };

        default:
            return state;
    }
};
