import React from 'react';
import renderer from 'react-test-renderer';
import ConnectionsLogin from './ConnectionsLogin';

/**********************************************************/

describe('ConnectionsLogin component', () => {
    test('renders', () => {
        const tree = renderer.create(<ConnectionsLogin />).toJSON();
        expect(tree?.children).toHaveLength(1);
    });

    test('matches snapshot', () => {
        const tree = renderer.create(<ConnectionsLogin />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
