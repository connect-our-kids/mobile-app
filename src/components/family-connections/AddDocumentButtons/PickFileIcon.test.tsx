import React from 'react';

import renderer from 'react-test-renderer';

import PickFileIcon from './PickFileIcon';

/**********************************************************/

describe('PickFileIcon component', () => {
    test('renders', () => {
        const tree = renderer.create(<PickFileIcon />).toJSON();
        expect(tree?.children).toHaveLength(1);
    });

    test('matches snapshot', () => {
        const tree = renderer.create(<PickFileIcon />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
