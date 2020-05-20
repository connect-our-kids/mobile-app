/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Linking,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { Button } from 'native-base';
import { sendEvent, createOptions } from '../../../helpers/createEvent';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { SearchValues } from '../SearchForm/SearchForm';

const options = StyleSheet.create({
    border: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
        width: '100%',
    },

    container: {
        marginTop: 70,
        flex: 1,
        padding: 20,
    },

    header: {
        fontSize: 23,
        justifyContent: 'center',
        color: '#508DB3',
    },

    question: {
        margin: 30,
        fontSize: 17,
        justifyContent: 'center',
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 15,
    },

    button: {
        paddingRight: 15,
        paddingLeft: 15,
    },

    blueButton: {
        margin: 10,
        padding: 10,
        backgroundColor: '#508DB3',
    },

    greyButton: {
        backgroundColor: 'grey',
        margin: 10,
        padding: 10,
    },
});

type Navigation = NavigationScreenProp<NavigationState>;

interface PersonConfirmationModalProps {
    toggleModal: any;
    data: any;
    type: any;
    navigation: Navigation;
    setData: any;
    user: any;
    index: any;
}

export default function PersonConfirmationModal({
    toggleModal,
    data,
    type,
    navigation,
    setData,
    user,
    index,
}: PersonConfirmationModalProps) {
    const handlePressDirections = (address: any) => {
        if (Platform.OS === 'ios') {
            Linking.openURL(`http://maps.apple.com/?address=${address}`);
        } else {
            Linking.openURL(`http://maps.google.com/?address=${address}`);
        }
    };

    return (
        <View style={options.container}>
            {type === 'email' ? (
                <View>
                    <View style={options.border}>
                        <Text style={options.header}>
                            Send Email or Search?
                        </Text>
                        <TouchableOpacity onPress={() => toggleModal()}>
                            <Text style={options.button}>❌</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={options.question}>
                        Would you like to send an email, or perform a search?
                    </Text>
                </View>
            ) : null}

            {type === 'phone' ? (
                <View>
                    <View style={options.border}>
                        <Text style={options.header}>Call or Search?</Text>
                        <TouchableOpacity onPress={() => toggleModal()}>
                            <Text style={options.button}>❌</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={options.question}>
                        Would you like to call this number, or perform a search?
                        Calling requires a device capable of dialing phone
                        numbers.
                    </Text>
                </View>
            ) : null}

            {type === 'address' ? (
                <View>
                    <View style={options.border}>
                        <Text style={options.header}>View or Search?</Text>
                        <TouchableOpacity onPress={() => toggleModal()}>
                            <Text style={options.button}>❌</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={options.question}>
                        Would you like to view this address on a map, or perform
                        a search on it?
                    </Text>
                </View>
            ) : null}

            {type === 'address404' ? (
                <View>
                    <View style={options.border}>
                        <Text style={options.header}>View?</Text>
                        <TouchableOpacity onPress={() => toggleModal()}>
                            <Text style={options.button}>❌</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={options.question}>
                        Would you like to view this address on a map?
                    </Text>
                </View>
            ) : null}

            {type === 'url' ? (
                <View>
                    <View style={options.border}>
                        <Text style={options.header}>View or Search?</Text>
                        <TouchableOpacity onPress={() => toggleModal()}>
                            <Text style={options.button}>❌</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={options.question}>
                        Would you like to view this URL, or perform a search on
                        it?
                    </Text>
                </View>
            ) : null}

            <View style={options.buttonContainer}>
                {type === 'name' ? null : (
                    <Button
                        info
                        style={options.blueButton}
                        onPress={() => {
                            if (type === 'email') {
                                const options = createOptions(
                                    null,
                                    'email',
                                    index
                                );
                                sendEvent(
                                    user.email,
                                    'click',
                                    'person_email_send',
                                    null,
                                    options
                                );
                                Linking.openURL(`mailto:${data.address}`);
                                toggleModal();
                            }

                            if (type === 'phone') {
                                const options = createOptions(
                                    null,
                                    'phone',
                                    index
                                );
                                sendEvent(
                                    user.email,
                                    'click',
                                    'person_phone_call',
                                    null,
                                    options
                                );
                                Linking.openURL(`tel:${data.number}`);
                                toggleModal();
                            }

                            if (type === 'address') {
                                const options = createOptions(
                                    null,
                                    'address',
                                    index
                                );
                                sendEvent(
                                    user.email,
                                    'click',
                                    'person_address_view',
                                    null,
                                    options
                                );
                                handlePressDirections(data);
                                toggleModal();
                            }

                            if (type === 'address404') {
                                const options = createOptions(
                                    null,
                                    'address',
                                    index
                                );
                                sendEvent(
                                    user.email,
                                    'click',
                                    'person_address_view',
                                    null,
                                    options
                                );
                                handlePressDirections(data);
                                toggleModal();
                            }

                            if (type === 'url') {
                                const options = createOptions(
                                    null,
                                    'url',
                                    index
                                );
                                sendEvent(
                                    user.email,
                                    'click',
                                    'person_url_view',
                                    null,
                                    options
                                );
                                Linking.openURL(`${data.url}`);
                                toggleModal();
                            }
                            if (type === 'name') {
                                const options = createOptions(
                                    null,
                                    'relationship',
                                    index
                                );
                                sendEvent(
                                    user.email,
                                    'click',
                                    'person_possible_person',
                                    null,
                                    options
                                );
                                Linking.openURL(`${data}`);
                                toggleModal();
                            }
                        }}
                    >
                        {type === 'email' ? (
                            <Text style={{ color: 'white' }}>Send Email</Text>
                        ) : null}

                        {type === 'phone' ? (
                            <Text style={{ color: 'white' }}>
                                Call this number
                            </Text>
                        ) : null}

                        {type === 'address' ? (
                            <Text style={{ color: 'white' }}>View on map</Text>
                        ) : null}

                        {type === 'address404' ? (
                            <Text style={{ color: 'white' }}>View on map</Text>
                        ) : null}

                        {type === 'url' ? (
                            <Text style={{ color: 'white' }}>View the URL</Text>
                        ) : null}
                    </Button>
                )}

                {type === 'address404' ? null : (
                    <Button
                        info
                        style={options.greyButton}
                        onPress={() => {
                            if (type === 'email') {
                                const info = data.address;
                                const options = createOptions(
                                    null,
                                    'email',
                                    index
                                );
                                sendEvent(
                                    user.email,
                                    'click',
                                    'person_email_search',
                                    null,
                                    options
                                );
                                navigation.navigate<{
                                    searchValues: SearchValues;
                                }>('PeopleSearch', {
                                    searchValues: {
                                        type: 'email',
                                        email: info,
                                    },
                                });
                                setData(info, type);
                                toggleModal();
                            }

                            if (type === 'phone') {
                                const info = data.display;
                                const options = createOptions(
                                    null,
                                    'phone',
                                    index
                                );
                                sendEvent(
                                    user.email,
                                    'click',
                                    'person_phone_search',
                                    null,
                                    options
                                );
                                navigation.navigate<{
                                    searchValues: SearchValues;
                                }>('PeopleSearch', {
                                    searchValues: {
                                        type: 'phone',
                                        phone: info,
                                    },
                                });
                                setData(info, type);
                                toggleModal();
                            }

                            if (type === 'address') {
                                const info = data;
                                const options = createOptions(
                                    null,
                                    'address',
                                    index
                                );
                                sendEvent(
                                    user.email,
                                    'click',
                                    'person_address_search',
                                    null,
                                    options
                                );
                                navigation.navigate<{
                                    searchValues: SearchValues;
                                }>('PeopleSearch', {
                                    searchValues: {
                                        type: 'address',
                                        address: info,
                                    },
                                });
                                setData(info, type);
                                toggleModal();
                            }

                            if (type === 'url') {
                                const info = data.url;
                                const options = createOptions(
                                    null,
                                    'url',
                                    index
                                );
                                sendEvent(
                                    user.email,
                                    'click',
                                    'person_url_search',
                                    null,
                                    options
                                );
                                navigation.navigate<{
                                    searchValues: SearchValues;
                                }>('PeopleSearch', {
                                    searchValues: {
                                        type: 'url',
                                        url: info,
                                    },
                                });
                                setData(info, type);
                                toggleModal();
                            }

                            if (type === 'name') {
                                const info = data;
                                const options = createOptions(
                                    null,
                                    'relationship',
                                    index
                                );
                                sendEvent(
                                    user.email,
                                    'click',
                                    'possible_person',
                                    null,
                                    options
                                );
                                navigation.navigate<{
                                    searchValues: SearchValues;
                                }>('PeopleSearch', {
                                    searchValues: {
                                        type: 'name',
                                        name: data.name ?? '',
                                        location: data.location ?? '',
                                    },
                                });
                                setData(info, type);
                                toggleModal();
                            }
                        }}
                    >
                        <Text style={{ color: 'white' }}>Perform a Search</Text>
                    </Button>
                )}
            </View>
        </View>
    );
}
