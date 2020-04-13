import gql from 'graphql-tag';
import {
    PERSON_BIRTHDAY_FRAGMENT,
    PERSON_NAME_FRAGMENT,
    TELEPHONE_DETAIL_FRAGMENT,
    EMAIL_DETAIL_FRAGMENT,
} from './person';
import { ADDRESS_DETAIL_FRAGMENT } from './address';

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
        person {
            id
            ...PersonName
            picture
            gender
            title
            ...PersonBirthday
            notes
            addresses {
                ...AddressDetail
            }
            telephones {
                ...TelephoneDetail
            }
            emails {
                ...EmailDetail
            }
            dateOfDeath
            isDeceased
            createdAt
            updatedAt
        }
        facebook
        linkedin
        twitter
        case {
            id
        }
        jobTitle
        employer
        salaryRange {
            id
            label
        }
        status {
            ...RelationshipStatusDetail
        }
        ppSearchCount
        ppSearchImported
        ppSearchQuery
        ppSearchPointerHash
    }

    ${PERSON_BIRTHDAY_FRAGMENT}
    ${PERSON_NAME_FRAGMENT}
    ${ADDRESS_DETAIL_FRAGMENT}
    ${TELEPHONE_DETAIL_FRAGMENT}
    ${EMAIL_DETAIL_FRAGMENT}
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
