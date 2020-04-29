import React from 'react';
import { Provider } from 'react-redux';
import Navigator from './src/navigation';
import { StatusBar } from 'react-native';
import { AppearanceProvider } from 'react-native-appearance';
import { login } from './src/store/actions';
import { store } from './src/store/store';
import * as Sentry from 'sentry-expo';
import Constants from 'expo-constants';

// sentry.io is an error reporting framework
// See https://sentry.io/organizations/connect-our-kids/issues/?project=5204132
Sentry.init({
    dsn:
        'https://efdc4a18b3eb406aa60b6df4784d6561@o378845.ingest.sentry.io/5204132',
    enableInExpoDevelopment: false,
    debug: true,
});
Sentry.setRelease(Constants.manifest.revisionId);

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
