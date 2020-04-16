import React from 'react';

import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import AddEngagementForm, {
    AddEngagementFormEngagementTypes,
} from './AddEngagementForm';
import { NavigationScreenProp, NavigationState } from 'react-navigation';

type Navigation = NavigationScreenProp<NavigationState>;

/** The tested component expects case.results.details.id
 * to be in the redux store. This mock store has exactly
 * that.
 */
const mockStore = configureMockStore();
const store = mockStore({
    case: { results: { details: { id: 0 } } },
});

/**
 * Helper function to create the necessary props to pass
 * to the component. In this case we need to mock the React
 * navigation type so that when the tested component calls
 * navigation.getParams('paramName') it will get what it
 * expects.
 * @param param0 relationshipId and engagementType that are
 * expected by the component to be in navigation parameters
 */
function getProps({
    relationshipId = 0,
    engagementType,
}: {
    relationshipId?: number;
    engagementType: AddEngagementFormEngagementTypes;
}): { navigation: Navigation } {
    return {
        navigation: ({
            // jest.fn creates a mock function with the
            // following implementation that the tested
            // component can call exactly as it expects
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

/**
 * These are tests for the AddEngagementForm.tsx component. This component
 * uses the Connect from Redux (See https://react-redux.js.org/api/connect)
 * In order to test it we need to provide navigation inputs and state as
 * it expects them. You can see in the tests below we have wrapped the component
 * with a <Provider store={store}>. This provides a mock redux store for
 * connect to pull the required state. Two component parameters are passed
 * when navigating to the page.
 *
 * Note. If the tested component does not use connect then you do not need
 * to wrap the component in <Provider...>. You can simply pass the necessary
 * parameters into the component.
 */
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
        expect(tree?.children).toHaveLength(1);
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
        expect(tree?.children).toHaveLength(1);
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
        expect(tree?.children).toHaveLength(1);
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
