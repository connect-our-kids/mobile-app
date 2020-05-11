import React from 'react';
import renderer from 'react-test-renderer';
import ConnectionsLogin from './ConnectionsLogin';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { AuthState } from '../../../store/reducers/authReducer';
import { MeState } from '../../../store/reducers/meReducer';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/** The tested component expects case.results.details.id
 * to be in the redux store. This mock store has exactly
 * that.
 */
const mockStore = configureMockStore();
const state: { auth: AuthState; me: MeState } = {
    auth: {
        isLoggedIn: false,
        isLoggingIn: false,
        isLoggingOut: false,
        modalVisible: false,
        videoAgree: false,
        videoVisible: false,
        loggedOutSuccess: false,
        loggedOutfail: false,
    },
    me: { isLoading: false },
};
const store = mockStore(state);

describe('ConnectionsLogin component', () => {
    test('renders', () => {
        const tree = renderer.create(
            <SafeAreaProvider
                initialSafeAreaInsets={{ top: 1, left: 2, right: 3, bottom: 4 }}
            >
                <Provider store={store}>
                    <ConnectionsLogin />
                </Provider>
            </SafeAreaProvider>
        );
        expect(tree).toBeDefined();
        expect(tree.toJSON()?.children?.length).toBeGreaterThan(0);
    });
});
