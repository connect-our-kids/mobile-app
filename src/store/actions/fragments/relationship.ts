import { DataProxy } from 'apollo-cache';
import gql from 'graphql-tag';
import { PERSON_BIRTHDAY_FRAGMENT, PERSON_NAME_FRAGMENT } from './person';
import { ADDRESS_DETAIL_FRAGMENT } from './address';

import { RelationshipDetail } from '../../../generated/RelationshipDetail';
import { relationshipsDetailVariables, relationshipsDetail } from '../../../generated/relationshipsDetail';

export const TELEPHONE_DETAIL = gql`
  fragment TelephoneDetail on PersonTelephone {
    isVerified
    telephone
  }
`;

export const EMAIL_DETAIL = gql`
  fragment EmailDetail on PersonEmail {
    isVerified
    email
  }
`;

export const RELATIONSHIP_DETAIL_FRAGMENT = gql`
  fragment RelationshipDetail on Relationship {
    id
    person {
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
      id
      name
      color
    }
    ppSearchCount
    ppSearchImported
    ppSearchQuery
    ppSearchPointerHash
  }

  ${PERSON_BIRTHDAY_FRAGMENT}
  ${PERSON_NAME_FRAGMENT}
  ${ADDRESS_DETAIL_FRAGMENT}
  ${TELEPHONE_DETAIL}
  ${EMAIL_DETAIL}
`;

export const RELATIONSHIPS_DETAIL_QUERY = gql`
  query relationshipsDetail($caseId: Int!) {
    relationships(caseId: $caseId) {
      ...RelationshipDetail
    }
  }

  ${RELATIONSHIP_DETAIL_FRAGMENT}
`;

export function deleteRelationshipCache(caseId: number, relationship: RelationshipDetail, cache: DataProxy) {
  const relationships = cache.readQuery<relationshipsDetail, relationshipsDetailVariables>({
    query: RELATIONSHIPS_DETAIL_QUERY,
    variables: { caseId },
  });
  if (!relationships) return;
  cache.writeQuery<relationshipsDetail, relationshipsDetailVariables>({
    query: RELATIONSHIPS_DETAIL_QUERY,
    variables: { caseId },
    data: { relationships: relationships.relationships.filter(r => r.id !== relationship.id) },
  });
}

export function addRelationshipCache(caseId: number, relationship: RelationshipDetail, cache: DataProxy) {
  const relationships = cache.readQuery<relationshipsDetail, relationshipsDetailVariables>({
    query: RELATIONSHIPS_DETAIL_QUERY,
    variables: { caseId },
  });
  if (!relationships) return;
  cache.writeQuery<relationshipsDetail, relationshipsDetailVariables>({
    query: RELATIONSHIPS_DETAIL_QUERY,
    variables: { caseId },
    data: { relationships: [relationship, ...relationships.relationships] },
  });
}
