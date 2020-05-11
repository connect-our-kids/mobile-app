import React from 'react';
import renderer from 'react-test-renderer';
import TakePhotoButton from './TakePhotoButton';

describe('<TakePhotoButton />', () => {
    it('selects component', () => {
        const tree = renderer
            .create(
                <TakePhotoButton
                    {...{
                        afterAccept: () => {
                            return;
                        },
                    }}
                />
            )
            .toJSON();
        expect(tree?.children?.length).toBeGreaterThan(0);
    });
});
