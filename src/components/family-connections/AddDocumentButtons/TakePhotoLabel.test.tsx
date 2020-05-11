import React from 'react';

import renderer from 'react-test-renderer';

import TakePhotoLabel from './TakePhotoLabel';

describe('TakePhotoLabel component', () => {
    test('renders', () => {
        const tree = renderer.create(<TakePhotoLabel />);
        expect(tree.root.findByType(TakePhotoLabel)).toBeDefined();
    });
});
