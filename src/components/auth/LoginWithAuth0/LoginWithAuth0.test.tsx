import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import LoginWithAuth0 from './LoginWithAuth0';
import { NavigationScreenProp, NavigationState } from 'react-navigation';

type Navigation = NavigationScreenProp<NavigationState>;

const mockStore = configureMockStore();
const store = mockStore({
    auth: {},
    me: {},
});

describe('LoginWithAuth0 component', () => {
    test('renders', () => {
        const tree = renderer
            .create(
                <Provider store={store}>
                    <LoginWithAuth0 {...{ navigation: {} as Navigation }} />
                </Provider>
            )
            .toJSON();
        expect(tree?.children?.length).toBeGreaterThan(0);
    });
});
