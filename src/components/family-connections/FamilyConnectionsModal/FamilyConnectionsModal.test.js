import React from 'react';

import renderer from 'react-test-renderer';

import FamilyConnectionsModal from './FamilyConnectionsModal';

/**********************************************************/

describe('FamilyConnectionsModal component', () => {
    test('renders', () => {
        const tree = renderer.create(<FamilyConnectionsModal />).toJSON();
        expect(tree.children).toHaveLength(1);
    });

    test('matches snapshot', () => {
        const tree = renderer.create(<FamilyConnectionsModal />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
