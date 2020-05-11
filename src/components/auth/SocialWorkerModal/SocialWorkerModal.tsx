import React from 'react';
import { Text, TouchableOpacity, View, Linking } from 'react-native';
import { Button } from 'native-base';

import styles from './SocialWorkerModal.styles';

export default function SocialWorkerModal(props) {
    return (
        <>
            <View style={styles.headerContainer}>
                <Text style={styles.modalHeaderStyle}>
                    Do you work with kids in foster care?
                </Text>
                <TouchableOpacity
                    style={styles.close}
                    onPress={() => {
                        props.setModalVisible(!props.modalVisible);
                    }}
                >
                    <Text style={[styles.btnText, styles.closeBtn]}>❌</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.modalTextStyle}>
                People Search is for social workers and those that work directly
                with kids in foster care. If you do not work with kids in foster
                care, we&apos;d love to tell you more about what we do.
            </Text>
            <View style={styles.buttonContainer}>
                <Button
                    style={styles.yesButton}
                    block
                    onPress={() => {
                        props.sendEvent(
                            null,
                            'click',
                            'yes-i-am-a-social-worker'
                        );
                        props.advanceModal(true);
                    }}
                >
                    <Text style={styles.btnText}>
                        Yes, I work with foster kids
                    </Text>
                </Button>
                <Button
                    style={styles.noButton}
                    block
                    onPress={() => {
                        props.sendEvent(
                            null,
                            'click',
                            'i-am-not-a-social-worker'
                        );
                        Linking.openURL('https://connectourkids.org');
                    }}
                >
                    <Text style={styles.btnText}>Nope, that&apos;s not me</Text>
                </Button>
            </View>
        </>
    );
}
