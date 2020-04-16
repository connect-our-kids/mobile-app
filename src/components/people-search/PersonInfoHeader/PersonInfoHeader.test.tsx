import React from 'react';

import renderer from 'react-test-renderer';
import PersonInfoHeader from './PersonInfoHeader';

/**********************************************************/

describe('PersonInfoHeader component', () => {
    test('renders', () => {
        const tree = renderer
            .create(
                <PersonInfoHeader {...{ item: undefined, listItem: false }} />
            )
            .toJSON();
        expect(tree?.children).toHaveLength(1);
    });

    test('matches snapshot', () => {
        const tree = renderer
            .create(
                <PersonInfoHeader {...{ item: undefined, listItem: false }} />
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
