import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { useNetInfo, NetInfoStateType } from '@react-native-community/netinfo';

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});

export const InternetErrorModal = () => {
    const netInfo = useNetInfo();

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={
                netInfo.type !== NetInfoStateType.unknown &&
                netInfo.isInternetReachable !== null &&
                netInfo.isInternetReachable !== undefined &&
                !netInfo.isInternetReachable
            }
        >
            <View
                style={{
                    height: '100%',
                    width: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>
                            Your phone is currently disconnected from the
                            internet.
                        </Text>
                        <Text style={styles.modalText}>
                            Please wait for it to reconnect and try again.
                        </Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
