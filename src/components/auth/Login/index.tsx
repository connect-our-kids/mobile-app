import React from 'react';

import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import { Button } from 'native-base';

import {
    Avatar,
    Divider,
} from 'react-native-elements';

import { sendEvent } from '../../../helpers/createEvent';

/**********************************************************/

export default function Login(props): JSX.Element {

    return (
        <View
            style={{
                width: '100%',
            }}
        >
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 15,
                    paddingBottom: 15,
                }}
            >
                {(props.idToken && props.idToken.picture)
                    ? (
                        <Avatar
                            rounded
                            size="large"
                            source={{ uri: props.idToken.picture }}
                        />
                    )
                    : null
                }

                <Text>
                    {(props.isLoggedIn && props.idToken && props.idToken.email)
                        ? 'Welcome back, ' + props.idToken.given_name + '!'
                        : 'Welcome to Connect Our Kids!'
                    }
                </Text>

                {(props.isLoggedIn && props.idToken && props.idToken.email)
                    ? (
                        <Divider
                            style={{
                                width: '100%',
                                height: 1,
                                backgroundColor: '#E5E4E2',
                                marginTop: 20,
                                marginBottom: 6,
                            }}
                        />
                    )
                    : null
                }
            </View>

            {(props.isLoggedIn && props.idToken)
                ? (
                    <View style={{
                        paddingLeft: 10,
                    }}>
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: 20,
                        }}>
                            Information
                        </Text>
                    </View>
                )
                : null
            }

            {(props.isLoggedIn && props.idToken)
                ? (
                    <View style={{
                        flexDirection: 'row',
                        padding: 10,
                    }}>
                        <View style={{
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            flexDirection: 'column',
                            width: '30%',
                        }}>
                            <Text style={{
                                marginTop: 6,
                                marginBottom: 6,
                                fontSize: 16,
                            }}>
                                First Name
                            </Text>
                            <Text style={{
                                marginTop: 6,
                                marginBottom: 6,
                                fontSize: 16,
                            }}>
                                Last Name
                            </Text>
                            <Text style={{
                                marginTop: 6,
                                marginBottom: 6,
                                fontSize: 16,
                            }}>
                                Email
                            </Text>
                        </View>
                        <View style={{
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            width: '70%',
                        }}>
                            <View style={{
                                width: '100%',
                                borderBottomColor: '#E5E4E2',
                                borderBottomWidth: 1,
                            }}>
                                <Text style={styles.text}>
                                    {(props.isLoggedIn && props.idToken && props.idToken.given_name)
                                        ? props.idToken.given_name
                                        : null
                                    }
                                </Text>
                            </View>
                            <View style={{
                                width: '100%',
                                borderBottomColor: '#E5E4E2',
                                borderBottomWidth: 1,
                            }}>
                                <Text style={styles.text}>
                                    {(props.isLoggedIn && props.idToken && props.idToken.family_name)
                                        ? props.idToken.family_name
                                        : null
                                    }
                                </Text>
                            </View>
                            <View style={{
                                width: '100%',
                                borderBottomColor: '#E5E4E2',
                                borderBottomWidth: 1,
                            }}>
                                <Text style={styles.text}>
                                    {(props.isLoggedIn && props.idToken && props.idToken.email)
                                        ? props.idToken.email
                                        : null
                                    }
                                </Text>
                            </View>
                        </View>
                    </View>
                )
                : null
            }
            <View style={styles.linkContainer}>
                <View style={styles.logInBtns}>
                    {(props.isLoggedIn)
                        ? (
                            <View style={{
                                width: '50%',
                                marginTop: 40,
                            }}>
                                <Button
                                    style={[
                                        styles.button,
                                        {
                                            backgroundColor: 'white',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderColor: 'rgb(8,121,169)',
                                            borderWidth: 1

                                        },
                                    ]}
                                    onPress={(): void => {
                                        props.idToken && props.idToken.email ? props.logOut(props.idToken.email) : props.logOut();
                                        props.clearUserCases();
                                    }}
                                    block
                                >
                                    <Text style={styles.logOutText}>Log Out</Text>
                                </Button>
                            </View>
                        )
                        : (
                            <View style={styles.logInBtns}>
                                <Button
                                    style={styles.buttonStyle}
                                    block
                                    onPress={props.onLogin}
                                >
                                    <Text style={styles.btnText}>
                                        Login
                                    </Text>
                                </Button>
                                <Button
                                    style={styles.buttonStyle}
                                    block
                                    onPress={(): void => {
                                        props.setModalVisible(true);
                                        sendEvent(null, 'click', 'sign-up');
                                    }}
                                >
                                    <Text style={styles.btnText}>
                                        Sign Up
                                    </Text>
                                </Button>
                            </View>
                        )
                    }
                </View>
            </View>
        </View>
    );

}

/**********************************************************/

const styles = StyleSheet.create({

    logInBtns: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-evenly',
    },

    logOutText: {
        color: 'rgb(8,121,169)',
    },

    linkContainer: {
        justifyContent: 'space-between',
        flex: 1,
    },

    buttonStyle: {
        flex: 1,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#0279AC',
    },

    btnText: {
        color: '#fff',
    },

    button: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom: 10
    },

    text: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 6,
        marginBottom: 6,
        fontSize: 15,

    },

});
