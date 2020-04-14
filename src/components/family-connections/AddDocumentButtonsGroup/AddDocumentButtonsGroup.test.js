import React from 'react';

import renderer from 'react-test-renderer';

import AddDocumentButtonsGroup from './AddDocumentButtonsGroup';

/**********************************************************/

describe('AddDocumentButtonsGroup component', () => {
    test('renders', () => {
        const tree = renderer.create(<AddDocumentButtonsGroup />).toJSON();
        expect(tree.children).toHaveLength(1);
    });

    test('matches snapshot', () => {
        const tree = renderer.create(<AddDocumentButtonsGroup />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
