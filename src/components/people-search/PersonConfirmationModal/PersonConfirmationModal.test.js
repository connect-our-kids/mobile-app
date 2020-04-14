import React from 'react';

import renderer from 'react-test-renderer';

import PersonConfirmationModal from './PersonConfirmationModal';

/**********************************************************/

describe('PersonConfirmationModal component', () => {
    test('renders', () => {
        const tree = renderer.create(<PersonConfirmationModal />).toJSON();
        expect(tree.children).toHaveLength(1);
    });

    test('matches snapshot', () => {
        const tree = renderer.create(<PersonConfirmationModal />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
