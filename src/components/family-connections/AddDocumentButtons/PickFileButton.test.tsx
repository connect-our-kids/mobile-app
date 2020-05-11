import React from 'react';
import renderer from 'react-test-renderer';

import PickFileButton from './PickFileButton';

describe('test PickFileButton component', () => {
    it('has children', () => {
        const tree = renderer
            .create(
                <PickFileButton
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
