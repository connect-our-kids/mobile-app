import React from 'react';
import renderer from 'react-test-renderer';
import LoginWithAuth0 from './LoginWithAuth0';
import { NavigationScreenProp, NavigationState } from 'react-navigation';

type Navigation = NavigationScreenProp<NavigationState>;
/**********************************************************/

describe('LoginWithAuth0 component', () => {
    test('renders', () => {
        const tree = renderer
            .create(<LoginWithAuth0 {...{ navigation: {} as Navigation }} />)
            .toJSON();
        expect(tree?.children).toHaveLength(1);
    });

    test('matches snapshot', () => {
        const tree = renderer
            .create(<LoginWithAuth0 {...{ navigation: {} as Navigation }} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
