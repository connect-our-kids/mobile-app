import React from 'react';
import PickFileButton from './PickFileButton';
import renderer from 'react-test-renderer';


it('renders correctly', () => {
    const tree = renderer
        .create(<PickFileButton/>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});
