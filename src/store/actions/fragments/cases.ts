import gql from 'graphql-tag';
import { DataProxy } from 'apollo-cache';
import { PERSON_SLIM_FRAGMENT, PERSON_FUll_FRAGMENT } from './person';
import {
    RELATIONSHIP_DETAIL_SLIM_FRAGMENT,
    RELATIONSHIP_DETAIL_FULL_FRAGMENT,
} from './relationship';
import { ENGAGEMENT_DETAIL_FRAGMENT } from './engagement';
import { EngagementDetail } from '../../../generated/EngagementDetail';
import {
    caseDetailFull,
    caseDetailFullVariables,
} from '../../../generated/caseDetailFull';
import {
    casesDetailSlim,
    casesDetailSlim_cases,
} from '../../../generated/casesDetailSlim';
import { relationshipsDetailSlim_relationships } from '../../../generated/relationshipsDetailSlim';

export const CASE_DETAIL_SLIM_FRAGMENT = gql`
    fragment CaseDetailSlimFragment on Case {
        id
        person {
            ...PersonSlimFragment
        }
        caseFileNumber
        fosterCare
        childStatus {
            id
            name
        }
        caseStatus {
            id
            name
            representsClosure
        }
        team {
            id
            name
        }
        teamId
    }

    ${PERSON_SLIM_FRAGMENT}
`;

export const CASES_DETAIL_SLIM_QUERY = gql`
    query casesDetailSlim {
        cases {
            ...CaseDetailSlimFragment
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
        caseFileNumber
        team {
            id
            name
            email
            picture
            notes
        }
        teamId
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

export const DELETE_ENGAGEMENT_MUTATION = gql`
    mutation deleteEngagementMutation($caseId: Int!, $engagementId: Int!) {
        deleteEngagement(caseId: $caseId, engagementId: $engagementId) {
            ...EngagementDetail
        }
    }

    ${ENGAGEMENT_DETAIL_FRAGMENT}
`;

export const CREATE_RELATIONSHIP_MUTATION = gql`
    mutation createRelationshipMutation(
        $caseId: Int!
        $value: CreateRelationshipInput!
    ) {
        createRelationship(caseId: $caseId, value: $value) {
            ...RelationshipDetailSlim
        }
    }

    ${RELATIONSHIP_DETAIL_SLIM_FRAGMENT}
`;

export const EDIT_RELATIONSHIP_MUTATION = gql`
    mutation editRelationshipMutation(
        $caseId: Int!
        $relationshipId: Int!
        $value: UpdateRelationshipInput!
    ) {
        updateRelationship(
            caseId: $caseId
            relationshipId: $relationshipId
            value: $value
        ) {
            ...RelationshipDetailFullFragment
        }
    }

    ${RELATIONSHIP_DETAIL_FULL_FRAGMENT}
`;

export const DELETE_RELATIONSHIP_MUTATION = gql`
    mutation deleteRelationshipMutation($caseId: Int!, $relationshipId: Int!) {
        deleteRelationship(caseId: $caseId, relationshipId: $relationshipId) {
            ...RelationshipDetailSlim
        }
    }

    ${RELATIONSHIP_DETAIL_SLIM_FRAGMENT}
`;

export function addRelationshipToCache(
    caseId: number,
    relationshipIn: relationshipsDetailSlim_relationships,
    cache: DataProxy
) {
    const caseCache = cache.readQuery<caseDetailFull, caseDetailFullVariables>({
        query: CASE_DETAIL_FULL_QUERY,
        variables: { caseId },
    });
    if (!caseCache) {
        return;
    }
    cache.writeQuery<caseDetailFull, caseDetailFullVariables>({
        query: CASE_DETAIL_FULL_QUERY,
        variables: { caseId },
        data: {
            details: caseCache.details,
            engagements: caseCache.engagements,
            relationships: [relationshipIn, ...caseCache.relationships],
        },
    });
}

export const CREATE_CASE_MUTATION = gql`
    mutation createCaseMutation($value: CreateCaseInput!) {
        createCase(value: $value) {
            ...CaseDetailSlimFragment
        }
    }

    ${CASE_DETAIL_SLIM_FRAGMENT}
