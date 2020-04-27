import gql from 'graphql-tag';

export const STATIC_DATA_QUERY = gql`
    query staticDataQuery($teamId: Int!) {
        schema {
            caseStatus {
                id
                name
                representsClosure
                sortOrder
            }
            childStatus {
                id
                name
                sortOrder
            }
            relationshipStatus {
                id
                name
                colorBlind
                color
                sortOrder
            }
            salaryRange {
                id
                label
                values
            }
            gender(teamId: $teamId)
        }
        addressCountries {
            id
            name
            countryCode
        }
        # 233 corresponds to USA
        addressStates(countryId: 233) {
            id
            name
            stateCode
        }
    }
`;
