import React from 'react';

import renderer from 'react-test-renderer';

import Loader from './Loader';

/**********************************************************/

describe('Loader component', () => {
    test('renders', () => {
        const tree = renderer.create(<Loader />).toJSON();
        expect(tree?.children).toHaveLength(1);
    });

    test('matches snapshot', () => {
        const tree = renderer.create(<Loader />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
