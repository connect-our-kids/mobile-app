import {
    RelationshipActionTypes,
    RelationshipTypes,
} from '../actions/relationshipAction';
import { relationshipDetailFull_relationship } from '../../generated/relationshipDetailFull';

export interface RelationshipState {
    results?: relationshipDetailFull_relationship;
    isLoading: boolean;
    error?: string;
}

export const relationshipReducer = (
    state: RelationshipState = { isLoading: false },
    action: RelationshipActionTypes
): RelationshipState => {
    switch (action.type) {
        case RelationshipTypes.GET_RELATIONSHIP_START:
            return {
                ...state,
                isLoading: true,
            };

        case RelationshipTypes.GET_RELATIONSHIP_SUCCESS:
            return {
                ...state,
                isLoading: false,
                results: action.relationship,
                error: undefined,
            };

        case RelationshipTypes.GET_RELATIONSHIP_FAILURE:
            return {
                ...state,
                isLoading: false,
                results: undefined,
                error: action.error,
            };

        case RelationshipTypes.CLEAR_RELATIONSHIP:
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
