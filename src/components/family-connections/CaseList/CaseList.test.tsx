import React from 'react';
import renderer from 'react-test-renderer';
import CaseList from './CaseList';
import { RelationshipDetailSlim } from '../../../generated/RelationshipDetailSlim';

const props: {
    relationship: RelationshipDetailSlim;
    pressed?: () => void;
    documentError?: string;
} = {
    relationship: {
        __typename: 'Relationship',
        id: 0,
        person: {
            __typename: 'Person',
            firstName: null,
            middleName: null,
            lastName: null,
            fullName: '',
            picture: null,
            id: 0,
            suffix: null,
            gender: '',
            title: null,
            birthMonth: null,
            birthYear: null,
            birthdayRaw: null,
            createdAt: null,
            dayOfBirth: null,
            updatedAt: null,
        },
        status: null,
    },
};
describe('CaseList component', () => {
    test('renders', () => {
        const tree = renderer.create(<CaseList {...props} />);
        expect(tree.root.findByType(CaseList)).toBeDefined();
    });
});
