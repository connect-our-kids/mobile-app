import React from 'react';

import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import AddEngagementForm, {
    AddEngagementFormEngagementTypes,
} from './AddEngagementForm';
import { NavigationScreenProp, NavigationState } from 'react-navigation';

type Navigation = NavigationScreenProp<NavigationState>;

const mockStore = configureMockStore();
const store = mockStore({
    case: { results: { details: { id: 0 } } },
});

function getProps({
    relationshipId = 0,
    engagementType,
}: {
    caseId?: number;
    relationshipId?: number;
    engagementType: AddEngagementFormEngagementTypes;
}): { navigation: Navigation } {
    return {
        navigation: ({
            getParam: jest.fn((param) => {
                if (param === 'relationshipId') {
                    return relationshipId;
                } else if (param === 'engagementType') {
                    return engagementType;
                } else {
                    throw new Error(`Unhandled param ${param}`);
                }
            }),
        } as unknown) as Navigation,
    };
}

describe('AddEngagementForm component', () => {
    test('renders - note', () => {
        const tree = renderer
            .create(
                <Provider store={store}>
                    <AddEngagementForm
                        {...getProps({ engagementType: 'EngagementNote' })}
                    />
                </Provider>
            )
            .toJSON();
        expect(tree.children).toHaveLength(1);
    });

    test('renders - call', () => {
        const tree = renderer
            .create(
                <Provider store={store}>
                    <AddEngagementForm
                        {...getProps({ engagementType: 'EngagementCall' })}
                    />
                </Provider>
            )
            .toJSON();
        expect(tree.children).toHaveLength(1);
    });

    test('renders - email', () => {
        const tree = renderer
            .create(
                <Provider store={store}>
                    <AddEngagementForm
                        {...getProps({ engagementType: 'EngagementEmail' })}
                    />
                </Provider>
            )
            .toJSON();
        expect(tree.children).toHaveLength(1);
    });

    test('matches snapshot', () => {
        const tree = renderer
            .create(
                <Provider store={store}>
                    <AddEngagementForm
                        {...getProps({ engagementType: 'EngagementNote' })}
                    />
                </Provider>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
