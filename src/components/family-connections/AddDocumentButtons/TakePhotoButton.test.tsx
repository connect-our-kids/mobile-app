import React from 'react';
import renderer from 'react-test-renderer';
import { render, fireEvent } from 'react-native-testing-library';
import { View, Platform } from 'react-native';

import TakePhotoButton from './TakePhotoButton';

if (['android', 'ios'].includes(Platform.OS)) {
    /* current tests */

    describe('<TakePhotoButton />', () => {
        it('selects component', () => {
            const tree = renderer
                .create(
                    <TakePhotoButton
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

        it('Matches snapshot of component', () => {
            const tree = renderer
                .create(
                    <TakePhotoButton
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
                    <TakePhotoButton
                        {...{
                            afterAccept: (image) => {
                                return;
                            },
                        }}
                        /*testID={'take-photo-button'}
                        onPress={onPressMock}*/
                    />
                </View>
            );

            fireEvent.press(getByTestId('take-photo-button'));
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
//             <TakePhotoButton/>
//         </TouchableOpacity>
//     </View>,
// );

// fireEvent.press(getByTestId('button'));
