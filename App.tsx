import React from 'react';
import { Provider } from 'react-redux';
import Navigator from './src/navigation';
import { StatusBar } from 'react-native';
import { AppearanceProvider } from 'react-native-appearance';
import { login } from './src/store/actions';
import { store } from './src/store/store';

store.dispatch(login(true));

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
