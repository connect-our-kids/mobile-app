import React from 'react';
import { Platform, View } from 'react-native';

import renderer from 'react-test-renderer';
import { render, fireEvent } from 'react-native-testing-library';

import PersonConfirmationModal from './PersonConfirmationModal';

/**********************************************************/

describe('PersonConfirmationModal component', () => {

    test('renders', () => {
        const tree = renderer.create(<PersonConfirmationModal/>).toJSON();
        expect(tree.children).toHaveLength(1);
    });

    test('matches snapshot', () => {
        const tree = renderer.create(<PersonConfirmationModal/>).toJSON();
        expect(tree).toMatchSnapshot();
    });

});
