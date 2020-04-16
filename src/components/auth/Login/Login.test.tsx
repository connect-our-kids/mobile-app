import React from 'react';
import renderer from 'react-test-renderer';
import Login from './Login';

/**********************************************************/

describe('Login component', () => {
    test('renders', () => {
        const tree = renderer.create(<Login />).toJSON();
        expect(tree?.children).toHaveLength(1);
    });

    test('matches snapshot', () => {
        const tree = renderer.create(<Login />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
