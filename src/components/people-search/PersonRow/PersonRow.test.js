import React from 'react';

import renderer from 'react-test-renderer';

import PersonRow from './PersonRow';

/**********************************************************/

describe('PersonRow component', () => {
    test('renders', () => {
        const tree = renderer.create(<PersonRow />).toJSON();
        expect(tree.children).toHaveLength(1);
    });

    test('matches snapshot', () => {
        const tree = renderer.create(<PersonRow />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
