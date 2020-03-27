import React from 'react';
import renderer from 'react-test-renderer';
import { View, Button, Platform } from 'react-native';
import { render, fireEvent } from 'react-native-testing-library';
import { TouchableOpacity } from 'react-native-gesture-handler';

import PickFileButton from './PickFileButton';

if ([ 'android', 'ios' ].includes(Platform.OS)) {

    /* current tests */
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

            const { getByTestId } = render(
                <View>
                    <PickFileButton
                        testID={'pick-file-button'}
                        onPress={onPressMock}
                    />
                </View>,
            );

            fireEvent.press(getByTestId('pick-file-button'));
            expect(onPressMock).toHaveBeenCalled();
        });

    });

}
else {

    /* nothing to see here... */

}
