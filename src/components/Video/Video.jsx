import React from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

export default function Video({ uri }) {

    return (
        <View style={styles.videoContainer}>
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

const styles = StyleSheet.create({
    videoContainer: {
        justifyContent: 'center',
        width: '100%',
        height: 300,
        marginBottom: 10,
    },
    WebViewContainer: {
        marginTop: Platform.OS == 'ios' ? 20 : 0,
    },
});
