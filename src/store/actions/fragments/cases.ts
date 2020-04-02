import gql from 'graphql-tag';
import { PERSON_BIRTHDAY_FRAGMENT, PERSON_NAME_FRAGMENT } from './person';
import { ADDRESS_DETAIL_FRAGMENT } from './address';

export const CASE_DETAIL_FRAGMENT = gql`
  fragment CaseDetail on Case {
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

  ${PERSON_BIRTHDAY_FRAGMENT}
  ${PERSON_NAME_FRAGMENT}
  ${ADDRESS_DETAIL_FRAGMENT}
`;

export const CASES_DETAIL_QUERY = gql`
  query casesDetail {
    cases {
      ...CaseDetail
    }
  }

  ${CASE_DETAIL_FRAGMENT}
`;

export const CASE_DETAIL_QUERY = gql`
  query caseDetails($caseId: Int!) {
    case(caseId: $caseId) {
      ...CaseDetail
    }
  }

  ${CASE_DETAIL_FRAGMENT}
`;
