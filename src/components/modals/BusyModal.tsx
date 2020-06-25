import React, { useEffect, useState } from 'react';
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
    visible: boolean;
}): JSX.Element {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (props.visible) {
            // showing modal
            setShowModal(true);
        } else {
            // need delay to account for bug in React Native
            // See https://github.com/facebook/react-native/issues/10471
            // See https://github.com/joinspontaneous/react-native-loading-spinner-overlay/issues/30
            const timer = setTimeout(() => setShowModal(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [props.visible]);

    return (
        <Modal
            animationType={props.animationType}
            transparent={true}
            visible={showModal}
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
