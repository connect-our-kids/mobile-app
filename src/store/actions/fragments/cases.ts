import gql from 'graphql-tag';
import { DataProxy } from 'apollo-cache';
import { PERSON_SLIM_FRAGMENT, PERSON_FUll_FRAGMENT } from './person';
import { RELATIONSHIP_DETAIL_SLIM_FRAGMENT } from './relationship';
import { ENGAGEMENT_DETAIL_FRAGMENT, ENGAGEMENTS_QUERY } from './engagement';
import { EngagementDetail } from '../../../generated/EngagementDetail';
import {
    engagements as engagementsType,
    engagementsVariables,
} from '../../../generated/engagements';
import {
    caseDetailFull,
    caseDetailFullVariables,
} from '../../../generated/caseDetailFull';
import {
    casesDetailSlim,
    casesDetailSlim_cases,
} from '../../../generated/casesDetailSlim';

export const CASE_DETAIL_SLIM_FRAGMENT = gql`
    fragment CaseDetailSlimFragment on Case {
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

export const CREATE_CASE_MUTATION = gql`
    mutation createCaseMutation($value: CreateCaseInput!) {
        createCase(value: $value) {
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
    const engagements = cache.readQuery<engagementsType, engagementsVariables>({
        query: ENGAGEMENTS_QUERY,
        variables: { caseId },
    });
    if (!engagements) {
        return;
    }
    cache.writeQuery<engagementsType, engagementsVariables>({
        query: ENGAGEMENTS_QUERY,
        variables: { caseId },
        data: {
            engagements: engagements.engagements.filter(
                (e) => e.id !== engagement.id
            ),
        },
    });
}
