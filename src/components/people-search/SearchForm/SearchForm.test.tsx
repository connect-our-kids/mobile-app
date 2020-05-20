import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { SearchForm } from './SearchForm';

const mockStore = configureMockStore();
const store = mockStore({
    confirmationModal: {
        info: '',
        queryType: '',
        searchMe: '',
    },
});

describe('SearchForm component', () => {
    test('renders', () => {
        const tree = renderer.create(
            <Provider store={store}>
                <SearchForm
                    {...{
                        onSearch: () => {
                            return;
                        },
                        onClear: () => {
                            return;
                        },
                    }}
                />
            </Provider>
        );
        expect(tree).toBeDefined();
    });
});
