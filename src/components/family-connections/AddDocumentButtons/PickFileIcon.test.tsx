import React from 'react';

import renderer from 'react-test-renderer';

import PickFileIcon from './PickFileIcon';

describe('PickFileIcon component', () => {
    test('renders', () => {
        const tree = renderer.create(<PickFileIcon />);
        expect(tree.root.findByType(PickFileIcon)).toBeDefined();
    });
});
