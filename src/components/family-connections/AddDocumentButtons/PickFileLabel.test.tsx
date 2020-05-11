import React from 'react';

import renderer from 'react-test-renderer';

import PickFileLabel from './PickFileLabel';

describe('PickFileLabel component', () => {
    test('renders', () => {
        const tree = renderer.create(<PickFileLabel />);
        expect(tree.root.findByType(PickFileLabel)).toBeDefined();
    });
});
