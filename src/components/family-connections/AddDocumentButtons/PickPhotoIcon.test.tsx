import React from 'react';

import renderer from 'react-test-renderer';

import PickPhotoIcon from './PickPhotoIcon';

describe('PickPhotoIcon component', () => {
    test('renders', () => {
        const tree = renderer.create(<PickPhotoIcon />);
        expect(tree.root.findByType(PickPhotoIcon)).toBeDefined();
    });
});
