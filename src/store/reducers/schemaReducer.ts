import { staticDataQuery } from '../../generated/staticDataQuery';
import { SchemaActionTypes, SchemaTypes } from '../actions/schemaActions';

export interface SchemaState {
    results?: staticDataQuery;
    isLoading: boolean;
    error?: string;
}

export const schemaReducer = (
    state: SchemaState = {
        isLoading: false,
    },
    action: SchemaActionTypes
): SchemaState => {
    switch (action.type) {
        case SchemaTypes.GET_SCHEMA_START:
            return {
                ...state,
                isLoading: true,
            };

        case SchemaTypes.GET_SCHEMA_SUCCESS:
            return {
                ...state,
                isLoading: false,
                results: action.schema,
                error: undefined,
            };

        case SchemaTypes.GET_SCHEMA_FAILURE:
            return {
                ...state,
                isLoading: false,
                results: undefined,
                error: action.error,
            };

        case SchemaTypes.CLEAR_SCHEMA:
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
