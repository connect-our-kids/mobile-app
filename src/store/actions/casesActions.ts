import { client } from './apollo';
import {
    CASES_DETAIL_SLIM_QUERY,
    CREATE_CASE_MUTATION,
    addCaseCache,
} from './fragments/cases';
import { GraphQLError } from 'graphql';
import {
    casesDetailSlim,
    casesDetailSlim_cases,
} from '../../generated/casesDetailSlim';
import { CreateCaseInput } from '../../generated/globalTypes';
import {
    createCaseMutation,
    createCaseMutationVariables,
} from '../../generated/createCaseMutation';

export enum CasesTypes {
    GET_USER_CASES_START = 'GET_USER_CASES_START',
    GET_USER_CASES_SUCCESS = 'GET_USER_CASES_SUCCESS',
    GET_USER_CASES_FAILURE = 'GET_USER_CASES_FAILURE',
    CLEAR_USER_CASES = 'CLEAR_USER_CASES',
    CREATE_CASE = 'CREATE_CASE',
    CREATE_CASE_SUCCESS = 'CREATE_CASE_SUCCESS',
    CREATE_CASE_FAILURE = 'CREATE_CASE_FAILURE',
}

export interface CasesStartAction {
    type: CasesTypes.GET_USER_CASES_START;
}

export interface CasesSuccessAction {
    type: CasesTypes.GET_USER_CASES_SUCCESS;
    cases: casesDetailSlim_cases[];
}

export interface CasesFailureAction {
    type: CasesTypes.GET_USER_CASES_FAILURE;
    error: string;
}

export interface CasesClearAction {
    type: CasesTypes.CLEAR_USER_CASES;
}

export type CasesActionTypes =
    | CasesStartAction
    | CasesSuccessAction
    | CasesFailureAction
    | CasesClearAction
    | CreateCaseAction
    | CreateCaseSuccessAction
    | CreateCaseFailureAction;

export interface CasesDispatch {
    (arg0: CasesActionTypes): void;
}

export interface CreateCaseAction {
    type: CasesTypes.CREATE_CASE;
}

export interface CreateCaseSuccessAction {
    type: CasesTypes.CREATE_CASE_SUCCESS;
    case: casesDetailSlim_cases;
}

export interface CreateCaseFailureAction {
    type: CasesTypes.CREATE_CASE_FAILURE;
    error: string;
}

// this action grabs all cases for a specified user
export const getCases = () => (dispatch: CasesDispatch) => {
    dispatch({ type: CasesTypes.GET_USER_CASES_START });
    console.log('Loading cases...');

    client
        .watchQuery<casesDetailSlim>({ query: CASES_DETAIL_SLIM_QUERY })
        .subscribe(
            (result) => {
                console.log(`Loading cases: success`);
                dispatch({
                    type: CasesTypes.GET_USER_CASES_SUCCESS,
                    cases: result.data.cases,
                });
            },
            (error: GraphQLError | Error) => {
                console.log(
                    `Loading cases: error: ${JSON.stringify(error, null, 2)}`
                );

                dispatch({
                    type: CasesTypes.GET_USER_CASES_FAILURE,
                    error: error.message,
                });
            }
        );
};

export const createCase = (value: CreateCaseInput) => (
    dispatch: CasesDispatch
): void => {
    dispatch({ type: CasesTypes.CREATE_CASE });
    console.log(`Creating case...`);

    client
        .mutate<createCaseMutation, createCaseMutationVariables>({
            mutation: CREATE_CASE_MUTATION,
            variables: { value },
            update: (cache, result) => {
                if (result.data) {
                    addCaseCache(result.data.createCase, cache);
                }
            },
        })
        .then(
            (result) => {
                if (result.data) {
                    console.log(`Creating case: success`);
                    dispatch({
                        type: CasesTypes.CREATE_CASE_SUCCESS,
                        case: result.data.createCase,
                    });
                } else {
                    console.log(`Creating case: error: returned no data`);

                    dispatch({
                        type: CasesTypes.CREATE_CASE_FAILURE,
                        error: `returned no data`,
                    });
                }
            },
            (error: GraphQLError | Error) => {
                console.log(
                    `Creating case: error: ${JSON.stringify(error, null, 2)}`
                );

                dispatch({
                    type: CasesTypes.CREATE_CASE_FAILURE,
                    error: error.message,
                });
            }
        );
};

export const clearUserCases = () => (dispatch: CasesDispatch): void => {
    dispatch({ type: CasesTypes.CLEAR_USER_CASES });
    // TODO actually clear data
};
