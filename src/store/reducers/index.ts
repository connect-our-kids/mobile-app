import { combineReducers } from 'redux';
import { authReducer as auth } from './authReducer';
import { peopleSearchReducer as people } from './peopleSearchReducer';
import { confirmationModalReducer as confirmationModal } from './confirmationModal';
import { recentSearchesReducer as recentSearches } from './recentSearchesReducer';
import { casesReducer } from './casesReducer';
import { caseReducer } from './caseReducer';
import { relationshipReducer } from './relationshipReducer';
import { schemaReducer } from './schemaReducer';

const rootReducer = combineReducers({
    auth,
    people,
    confirmationModal,
    recentSearches,
    cases: casesReducer,
    case: caseReducer,
    relationship: relationshipReducer,
    schema: schemaReducer,
});
export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
