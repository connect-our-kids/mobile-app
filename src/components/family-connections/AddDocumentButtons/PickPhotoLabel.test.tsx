import React from 'react';

import renderer from 'react-test-renderer';

import PickPhotoLabel from './PickPhotoLabel';

describe('PickPhotoLabel component', () => {
    test('renders', () => {
        const tree = renderer.create(<PickPhotoLabel />);
        expect(tree.root.findByType(PickPhotoLabel)).toBeDefined();
    });
});
