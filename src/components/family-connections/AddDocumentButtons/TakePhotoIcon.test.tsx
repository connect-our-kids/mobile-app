import React from 'react';

import renderer from 'react-test-renderer';

import TakePhotoIcon from './TakePhotoIcon';

/**********************************************************/

describe('TakePhotoIcon component', () => {
    test('renders', () => {
        const tree = renderer.create(<TakePhotoIcon />).toJSON();
        expect(tree?.children).toHaveLength(1);
    });

    test('matches snapshot', () => {
        const tree = renderer.create(<TakePhotoIcon />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
