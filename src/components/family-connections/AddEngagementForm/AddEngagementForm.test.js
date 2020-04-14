import React from 'react';

import renderer from 'react-test-renderer';

import AddEngagementForm from './AddEngagementForm';

/**********************************************************/

describe('AddEngagementForm component', () => {
    test('renders', () => {
        const tree = renderer.create(<AddEngagementForm />).toJSON();
        expect(tree.children).toHaveLength(1);
    });

    test('matches snapshot', () => {
        const tree = renderer.create(<AddEngagementForm />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
