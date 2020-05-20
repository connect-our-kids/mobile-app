import React from 'react';
import renderer from 'react-test-renderer';
import AddDocumentForm from './AddDocumentForm';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import { DocumentInfo } from '../AddDocumentButtons/types';

type Navigation = NavigationScreenProp<NavigationState>;

const mockStore = configureMockStore();
const store = mockStore({
    case: { results: { details: { id: 0 } }, isLoadingDocuments: false },
    relationship: { results: { id: 0 } },
});

/**
 * Helper function to create the necessary props to pass
 * to the component. In this case we need to mock the React
 * navigation type so that when the tested component calls
 * navigation.getParam('paramName') it will get what it
 * expects.
 * @param param0 media image or document info
 */
function getProps(media: ImageInfo | DocumentInfo): { navigation: Navigation } {
    return {
        navigation: ({
            // jest.fn creates a mock function with the
            // following implementation that the tested
            // component can call exactly as it expects
            getParam: jest.fn((param) => {
                if (param === 'media') {
                    return media;
                } else {
                    throw new Error(`Unhandled param ${param}`);
                }
            }),
        } as unknown) as Navigation,
    };
}

describe('AddDocumentForm component', () => {
    test('renders', () => {
        const imageInfo: ImageInfo = {
            height: 4,
            width: 9,
            uri: '',
        };
        const tree = renderer
            .create(
                <Provider store={store}>
                    <AddDocumentForm {...getProps(imageInfo)} />
                </Provider>
            )
            .toJSON();
        expect(tree?.children?.length).toBeGreaterThan(0);
    });
});
