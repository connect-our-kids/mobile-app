import React from 'react';
import renderer from 'react-test-renderer';

import PickPhotoButton from './PickPhotoButton.jsx';

describe('<PickPhotoButton />', () => {
    it('selects component', () => {
        const tree = renderer.create(<PickPhotoButton />).toJSON();
        expect(tree.children).toHaveLength(1);
    });
    it('renders correctly', () => {
        const tree = renderer.create(<PickPhotoButton />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
