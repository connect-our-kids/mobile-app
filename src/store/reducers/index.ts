import { combineReducers } from 'redux';
import { authReducer as auth } from './authReducer';
import { peopleSearchReducer } from './peopleSearchReducer';
import { casesReducer } from './casesReducer';
import { caseReducer } from './caseReducer';
import { relationshipReducer } from './relationshipReducer';
import { schemaReducer } from './schemaReducer';
import { meReducer } from './meReducer';

export const rootReducer = combineReducers({
    auth,
    people: peopleSearchReducer,
    cases: casesReducer,
    case: caseReducer,
    relationship: relationshipReducer,
    schema: schemaReducer,
    me: meReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
