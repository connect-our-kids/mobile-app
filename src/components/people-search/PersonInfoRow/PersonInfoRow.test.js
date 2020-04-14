import React from 'react';

import renderer from 'react-test-renderer';

import PersonInfoRow from './PersonInfoRow';

/**********************************************************/

describe('PersonInfoRow component', () => {
    test('renders', () => {
        const tree = renderer.create(<PersonInfoRow />).toJSON();
        expect(tree.children).toHaveLength(1);
    });

    test('matches snapshot', () => {
        const tree = renderer.create(<PersonInfoRow />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
