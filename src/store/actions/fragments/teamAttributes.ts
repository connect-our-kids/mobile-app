import gql from 'graphql-tag';

export const TEAM_ATTRIBUTE_DETAIL = gql`

    fragment TeamAttributeDetail on TeamAttribute {
      id
      name
      type
      disabled
      order
      defaultValue
      options
    }
`;

export const TEAM_ATTRIBUTES_QUERY = gql`
  query getTeamAttributes($teamId: Int!) {
    teamAttributes(teamId: $teamId) {
      ...TeamAttributeDetail
    }
  }

  ${TEAM_ATTRIBUTE_DETAIL}
`;
// fragment TeamFullFragment on Team {
//   id
//   createdAt
//   updatedAt
//   createdBy
//   modifiedBy
//   name
//   email
//   picture
//   notes
//   attributes {
//     ...TeamAttribute
//   }
// }
