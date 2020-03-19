import React from 'react';
import PickFileButton from './PickFileButton';
import renderer from 'react-test-renderer';
import { View, Button } from 'react-native';
import { render, fireEvent } from 'react-native-testing-library';
import { TouchableOpacity } from 'react-native-gesture-handler';


describe('test PickFileButton component', () => {

    it('renders correctly', () => {
        const tree = renderer
            .create(<PickFileButton/>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('has children', () => {
        const tree = renderer
            .create(<PickFileButton/>).toJSON();
        expect(tree.children).toHaveLength(1);
    });
});

describe('onPress fires', () => {
    it('checks if fired', () => {

        const onPressMock = jest.fn();

        const { getByTestID } = render(
            <View>
                <TouchableOpacity title="fileButton" onPress={onPressMock}>
                    <PickFileButton/>
                </TouchableOpacity>
            </View>,
        );

        fireEvent.press(getByTestID(Button));
        expect(onPressMock).toHaveBeenCalled();
    });
});
