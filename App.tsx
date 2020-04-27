import React from 'react';
import { Provider } from 'react-redux';
import Navigator from './src/navigation';
import { StatusBar } from 'react-native';
import { AppearanceProvider } from 'react-native-appearance';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './src/store/reducers/index';
import thunk from 'redux-thunk';
import { client } from './src/apollo';

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(thunk.withExtraArgument({ client })))
);

export default function App(): JSX.Element {
    return (
        <AppearanceProvider>
            <Provider store={store}>
                <StatusBar
                    barStyle="dark-content"
                    hidden={false}
                    backgroundColor="#00BCD4"
                    translucent={true}
                />
                <Navigator />
            </Provider>
        </AppearanceProvider>
    );
}
