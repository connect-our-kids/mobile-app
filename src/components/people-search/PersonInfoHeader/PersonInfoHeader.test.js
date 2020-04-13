import React from 'react';
import { Platform, View } from 'react-native';

import renderer from 'react-test-renderer';
import { render, fireEvent } from 'react-native-testing-library';

import PersonInfoHeader from './PersonInfoHeader';

/**********************************************************/

describe('PersonInfoHeader component', () => {
    test('renders', () => {
        const tree = renderer.create(<PersonInfoHeader />).toJSON();
        expect(tree.children).toHaveLength(1);
    });

    test('matches snapshot', () => {
        const tree = renderer.create(<PersonInfoHeader />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
