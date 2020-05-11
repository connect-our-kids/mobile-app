import React from 'react';
import renderer from 'react-test-renderer';
import SocialWorkerModal from './SocialWorkerModal';

describe('SocialWorkerModal component', () => {
    test('renders', () => {
        const tree = renderer.create(<SocialWorkerModal />);
        expect(tree.root.findByType(SocialWorkerModal)).toBeDefined();
    });
});
