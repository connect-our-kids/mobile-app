// no typescript needed

import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { Button } from 'native-base';
import constants from '../../helpers/constants';
import { sendEvent } from '../../helpers/createEvent';
import NavigationButton from '../../UI/NavigationButton';
import MainText from '../../UI/MainText';
import ScreenContainer from '../../UI/ScreenContainer';
import authHelpers from '../../helpers/authHelpers';

const ConnectionsLogin = (props) => {

    return (
        <ScreenContainer>
            <MainText>
                {'Welcome to Connect Our Kids!\n\nFamily Connections is a smart technology tool that will help you identify and engage extended family members. We like to think of Family Connections as a mind-mapping tool—giving you the power to build a supportive network for every child you serve including blood relatives, neighbors, teachers, and members of their religious community.\n\nLogin or Sign Up below to access these powerful connection tools.'}
            </MainText>
            <View style={styles.linkContainer}>
                <View style={styles.logInBtns}>
                    <Button
                        style={styles.buttonStyle}
                        block
                        onPress={() =>
                            authHelpers.handleLogin(
                                authHelpers._loginWithAuth0,
                                props.setUserCreds
                            )}>
                        <Text style={styles.btnText}>Login</Text>
                    </Button>
                    <Button
                        style={styles.buttonStyle}
                        block
                        onPress={() => {
                            props.setModalVisible(true); {/* {props.setModalVisible} */}
                            sendEvent(null, 'click', 'sign-up');
                        }}
                    ><Text style={styles.btnText}>Sign Up</Text>
                    </Button>
                </View>
            </View>
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    logInBtns: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-evenly'
    },
    logOutText: {
        color: '#fff'
    },
    linkContainer: {
        justifyContent: 'space-between',
        flex: 1
    },
    buttonStyle: {
        flex: 1,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#0279AC'
    },
    btnText: {
        color: '#fff'
    },
    button: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'column',
        // justifyContent: 'center',
        marginBottom: 10
    }
});


export default ConnectionsLogin;
