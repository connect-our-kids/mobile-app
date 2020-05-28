/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import AddPersonHeader from './AddPersonHeader';

const mockStore = configureMockStore();
const store = mockStore({
    me: { case: { results: { userTeam: { role: 'EDITOR' } } } },
});

const createTestProps = (props: Record<string, any>) => ({
    navigation: {
        navigate: jest.fn(),
    },
    ...props,
});

describe('AddPersonHeader component', () => {
    test('renders upon passing in myRole state', () => {
        let props: any;
        beforeEach(() => {
            props = createTestProps({});
            const tree = renderer
                .create(
                    <Provider store={store}>
                        <AddPersonHeader {...props} />
                    </Provider>
                )
                .toJSON();
            expect(tree?.children).toHaveLength(1);
        });
    });
});
