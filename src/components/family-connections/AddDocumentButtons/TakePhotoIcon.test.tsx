import React from 'react';

import renderer from 'react-test-renderer';

import TakePhotoIcon from './TakePhotoIcon';

describe('TakePhotoIcon component', () => {
    test('renders', () => {
        const tree = renderer.create(<TakePhotoIcon />);
        expect(tree.root.findByType(TakePhotoIcon)).toBeDefined();
    });
});
