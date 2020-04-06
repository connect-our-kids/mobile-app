import { DataProxy } from 'apollo-cache';
import gql from 'graphql-tag';
import { CreateEngagementDocument } from '../../../generated/globalTypes';
import { engagementsVariables } from '../../../generated/engagements';
import { EngagementDetail } from '../../../generated/EngagementDetail';

const COMMON_FRAGMENT = gql`
    fragment EngagementCommonDetail on EngagementCommon {
        id
        createdAt
        createdBy {
            id
            name
            picture
            email
        }
        case {
            id
            person {
                id
                fullName
                picture
            }
        }
        relationship {
            id
            person {
                id
                fullName
                picture
            }
        }
        isPublic
        notes
    }
`;

const DOCUMENT_FRAGMENT = gql`
    fragment EngagementDocumentDetail on EngagementDocument {
        ...EngagementCommonDetail
        title
        originalFileName
        attachment
        thumbnail
    }
`;

const CALL_FRAGMENT = gql`
    fragment EngagementCallDetail on EngagementCall {
        ...EngagementCommonDetail
    }
`;

const EMAIL_FRAGMENT = gql`
    fragment EngagementEmailDetail on EngagementEmail {
        ...EngagementCommonDetail
        subject
    }
`;

const NOTE_FRAGMENT = gql`
    fragment EngagementNoteDetail on EngagementNote {
        ...EngagementCommonDetail
    }
`;

const REMINDER_FRAGMENT = gql`
    fragment EngagementReminderDetail on EngagementReminder {
        ...EngagementCommonDetail
    }
`;

export const ENGAGEMENT_DETAIL_FRAGMENT = gql`
    fragment EngagementDetail on Engagement {
        __typename
        ... on EngagementCall {
            ...EngagementCallDetail
        }
        ... on EngagementEmail {
            ...EngagementEmailDetail
        }
        ... on EngagementNote {
            ...EngagementNoteDetail
        }
        ... on EngagementDocument {
            ...EngagementDocumentDetail
        }
        ... on EngagementReminder {
            ...EngagementReminderDetail
        }
    }

    ${CALL_FRAGMENT}
    ${EMAIL_FRAGMENT}
    ${NOTE_FRAGMENT}
    ${DOCUMENT_FRAGMENT}
    ${REMINDER_FRAGMENT}
    ${COMMON_FRAGMENT}
`;

export const ENGAGEMENTS_QUERY = gql`
    query engagements($caseId: Int!) {
        engagements(caseId: $caseId) {
            ...EngagementDetail
        }
    }
    ${ENGAGEMENT_DETAIL_FRAGMENT}
`;

export const ENGAGEMENTS_COUNTS_QUERY = gql`
    query engagementCounts($caseId: Int!) {
        engagementCounts(caseId: $caseId) {
            type
            count
        }
    }
`;

export const CREATE_DOC_ENGAGEMENT_MUTATION = gql`
    mutation createEngagementDocumentMutation(
        $caseId: Int!
        $value: CreateEngagementDocument!
    ) {
        createEngagementDocument(caseId: $caseId, value: $value) {
            ...EngagementDetail
        }
    }
    ${ENGAGEMENT_DETAIL_FRAGMENT}
`;

export function deleteEngagementCache(
    caseId: number,
    engagement: EngagementDetail,
    cache: DataProxy
) {
    const engagements = cache.readQuery<engagements, engagementsVariables>({
        query: ENGAGEMENTS_QUERY,
        variables: { caseId },
    });
    if (!engagements) {
        return;
    }
    cache.writeQuery<engagements, engagementsVariables>({
        query: ENGAGEMENTS_QUERY,
        variables: { caseId },
        data: {
            engagements: engagements.engagements.filter(
                (e) => e.id !== engagement.id
            ),
        },
    });
}

export function addEngagementCache(
    caseId: number,
    engagement: EngagementDetail,
    cache: DataProxy
) {
    const engagements = cache.readQuery<engagements, engagementsVariables>({
        query: ENGAGEMENTS_QUERY,
        variables: { caseId },
    });
    if (!engagements) {
        return;
    }
    cache.writeQuery<engagements, engagementsVariables>({
        query: ENGAGEMENTS_QUERY,
        variables: { caseId },
        data: { engagements: [engagement, ...engagements.engagements] },
    });
}
