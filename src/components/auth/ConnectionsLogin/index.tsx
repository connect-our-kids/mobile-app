// no typescript needed

import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { Button } from 'native-base';
import constants from '../../../helpers/constants';
import { sendEvent } from '../../../helpers/createEvent';
import NavigationButton from '../../../UI/NavigationButton';
import MainText from '../../../UI/MainText';
import ScreenContainer from '../../../UI/ScreenContainer';
import authHelpers from '../../../helpers/authHelpers';

const ConnectionsLogin = (props) => {

    const learnMorePressed = () => {
        Linking.openURL('https://www.connectourkids.org/tools/family-connections');
    };

    return (
        <ScreenContainer>
            <MainText>
                {'Family Connections helps social workers, family recruiters, and CASA volunteeers identify and engage extended family members of children in foster care.'}
            </MainText>
            <Text style={styles.linkText} onPress={learnMorePressed}>Learn More About Family Connections</Text>
            <View style={styles.linkContainer}>
                <View style={styles.logInBtns}>
                    <Button
                        style={styles.buttonStyle}
                        block
                        onPress={() =>
                            authHelpers.handleLogin(
                                authHelpers._loginWithAuth0,
                                props.setUserCreds,
                            )}>
                        <Text style={styles.btnText}>Login</Text>
                    </Button>
                    <Button
                        style={styles.buttonStyle}
                        block
                        onPress={() => {
                            props.setModalVisible(true); { /* {props.setModalVisible} */ }
                            sendEvent(null, 'click', 'sign-up');
                        }}
                    ><Text style={styles.btnText}>Sign Up</Text>
                    </Button>
                </View>
            </View>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    logInBtns: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-evenly',
    },
    logOutText: {
        color: '#fff',
    },
    linkText: {
        color: '#0279AC',
        marginTop: 20,
        textAlign: 'center',
    },
    linkContainer: {
        justifyContent: 'space-between',
        flex: 1,
        marginTop: 40,
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
        // justifyContent: 'center',
        marginBottom: 10,
    },
});


export default ConnectionsLogin;
