import { combineReducers } from 'redux';
import { authReducer as auth } from './authReducer';
import { peopleSearchReducer as people } from './peopleSearchReducer';
import { confirmationModalReducer as confirmationModal } from './confirmationModal';
import { recentSearchesReducer as recentSearches } from './recentSearchesReducer';
import { getUserCasesReducer as userCases } from './userCasesReducer';
import { getCaseDataReducer as caseData } from './caseDataReducer';
import { getCaseConnectionsReducer as caseConnections } from './caseConnectionsReducer';
import { connectionReducer as connection } from './connectionReducer';
import { connectionEngagementsReducer as engagements } from './connectionEngagementsReducer';

export default combineReducers({
    auth,
    people,
    confirmationModal,
    recentSearches,
    userCases,
    caseData,
    caseConnections,
    connection,
    engagements,
});
