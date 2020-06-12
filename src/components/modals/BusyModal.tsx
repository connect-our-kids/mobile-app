import React from 'react';
import { Text, View, StyleSheet, Modal, Image } from 'react-native';

const styles = StyleSheet.create({
    centerView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        padding: 35,
        borderRadius: 10,
        alignItems: 'center',
        alignContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export function BusyModal(props: {
    message?: string;
    animationType?: 'none' | 'slide' | 'fade';
}): JSX.Element {
    return (
        <Modal
            animationType={props.animationType}
            transparent={true}
            visible={true}
        >
            <View style={styles.centerView}>
                <View style={styles.modalView}>
                    {props.message && <Text>{props.message}</Text>}
                    <Image
                        source={require('../../../assets/loading.gif')}
                        style={{ width: 80, height: 80 }}
                    />
                </View>
            </View>
        </Modal>
    );
}
