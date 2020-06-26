import gql from 'graphql-tag';
import {
    PERSON_BIRTHDAY_FRAGMENT,
    PERSON_NAME_FRAGMENT,
    PERSON_FUll_FRAGMENT,
} from './person';

export const RELATIONSHIP_STATUS_DETAIL = gql`
    fragment RelationshipStatusDetail on RelationshipStatus {
        id
        name
        colorBlind
        color
        sortOrder
    }
`;

export const RELATIONSHIP_DETAIL_FULL_FRAGMENT = gql`
    fragment RelationshipDetailFullFragment on Relationship {
        id
        case {
            id
        }
        person {
            ...PersonFullFragment
        }
        facebook
        linkedin
        twitter
        jobTitle
        employer
        salaryRange {
            id
            label
        }
        status {
            ...RelationshipStatusDetail
        }
        isSeen
        isContacted
        ppSearchCount
        ppSearchImported
        ppSearchQuery
        ppSearchPointerHash
    }

    ${PERSON_FUll_FRAGMENT}
    ${RELATIONSHIP_STATUS_DETAIL}
`;

export const RELATIONSHIP_DETAIL_FULL_QUERY = gql`
    query relationshipDetailFull($caseId: Int!, $relationshipId: Int!) {
        relationship(caseId: $caseId, id: $relationshipId) {
            ...RelationshipDetailFullFragment
        }
    }

    ${RELATIONSHIP_DETAIL_FULL_FRAGMENT}
`;

export const RELATIONSHIP_DETAIL_SLIM_FRAGMENT = gql`
    fragment RelationshipDetailSlim on Relationship {
        id
        person {
            id
            ...PersonName
            picture
            gender
            ...PersonBirthday
            title
            createdAt
            updatedAt
        }
        status {
            ...RelationshipStatusDetail
        }
    }

    ${PERSON_BIRTHDAY_FRAGMENT}
    ${PERSON_NAME_FRAGMENT}
    ${RELATIONSHIP_STATUS_DETAIL}
`;

export const RELATIONSHIPS_DETAIL_SLIM_QUERY = gql`
    query relationshipsDetailSlim($caseId: Int!) {
        relationships(caseId: $caseId) {
            ...RelationshipDetailSlim
        }
    }

    ${RELATIONSHIP_DETAIL_SLIM_FRAGMENT}
`;
