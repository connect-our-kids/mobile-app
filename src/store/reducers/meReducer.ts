import { MeActionTypes, MeTypes } from '../actions/meActions';
import { UserFullFragment } from '../../generated/UserFullFragment';

export interface MeState {
    results?: UserFullFragment;
    isLoading: boolean;
    error?: string;
}

export const meReducer = (
    state: MeState = {
        isLoading: false,
    },
    action: MeActionTypes
): MeState => {
    switch (action.type) {
        case MeTypes.GET_ME_START:
            return {
                ...state,
                isLoading: true,
            };

        case MeTypes.GET_ME_SUCCESS:
            return {
                ...state,
                isLoading: false,
                results: action.me,
                error: undefined,
            };

        case MeTypes.GET_ME_FAILURE:
            return {
                ...state,
                isLoading: false,
                results: undefined,
                error: action.error,
            };

        case MeTypes.CLEAR_ME:
            return {
                ...state,
                isLoading: false,
                results: undefined,
                error: undefined,
            };

        default:
            return state;
    }
};
