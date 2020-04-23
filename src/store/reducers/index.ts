import { combineReducers } from 'redux';
import { authReducer as auth } from './authReducer';
import { peopleSearchReducer as people } from './peopleSearchReducer';
import { confirmationModalReducer as confirmationModal } from './confirmationModal';
import { recentSearchesReducer as recentSearches } from './recentSearchesReducer';
import { casesReducer } from './casesReducer';
import { caseReducer } from './caseReducer';
import { connectionEngagementsReducer as engagements } from './connectionEngagementsReducer';
import { relationshipReducer } from './relationshipReducer';

const rootReducer = combineReducers({
    auth,
    people,
    confirmationModal,
    recentSearches,
    cases: casesReducer,
    case: caseReducer,
    relationship: relationshipReducer,
    engagements,
});
export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
