import React from 'react';
import renderer from 'react-test-renderer';
import RegisterModalsContainer from './RegisterModalsContainer';

describe('RegisterModalsContainer component', () => {
    test('renders', () => {
        const tree = renderer.create(<RegisterModalsContainer />);
        expect(tree.root.findByType(RegisterModalsContainer)).toBeDefined();
    });
});
