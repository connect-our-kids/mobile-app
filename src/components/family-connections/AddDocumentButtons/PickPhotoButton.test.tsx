import React from 'react';
import renderer from 'react-test-renderer';
import { render, fireEvent } from 'react-native-testing-library';
import { View, Platform } from 'react-native';

import PickPhotoButton from './PickPhotoButton';

if (['android', 'ios'].includes(Platform.OS)) {
    /* current tests */

    describe('<PickPhotoButton />', () => {
        it('selects component', () => {
            const tree = renderer
                .create(
                    <PickPhotoButton
                        {...{
                            afterAccept: (image) => {
                                return;
                            },
                        }}
                    />
                )
                .toJSON();
            expect(tree?.children).toHaveLength(1);
        });

        it('matches snapshot of component', () => {
            const tree = renderer
                .create(
                    <PickPhotoButton
                        {...{
                            afterAccept: (image) => {
                                return;
                            },
                        }}
                    />
                )
                .toJSON();
            expect(tree).toMatchSnapshot();
        });
    });

    describe('onPress fires', () => {
        it('checks if fired', () => {
            const onPressMock = jest.fn();

            const { getByTestId } = render(
                <View>
                    <PickPhotoButton
                        {...{
                            afterAccept: (image) => {
                                return;
                            },
                        }}
                        /*testID={'pick-photo-button'}
                        onPress={onPressMock}*/
                    />
                </View>
            );

            fireEvent.press(getByTestId('pick-photo-button'));
            expect(onPressMock).toHaveBeenCalled();
        });
    });
} else {
    /* nothing to see here... */
}

// const onPressMock = jest.fn();

// const { getByTestId } = render(
//     <View>
//         <TouchableOpacity onPress={onPressMock}>
//             <PickPhotoButton/>
//         </TouchableOpacity>
//     </View>,
// );

// fireEvent.press(getByTestId('componentTest'));
