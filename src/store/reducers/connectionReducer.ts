import {
    ConnectionDataActionTypes,
    ConnectionDataTypes,
} from '../actions/connectionData';
import { engagements_engagements } from '../../generated/engagements';

const initialState: ConnectionState = {
    engagements: [],
    isLoadingEngagements: false,
    details: {},
    isLoadingDetails: false,
    detailsTab: false,
};

export interface ConnectionState {
    engagements: engagements_engagements[];
    isLoadingEngagements: boolean;
    engagementsError?: string;
    details: Record<string, unknown>;
    isLoadingDetails: boolean;
    detailsError?: string;
    detailsTab: boolean;
}

export const connectionReducer = (
    state: ConnectionState = initialState,
    action: ConnectionDataActionTypes
): ConnectionState => {
    switch (action.type) {
        case ConnectionDataTypes.GET_ENGAGEMENTS_START:
            return {
                ...state,
                isLoadingEngagements: true,
                engagementsError: undefined,
            };

        case ConnectionDataTypes.GET_ENGAGEMENTS_SUCCESS:
            return {
                ...state,
                isLoadingEngagements: false,
                engagements: action.engagements,
            };

        case ConnectionDataTypes.GET_ENGAGEMENTS_FAILURE:
            return {
                ...state,
                isLoadingEngagements: false,
                engagementsError: action.error,
            };

        case ConnectionDataTypes.CLEAR_ENGAGEMENTS:
            return {
                ...state,
                engagements: [],
            };

        case ConnectionDataTypes.GET_DETAILS_START:
            return {
                ...state,
                isLoadingDetails: true,
                detailsError: undefined,
            };

        case ConnectionDataTypes.GET_DETAILS_SUCCESS:
            return {
                ...state,
                isLoadingDetails: false,
                details: action.details,
                detailsError: undefined,
            };

        case ConnectionDataTypes.GET_DETAILS_FAILURE:
            return {
                ...state,
                isLoadingDetails: false,
                detailsError: action.error,
            };

        case ConnectionDataTypes.CLEAR_DETAILS:
            return {
                ...state,
                details: {},
            };
        case ConnectionDataTypes.SET_DETAILS:
            return {
                ...state,
                isLoadingDetails: false,
                detailsTab: action.payload,
            };
        default:
            return state;
    }
};
