import React from 'react';
import styles from './VideoModal.styles';

import { Text, View } from 'react-native';

import { Button } from 'native-base';
import { WebView } from 'react-native-webview';

export default function VideoModal(props: {
    setModalVisible: (arg0: boolean) => void;
    sendEvent: (arg0: null, arg1: string, arg2: string) => void;
    onLogin: () => void;
}) {
    return (
        <>
            <View style={styles.videoWrapper}>
                <WebView
                    style={styles.WebViewContainer}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    source={{
                        uri: 'https://www.youtube.com/embed/04V1mNZxNE0',
                    }}
                />
                <Button
                    style={styles.noButton}
                    block
                    onPress={() => {
                        props.setModalVisible(false);
                        props.sendEvent(
                            null,
                            'click',
                            'post-watch-video-sign-up'
                        );
                        props.onLogin();
                    }}
                >
                    <Text style={styles.btnText}>Take me to sign up</Text>
                </Button>
                <Button
                    style={styles.close}
                    block
                    onPress={() => {
                        props.setModalVisible(false);
                    }}
                >
                    <Text style={styles.btnText}>Close</Text>
                </Button>
            </View>
        </>
    );
}
