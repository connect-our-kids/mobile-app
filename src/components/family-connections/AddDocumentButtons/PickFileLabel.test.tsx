import React from 'react';

import renderer from 'react-test-renderer';

import PickFileLabel from './PickFileLabel';

/**********************************************************/

describe('PickFileLabel component', () => {
    test('renders', () => {
        const tree = renderer.create(<PickFileLabel />).toJSON();
        expect(tree?.children).toHaveLength(1);
    });

    test('matches snapshot', () => {
        const tree = renderer.create(<PickFileLabel />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
