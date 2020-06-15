import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Modal,
    TextInput,
} from 'react-native';
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
    countdownText: { display: 'flex' },
    countdownTextHidden: { display: 'none' },
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
    modalDeleteButtonDisabled: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 96,
        height: 36,
        borderRadius: 50,
        borderWidth: 1,
        marginTop: 20,
        marginLeft: 15,
        backgroundColor: 'rgb(211,211,211)',
        borderColor: 'rgb(211,211,211)',
    },
    modalButtonText: {
        fontSize: 14,
        textTransform: 'uppercase',
        color: '#fff',
    },
    textInputWrapper: {
        flexDirection: 'row',
    },
    textInput: {
        borderColor: 'rgba(24,23,21,.5)',
        borderWidth: 0.5,
        flexGrow: 1,
        alignContent: 'flex-start',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        height: 45,
        padding: 12,
        marginTop: 12,
        borderRadius: 5,
    },
});

export function DeleteCaseModal(props: {
    caseName: string;
    onCancel?: () => void;
    onDelete?: () => void;
}): JSX.Element {
    const [isFirstStage, setIsFirstStage] = useState(true);
    const [isFirstStageDeleteEnabled, setIsFirstStageDeleteEnabled] = useState(
        false
    );
    const [
        isSecondStageDeleteEnabled,
        setIsSecondStageDeleteEnabled,
    ] = useState(false);

    const [counter, setCounter] = React.useState(5);

    useEffect(() => {
        const timer =
            counter > 0 && !isFirstStage
                ? setInterval(() => setCounter(counter - 1), 1000)
                : undefined;
        return () => clearInterval(timer);
    }, [counter, isFirstStage]);

    useEffect(() => {
        if (counter === 0) {
            setIsSecondStageDeleteEnabled(true);
        }
    }, [counter]);

    return isFirstStage ? (
        <Modal animationType={'fade'} transparent={true} visible={true}>
            <View style={styles.centerView}>
                <View style={styles.modalView}>
                    <Text style={{ fontWeight: 'bold', paddingBottom: 20 }}>
                        {`Delete ${props.caseName}?`}
                    </Text>

                    <Text>
                        <Text>{`Deleting `}</Text>
                        <Text style={{ fontStyle: 'italic' }}>
                            {props.caseName}
                        </Text>
                        <Text>{`'s case will `}</Text>
                        <Text style={{ fontWeight: 'bold' }}>PERMANENTLY</Text>
                        <Text>
                            {` remove all content (documents, engagements, relationships, etc) related to this case.\n\n`}
                        </Text>
                        <Text style={{ fontWeight: 'bold' }}>
                            This action cannot be undone.
                        </Text>
                    </Text>

                    <View style={styles.textInputWrapper}>
                        <TextInput
                            placeholder={`Type ${props.caseName} here`}
                            onChangeText={(text) => {
                                if (
                                    text.toLocaleLowerCase().trim() ===
                                    props.caseName.toLocaleLowerCase().trim()
                                ) {
                                    setIsFirstStageDeleteEnabled(true);
                                } else {
                                    setIsFirstStageDeleteEnabled(false);
                                }
                            }}
                            style={styles.textInput}
                        />
                    </View>
                    <View style={styles.modalButtonView}>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={props.onCancel}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={
                                isFirstStageDeleteEnabled
                                    ? styles.modalDeleteButton
                                    : styles.modalDeleteButtonDisabled
                            }
                            disabled={!isFirstStageDeleteEnabled}
                            onPress={() => setIsFirstStage(false)}
                        >
                            <Text style={styles.modalButtonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    ) : (
        <Modal animationType={'none'} transparent={true} visible={true}>
            <View style={styles.centerView}>
                <View style={styles.modalView}>
                    <Text style={{ fontWeight: 'bold', paddingBottom: 20 }}>
                        {`Delete ${props.caseName}?`}
                    </Text>

                    <Text>
                        <Text>{`Are you sure you want to delete `}</Text>
                        <Text style={{ fontStyle: 'italic' }}>
                            {props.caseName}
                        </Text>
                        <Text>{`'s case?\n\n`}</Text>
                        <Text style={{ fontWeight: 'bold' }}>
                            This action cannot be undone.
                        </Text>
                    </Text>

                    <View style={styles.modalButtonView}>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={props.onCancel}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={!isSecondStageDeleteEnabled}
                            style={
                                isSecondStageDeleteEnabled
                                    ? styles.modalDeleteButton
                                    : styles.modalDeleteButtonDisabled
                            }
                            onPress={props.onDelete}
                        >
                            <Text style={styles.modalButtonText}>
                                {counter > 0 ? counter : 'Delete'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
