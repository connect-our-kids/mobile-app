import {
    TeamAttributeTypes,
    TeamAttributesActionTypes,
} from '../actions/teamAttributesActions';
import { TeamAttributeDetail } from '../../generated/TeamAttributeDetail';

export interface TeamAttributeState {
    results?: TeamAttributeDetail;
    isLoading: boolean;
    error?: string;
}

export const teamAttributesReducer = (
    state: TeamAttributeState = { isLoading: false },
    action: TeamAttributesActionTypes
): TeamAttributeState => {
    switch (action.type) {
        case TeamAttributeTypes.GET_TEAM_ATTRIBUTES_START:
            return {
                ...state,
                isLoading: true,
            };

        case TeamAttributeTypes.GET_TEAM_ATTRIBUTES_SUCCESS:
            return {
                ...state,
                isLoading: false,
                results: action.attributes,
                error: undefined,
            };

        case TeamAttributeTypes.GET_TEAM_ATTRIBUTES_FAILURE:
            return {
                ...state,
                isLoading: false,
                results: undefined,
                error: action.error,
            };

        case TeamAttributeTypes.CLEAR_TEAM_ATTRIBUTES:
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