`;

export const EDIT_CASE_MUTATION = gql`
    mutation editCaseMutation($caseId: Int!, $value: UpdateCaseInput!) {
        updateCase(caseId: $caseId, value: $value) {
            ...CaseDetailSlimFragment
        }
    }

    ${CASE_DETAIL_SLIM_FRAGMENT}
`;

export function addCaseCache(caseIn: casesDetailSlim_cases, cache: DataProxy) {
    const casesCache = cache.readQuery<casesDetailSlim>({
        query: CASES_DETAIL_SLIM_QUERY,
    });
    if (!casesCache) {
        return;
    }
    cache.writeQuery<casesDetailSlim>({
        query: CASES_DETAIL_SLIM_QUERY,
        data: {
            cases: [caseIn, ...casesCache.cases],
        },
    });
}

export const DELETE_CASE_MUTATION = gql`
    mutation deleteCaseMutation($caseId: Int!) {
        deleteCase(caseId: $caseId) {
            ...CaseDetailSlimFragment
        }
    }

    ${CASE_DETAIL_SLIM_FRAGMENT}
`;

export function addEngagementCache(
    caseId: number,
    engagement: EngagementDetail,
    cache: DataProxy
) {
    const caseCache = cache.readQuery<caseDetailFull, caseDetailFullVariables>({
        query: CASE_DETAIL_FULL_QUERY,
        variables: { caseId },
    });
    if (!caseCache) {
        return;
    }
    cache.writeQuery<caseDetailFull, caseDetailFullVariables>({
        query: CASE_DETAIL_FULL_QUERY,
        variables: { caseId },
        data: {
            ...caseCache,
            engagements: [engagement, ...caseCache.engagements],
        },
    });
}

export function deleteEngagementCache(
    caseId: number,
    engagement: EngagementDetail,
    cache: DataProxy
) {
    const caseCache = cache.readQuery<caseDetailFull, caseDetailFullVariables>({
        query: CASE_DETAIL_FULL_QUERY,
        variables: { caseId },
    });
    if (!caseCache) {
        return;
    }
    cache.writeQuery<caseDetailFull, caseDetailFullVariables>({
        query: CASE_DETAIL_FULL_QUERY,
        variables: { caseId },
        data: {
            ...caseCache,
            engagements: caseCache.engagements.filter(
                (e) => e.id !== engagement.id
            ),
        },
    });
}

export function deleteRelationshipCache({
    caseId,
    relationshipId,
    cache,
}: {
    caseId: number;
    relationshipId: number;
    cache: DataProxy;
}) {
    const caseCache = cache.readQuery<caseDetailFull, caseDetailFullVariables>({
        query: CASE_DETAIL_FULL_QUERY,
        variables: { caseId },
    });
    if (!caseCache) {
        return;
    }
    cache.writeQuery<caseDetailFull, caseDetailFullVariables>({
        query: CASE_DETAIL_FULL_QUERY,
        variables: { caseId },
        data: {
            ...caseCache,
            relationships: caseCache.relationships.filter(
                (e) => e.id !== relationshipId
            ),
        },
    });
}

export function deleteCaseFromCache({
    caseId,
    cache,
}: {
    caseId: number;
    cache: DataProxy;
}) {
    const caseCache = cache.readQuery<casesDetailSlim>({
        query: CASES_DETAIL_SLIM_QUERY,
    });
    if (!caseCache) {
        return;
    }
    cache.writeQuery<casesDetailSlim>({
        query: CASES_DETAIL_SLIM_QUERY,
        data: {
            cases: caseCache.cases.filter((e) => e.id !== caseId),
        },
    });
}
