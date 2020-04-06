import gql from 'graphql-tag';
import { PERSON_SLIM_FRAGMENT, PERSON_FUll_FRAGMENT } from './person';
import { RELATIONSHIP_DETAIL_SLIM_FRAGMENT } from './relationship';
import { ENGAGEMENT_DETAIL_FRAGMENT } from './engagement';

export const CASE_DETAIL_SLIM_FRAGMENT = gql`
    fragment CaseDetailSlim on Case {
        id
        person {
            ...PersonSlimFragment
        }
        caseStatus {
            id
            name
            representsClosure
        }
        childStatus {
            id
            name
        }
        fosterCare
    }

    ${PERSON_SLIM_FRAGMENT}
`;

export const CASES_DETAIL_SLIM_QUERY = gql`
    query casesDetailSlim {
        cases {
            ...CaseDetailSlim
        }
    }

    ${CASE_DETAIL_SLIM_FRAGMENT}
`;

export const CASE_DETAIL_FULL_FRAGMENT = gql`
    fragment CaseDetailFullFragment on Case {
        id
        person {
            ...PersonFullFragment
        }
        caseStatus {
            id
            name
            representsClosure
        }
        childStatus {
            id
            name
        }
        fosterCare
    }

    ${PERSON_FUll_FRAGMENT}
`;

export const CASE_DETAIL_FULL_QUERY = gql`
    query caseDetailFull($caseId: Int!) {
        details: case(caseId: $caseId) {
            ...CaseDetailFullFragment
        }
        relationships: relationships(caseId: $caseId) {
            ...RelationshipDetailSlim
        }
        engagements: engagements(caseId: $caseId) {
            ...EngagementDetail
        }
    }

    ${CASE_DETAIL_FULL_FRAGMENT}
    ${RELATIONSHIP_DETAIL_SLIM_FRAGMENT}
    ${ENGAGEMENT_DETAIL_FRAGMENT}
`;
