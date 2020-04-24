import React from 'react';

import renderer from 'react-test-renderer';

import PickPhotoLabel from './PickPhotoLabel';

/**********************************************************/

describe('PickPhotoLabel component', () => {
    test('renders', () => {
        const tree = renderer.create(<PickPhotoLabel />).toJSON();
        expect(tree?.children).toHaveLength(1);
    });

    test('matches snapshot', () => {
        const tree = renderer.create(<PickPhotoLabel />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
