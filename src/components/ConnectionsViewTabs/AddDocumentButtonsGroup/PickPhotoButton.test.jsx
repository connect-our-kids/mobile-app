import React from 'react';
import renderer from 'react-test-renderer';
import { render, fireEvent } from 'react-native-testing-library';
import { View, TouchableOpacity } from 'react-native';

import PickPhotoButton from './PickPhotoButton.jsx';

describe('<PickPhotoButton />', () => {
    it('selects component', () => {
        const tree = renderer.create(<PickPhotoButton />).toJSON();
        expect(tree.children).toHaveLength(1);
    });
    it('matches snapshot of component', () => {
        const tree = renderer.create(<PickPhotoButton />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

const onPressMock = jest.fn();

const { getByTestId } = render(
    <View>
        <TouchableOpacity onPress={onPressMock} testID="componentTest">
            <PickPhotoButton />
        </TouchableOpacity>
    </View>,
);

fireEvent.press(getByTestId('componentTest'));
