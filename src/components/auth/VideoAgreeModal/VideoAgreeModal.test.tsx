import React from 'react';

import renderer from 'react-test-renderer';

import VideoAgreeModal from './VideoAgreeModal';

describe('VideoAgreeModal component', () => {
    test('renders', () => {
        const tree = renderer.create(<VideoAgreeModal />);
        expect(tree.root.findByType(VideoAgreeModal)).toBeDefined();
    });
});
