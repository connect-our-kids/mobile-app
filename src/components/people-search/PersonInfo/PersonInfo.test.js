import React from 'react';

import renderer from 'react-test-renderer';

import PersonInfo from './PersonInfo';

/**********************************************************/

describe('PersonInfo component', () => {
    test('renders', () => {
        const tree = renderer.create(<PersonInfo />).toJSON();
        expect(tree.children).toHaveLength(1);
    });

    test('matches snapshot', () => {
        const tree = renderer.create(<PersonInfo />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
