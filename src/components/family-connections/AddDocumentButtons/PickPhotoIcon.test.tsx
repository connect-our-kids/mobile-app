import React from 'react';

import renderer from 'react-test-renderer';

import PickPhotoIcon from './PickPhotoIcon';

/**********************************************************/

describe('PickPhotoIcon component', () => {
    test('renders', () => {
        const tree = renderer.create(<PickPhotoIcon />).toJSON();
        expect(tree?.children).toHaveLength(1);
    });

    test('matches snapshot', () => {
        const tree = renderer.create(<PickPhotoIcon />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
