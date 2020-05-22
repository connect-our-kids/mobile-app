/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import AddCaseScreen from './AddCaseScreen';

const mockStore = configureMockStore();
const store = mockStore({
    cases: { lastAddedCase: { id: 0 }, isAddingCase: false },
});

const createTestProps = (props: Record<string, any>) => ({
    navigation: {
        navigate: jest.fn(),
        getParam: jest.fn(),
    },
    ...props,
});

describe('AddCaseScreen component', () => {
    test('renders upon passing in myRole state', () => {
        let props: any;
        beforeEach(() => {
            props = createTestProps({});
            const tree = renderer
                .create(
                    <Provider store={store}>
                        <AddCaseScreen {...props} />
                    </Provider>
                )
                .toJSON();
            expect(tree?.children).toHaveLength(1);
        });
    });
});
