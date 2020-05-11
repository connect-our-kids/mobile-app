import React from 'react';
import renderer from 'react-test-renderer';
import PickPhotoButton from './PickPhotoButton';

describe('<PickPhotoButton />', () => {
    it('selects component', () => {
        const tree = renderer
            .create(
                <PickPhotoButton
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
