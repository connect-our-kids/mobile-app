import React from 'react';

import renderer from 'react-test-renderer';

import AddDocumentForm from './AddDocumentForm';

/**********************************************************/

describe('AddDocumentForm component', () => {
    test('renders', () => {
        const tree = renderer.create(<AddDocumentForm />).toJSON();
        expect(tree.children).toHaveLength(1);
    });

    test('matches snapshot', () => {
        const tree = renderer.create(<AddDocumentForm />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
