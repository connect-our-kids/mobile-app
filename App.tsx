import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import * as Font from 'expo-font';
import constants from './src/helpers/constants';
import Navigator from './src/navigation';
import { StatusBar } from 'react-native';
import { AppearanceProvider } from 'react-native-appearance';

export default function App() {
    const [ state, setState ] = useState({ fontLoaded: false });

    useEffect (() => {

    });

    return (
        <AppearanceProvider>
                <Provider store={store}>
                    <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "#00BCD4" translucent = {true}/>
                    <Navigator />
                </Provider>
        </AppearanceProvider>
    );

}
