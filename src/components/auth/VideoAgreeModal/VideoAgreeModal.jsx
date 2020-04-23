import React from 'react';

import { Text, TouchableOpacity, View } from 'react-native';

import { Button } from 'native-base';

import styles from './VideoAgreeModal.styles';

/**********************************************************/

export default function VideoAgreeModal(props) {
    return (
        <>
            <View style={styles.headerContainer}>
                <Text style={styles.modalHeaderStyle}>
                    Two minutes for better results
                </Text>
                <TouchableOpacity
                    style={styles.close}
                    onPress={() => {
                        props.setModalVisible(false);
                    }}
                >
                    <Text style={[styles.btnText, styles.closeBtn]}>❌</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.modalTextStyle}>
                Before you start, we&apos;d like you to watch a two minute video
                so that you know everything about People Search.
            </Text>
            <View style={styles.buttonContainer}>
                <Button
                    style={styles.yesButton}
                    block
                    onPress={() => {
                        props.sendEvent(null, 'click', 'watch-video');
                        props.advanceModal(true);
                    }}
                >
                    <Text style={styles.btnText}>Show me the video</Text>
                </Button>
                <Button
                    style={styles.noButton}
                    block
                    onPress={() => {
                        props.setModalVisible(false);
                        props.onLogin();
                        props.sendEvent(null, 'click', 'do-not-watch-video');
                    }}
                >
                    <Text style={styles.btnText}>Skip the video</Text>
                </Button>
            </View>
        </>
    );
}
