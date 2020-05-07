import gql from 'graphql-tag';

export const USER_FULL_FRAGMENT = gql`
    fragment CaseRoleFragment on CaseRole {
        id
        caseId
        role
    }

    fragment TeamFragment on Team {
        id
        name
        picture
        email
    }

    fragment UserFullFragment on User {
        id
        sub
        email
        firstName
        lastName
        name
        picture
        isSiteAdmin
        userTeam {
            team {
                ...TeamFragment
            }
            role
        }
        caseRoles {
            ...CaseRoleFragment
        }
    }
`;

export const ME_QUERY = gql`
    query meQuery {
        me {
            ...UserFullFragment
        }
    }

    ${USER_FULL_FRAGMENT}
`;
