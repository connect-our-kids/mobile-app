import React from 'react';

import renderer from 'react-test-renderer';

import VideoModal from './VideoModal';

describe('VideoModal component', () => {
    test('renders', () => {
        const tree = renderer.create(<VideoModal />);
        expect(tree.root.findByType(VideoModal)).toBeDefined();
    });
});
