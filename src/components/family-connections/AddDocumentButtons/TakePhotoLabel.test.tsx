import React from 'react';

import renderer from 'react-test-renderer';

import TakePhotoLabel from './TakePhotoLabel';

/**********************************************************/

describe('TakePhotoLabel component', () => {
    test('renders', () => {
        const tree = renderer.create(<TakePhotoLabel />).toJSON();
        expect(tree?.children).toHaveLength(1);
    });

    test('matches snapshot', () => {
        const tree = renderer.create(<TakePhotoLabel />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
