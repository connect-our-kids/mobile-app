import React from 'react';

import renderer from 'react-test-renderer';

import Video from './Video';

describe('Video component', () => {
    test('renders', () => {
        const tree = renderer.create(<Video {...{ uri: 'blah' }} />).toJSON();
        expect(tree?.children?.length).toBeGreaterThan(0);
    });
});
