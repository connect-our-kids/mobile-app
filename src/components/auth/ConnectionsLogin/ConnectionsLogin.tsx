import React from 'react';

import {
    View,
    Text,
    Linking,
} from 'react-native';

import { Button } from 'native-base';

import MainText from '../../../UI/MainText';
import ScreenContainer from '../../../UI/ScreenContainer';
import authHelpers from '../../../helpers/authHelpers';
import styles from './ConnectionsLogin.styles';

import { sendEvent } from '../../../helpers/createEvent';


export default function ConnectionsLogin(props): JSX.Element {

    function learnMorePressed(): void {

        Linking.openURL('https://www.connectourkids.org/tools/family-connections');

    }

    return (
        <ScreenContainer>
            <MainText>
                Family Connections helps social workers, family recruiters, and CASA volunteers identify and engage extended family members of children in foster care.
            </MainText>
            <Text
                style={styles.linkText}
                onPress={learnMorePressed}
            >
                Learn More About Family Connections
            </Text>
            <View style={styles.linkContainer}>
                <View style={styles.logInBtns}>
                    <Button
                        style={styles.buttonStyle}
                        block
                        onPress={(): void =>
                            authHelpers.handleLogin(
                                authHelpers._loginWithAuth0,
                                props.setUserCreds,
                            )}
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
            </View>
        </ScreenContainer>
    );

}
