import React from 'react';
import renderer from 'react-test-renderer';
import RegisterModalsContainer from './RegisterModalsContainer';

/**********************************************************/

describe('RegisterModalsContainer component', () => {
    test('renders', () => {
        const tree = renderer.create(<RegisterModalsContainer />).toJSON();
        expect(tree?.children).toHaveLength(1);
    });

    test('matches snapshot', () => {
        const tree = renderer.create(<RegisterModalsContainer />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
