/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import AddRelationshipScreen from './AddRelationshipScreen';

const mockStore = configureMockStore();
const store = mockStore({
    case: { lastCreatedRelationship: { id: 0 }, isCreatingRelationship: false },
});

const createTestProps = (props: Record<string, any>) => ({
    navigation: {
        navigate: jest.fn(),
        getParam: jest.fn(),
    },
    ...props,
});

describe('AddRelationshipScreen component', () => {
    test('renders upon passing in myRole state', () => {
        let props: any;
        beforeEach(() => {
            props = createTestProps({});
            const tree = renderer
                .create(
                    <Provider store={store}>
                        <AddRelationshipScreen {...props} />
                    </Provider>
                )
                .toJSON();
            expect(tree?.children).toHaveLength(1);
        });
    });
});
