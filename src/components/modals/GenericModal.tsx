import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import constants from '../../helpers/constants';

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
    modalButtonView: {
        flexDirection: 'row',
    },
    modalButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 96,
        height: 36,
        borderRadius: 50,
        borderWidth: 1,
        marginTop: 20,
        backgroundColor: constants.highlightColor,
        borderColor: constants.highlightColor,
    },
    modalDeleteButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 96,
        height: 36,
        borderRadius: 50,
        borderWidth: 1,
        marginTop: 20,
        marginLeft: 15,
        backgroundColor: 'red',
        borderColor: 'red',
    },
    modalButtonText: {
        fontSize: 14,
        textTransform: 'uppercase',
        color: '#fff',
    },
});

export function GenericModal(props: {
    title?: string;
    message?: string;
    leftButtonText?: string;
    rightButtonText?: string;
    animationType?: 'none' | 'slide' | 'fade';
    isRightButtonRed?: boolean;
    onLeftButton?: () => void;
    onRightButton?: () => void;
}): JSX.Element {
    return (
        <Modal
            animationType={props.animationType}
            transparent={true}
            visible={true}
        >
            <View style={styles.centerView}>
                <View style={styles.modalView}>
                    {props.title && (
                        <Text style={{ fontWeight: 'bold', paddingBottom: 20 }}>
                            {props.title}
                        </Text>
                    )}

                    {props.message && <Text>{props.message}</Text>}

                    <View style={styles.modalButtonView}>
                        {props.leftButtonText && (
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={props.onLeftButton}
                            >
                                <Text style={styles.modalButtonText}>
                                    {props.leftButtonText}
                                </Text>
                            </TouchableOpacity>
                        )}
                        {props.rightButtonText && (
                            <TouchableOpacity
                                style={
                                    props.isRightButtonRed
                                        ? styles.modalDeleteButton
                                        : styles.modalButton
                                }
                                onPress={props.onRightButton}
                            >
                                <Text style={styles.modalButtonText}>
                                    {props.rightButtonText}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}
