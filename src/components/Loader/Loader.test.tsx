import React from 'react';

import renderer from 'react-test-renderer';

import Loader from './Loader';

describe('Loader component', () => {
    test('renders', () => {
        const tree = renderer.create(<Loader />);
        expect(tree.root.findByType(Loader)).toBeDefined();
    });
});
