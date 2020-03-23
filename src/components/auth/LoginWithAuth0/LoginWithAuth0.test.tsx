import React from 'react';
import { Platform, View } from 'react-native';

import renderer from 'react-test-renderer';
import { render, fireEvent } from 'react-native-testing-library';

import LoginWithAuth0 from './LoginWithAuth0';

/**********************************************************/

describe('LoginWithAuth0 component', () => {

    test('renders', () => {
        const tree = renderer.create(<LoginWithAuth0/>).toJSON();
        expect(tree.children).toHaveLength(1);
    });

    test('matches snapshot', () => {
        const tree = renderer.create(<LoginWithAuth0/>).toJSON();
        expect(tree).toMatchSnapshot();
    });

});
