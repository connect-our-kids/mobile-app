import React from 'react';

import {
    View,
    Text,
} from 'react-native';

import { Button } from 'native-base';

import {
    Avatar,
    Divider,
} from 'react-native-elements';

import { sendEvent } from '../../../helpers/createEvent';

import styles from './Login.styles';
/**********************************************************/

export default function Login(props): JSX.Element {

    return (
        <View style = {styles.view1}>
            <View style = {styles.view2}>
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
                        <Divider style = {styles.divider}/>
                    )
                    : null
                }
            </View>

            {(props.isLoggedIn && props.idToken)
                ? (
                    <View style = {styles.view3}>
                        <Text style = {styles.view3Text}>
                            Information
                        </Text>
                    </View>
                )
                : null
            }

            {(props.isLoggedIn && props.idToken)
                ? (
                    <View style = {styles.view4}>
                        <View style = {styles.view5}>
                            <Text style = {styles.view5Text}>
                                First Name
                            </Text>
                            <Text style = {styles.view5Text}>
                                Last Name
                            </Text>
                            <Text style = {styles.view5Text}>
                                Email
                            </Text>
                        </View>
                        <View style = {styles.view6}>
                            <View style = {styles.view7}>
                                <Text style={styles.text}>
                                    {(props.isLoggedIn && props.idToken && props.idToken.given_name)
                                        ? props.idToken.given_name
                                        : null
                                    }
                                </Text>
                            </View>
                            <View style={styles.view8And9}>
                                <Text style={styles.text}>
                                    {(props.isLoggedIn && props.idToken && props.idToken.family_name)
                                        ? props.idToken.family_name
                                        : null
                                    }
                                </Text>
                            </View>
                            <View style={styles.view8And9}>
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
                            <View style={styles.view10}>
                                <Button
                                    style={[
                                        styles.button,
                                        styles.view10Button,
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
