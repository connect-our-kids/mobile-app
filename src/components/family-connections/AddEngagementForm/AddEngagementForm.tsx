import React, { useState, useEffect } from 'react';
import {
    Button,
    Text,
    ScrollView,
    View,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    DatePickerIOS,
} from 'react-native';
import SwitchToggle from 'react-native-switch-toggle';
import axios from 'axios';
import { Feather } from '@expo/vector-icons';
import { Input } from 'react-native-elements';
import { getEngagements } from '../../store/actions/connectionData';
import constants from '../../helpers/constants';
import * as SecureStore from 'expo-secure-store';
import { connect } from 'react-redux';
import { postConnectionEngagements } from '../../store/actions/connectionEngagements';

const AddEngagementForm = (props) => {
    const [ note, setNote ] = useState('');
    const [ subject, setSubject ] = useState(null);
    const [ isPublic, setIsPublic ] = useState(true);
    const [ person, setPerson ] = useState(null);
    const [ dueDate, setDueDate ] = useState(new Date());

    const [ dataType, setDataType ] = useState('');

    const dataTypeTitle = (dataType: string): string => {
        if (dataType === 'NOTE') {
            return 'ADD NOTE';
        }
        else if (dataType === 'REMINDER') {
            return 'SET REMINDER';
        }
        else if (dataType === 'CALL') {
            return 'LOG CALL';
        }
        else if (dataType === 'EMAIL') {
            return 'LOG EMAIL';
        }
        else {
            return 'LOG ENGAGEMENT';
        }
    };

    const dataTypePlaceholder = (dataType: string): string => {
        if (dataType === 'EMAIL') {
            return 'ADD EMAIL';
        }
        else {
            return 'ADD NOTE';
        }
    };

    const noteSizeHelper = (dataType: string): number => {
        if (dataType === 'REMINDER') {
            return 100;
        }
        else {
            return 165;
        }
    };

    // set type of engagement
    useEffect(() => {
        setPerson(props.navigation.getParam('id'));

        const dataTypeHelper = (type: string): string => {
            if (type === 'N') {
                return 'NOTE';
            }
            else if (type === 'R') {
                return 'REMINDER';
            }
            else if (type === 'C') {
                return 'CALL';
            }
            else if (type === 'D') {
                return 'DOCUMENT';
            }
            else if (type === 'E') {
                return 'EMAIL';
            }
            else {
                return 'OTHER';
            }
        };

        setDataType(dataTypeHelper(props.navigation.getParam('data_type')));
    }, [ false ]);

    return (
        <ScrollView
            contentContainerStyle={{
                width: '100%',
                justifyContent: 'flex-start',
                alignItems: 'center',
                backgroundColor: '#E5E4E2',
                height: '100%',
            }}
        >
            <View style={styles.formContainer}>
                <View
                    style={{
                        width: '100%',
                        alignItems: 'flex-start',
                        marginTop: 7,
                        marginBottom: 13,
                    }}
                >
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                        {dataTypeTitle(dataType)}
                    </Text>
                </View>

                {dataType === 'REMINDER' ? (
                    <View style={{ width: '100%' }}>
                        <DatePickerIOS
                            mode="date"
                            date={dueDate}
                            onDateChange={(e) => setDueDate(e)}
                        />
                    </View>
                ) : null}
                {dataType === 'EMAIL' ? (
                    <View
                        style={{
                            minHeight: 25,
                            marginBottom: 5,
                            width: '100%',
                            backgroundColor: 'white',
                            borderRadius: 4,
                        }}
                    >
                        <TextInput
                            onChangeText={(text) => {
                                setSubject(text);
                            }}
                            placeholder="SUBJECT"
                            placeholderTextColor={'#AAA9AD'}
                            style={{ padding: 4, fontSize: 15 }}
                            textAlignVertical="top"
                            name="subject"
                            value={subject}
                        />
                    </View>
                ) : null}
                <View
                    style={{
                        height: noteSizeHelper(dataType),
                        marginBottom: 5,
                        width: '100%',
                        backgroundColor: 'white',
                        borderRadius: 4,
                    }}
                >
                    <TextInput
                        multiline
                        numberOfLines={4}
                        onChangeText={(text) => {
                            setNote(text);
                        }}
                        placeholder={dataTypePlaceholder(dataType)}
                        placeholderTextColor={'#AAA9AD'}
                        name="note"
                        style={{
                            padding: 4,
                            width: '100%',
                            height: '100%',
                            fontSize: 15,
                        }}
                        textAlignVertical="top"
                        value={note}
                    />
                </View>

                {/* Items below here don't change */}
                <View
                    style={{
                        width: '100%',
                        marginTop: 20,
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            width: '100%',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Text style={{ width: '75%', fontSize: 15 }}>
              This Information is Sensitive
                        </Text>
                        <View>
                            <SwitchToggle
                                switchOn={!isPublic}
                                backgroundColorOn="#158FB4"
                                backgroundColorOff="#AAA9AD"
                                circleColorOn="#0F6580"
                                circleColorOff="#E5E4E2"
                                containerStyle={{
                                    width: 49,
                                    height: 20,
                                    borderRadius: 16,
                                    padding: 0.1,
                                }}
                                circleStyle={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 15,
                                    shadowColor: '#000',
                                    shadowOffset: {
                                        width: 1,
                                        height: 3,
                                    },
                                    shadowOpacity: 0.23,
                                    shadowRadius: 2.62,
                                    elevation: 4,
                                }}
                                onPress={() => setIsPublic(!isPublic)}
                            />
                        </View>
                    </View>
                    <View
                        style={{ width: '100%', alignItems: 'flex-end', marginTop: 20 }}
                    >
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={() => {
                                props.postConnectionEngagements(
                                    person,
                                    note,
                                    subject,
                                    props.navigation.getParam('data_type'),
                                    dueDate,
                                    isPublic,
                                );
                                props.navigation.goBack();
                            }}
                        >
                            <Text style={styles.buttonText}>SAVE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        width: '95%',
        // padding: 4,
        marginTop: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    saveButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 96,
        height: 36,
        backgroundColor: 'lightgray',
        borderRadius: 50,
        borderWidth: 1,
        marginTop: 20,
        backgroundColor: constants.highlightColor,
        borderColor: constants.highlightColor,
    },
    buttonText: {
        fontSize: 14,
        textTransform: 'uppercase',
        color: '#fff',
    },
});

const mapStateToProps = (state) => {
    const { accessToken } = state.auth;

    return {
        accessToken,
        isLoadingEngagements: state.engagements.isLoadingEngagements,
        engagementsError: state.engagements.engagementsError,
    };
};

export default connect(mapStateToProps, {
    postConnectionEngagements,
    getEngagements,
})(AddEngagementForm);
