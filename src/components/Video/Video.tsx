import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

import styles from './Video.styles';

export default function Video({ uri }: { uri: string }) {
    return (
        <View style={styles.VideoContainer}>
            <WebView
                style={styles.WebViewContainer}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                source={{ uri }}
                allowsInlineMediaPlayback={true}
            />
        </View>
    );
}
