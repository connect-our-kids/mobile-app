import React, { useDebugValue } from 'react';

import renderer from 'react-test-renderer';

import { Documents } from './ConnectionsViewTabs';
import { engagements_engagements_EngagementDocument } from '../../../generated/engagements';

/**********************************************************/

describe('Document component', () => {
    const testDocument = {
        __typename: 'EngagementDocument',
        attachment: '',
        id: 0,
        notes: '',
        case: {
            __typename: 'Case',
            id: 0,
            person: { __typename: 'Person', fullName: '', picture: '' },
        },
        createdBy: undefined,
        createdAt: undefined,
        relationship: undefined,
        isPublic: true,
        originalFileName: '',
        thumbnail: '',
        title: '',
    };

    test('renders', () => {
        const tree = renderer
            .create(<Documents document={testDocument} />)
            .toJSON();
        expect(tree.children).toHaveLength(1);
    });

    test('matches snapshot', () => {
        const tree = renderer
            .create(<Documents document={testDocument} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
