import React from 'react';
import renderer from 'react-test-renderer';
import { render, fireEvent } from 'react-native-testing-library';
import { View, TouchableOpacity } from 'react-native';

import TakePhotoButton from './TakePhotoButton.jsx';

describe('<TakePhotoButton />', () => {
    it('selects component', () => {
        const tree = renderer.create(<TakePhotoButton />).toJSON();
        expect(tree.children).toHaveLength(1);
    });
    it('Matches snapshot of component', () => {
        const tree = renderer.create(<TakePhotoButton />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

const onPressMock = jest.fn();

const { getByTestId } = render(
    <View>
        <TouchableOpacity onPress={onPressMock}>
            <TakePhotoButton/>
        </TouchableOpacity>
    </View>,
);

fireEvent.press(getByTestId('button'));
