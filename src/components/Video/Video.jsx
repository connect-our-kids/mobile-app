import React from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

import styles from './Video.styles';

export default function Video({ uri }) {

    return (
        <View style={styles.VideoContainer}>
            <WebView
                style={styles.WebViewContainer}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                source={{ uri }}
                allowsInlineMediaPlayback='true'
            />
        </View>
    );

}
