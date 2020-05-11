import React from 'react';

import renderer from 'react-test-renderer';
import PersonInfoHeader from './PersonInfoHeader';

describe('PersonInfoHeader component', () => {
    test('renders', () => {
        const tree = renderer
            .create(
                <PersonInfoHeader
                    {...{ item: { images: undefined }, listItem: false }}
                />
            )
            .toJSON();
        expect(tree?.children?.length).toBeGreaterThan(0);
    });
});
