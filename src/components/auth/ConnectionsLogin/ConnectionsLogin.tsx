import React from 'react';

import { View, Text, Linking } from 'react-native';

import { Button } from 'native-base';

import MainText from '../../../UI/MainText';
import ScreenContainer from '../../../UI/ScreenContainer';
import { handleLogin } from '../../../helpers/authHelpers';
import styles from './ConnectionsLogin.styles';

export default function ConnectionsLogin(props): JSX.Element {
    function learnMorePressed(): void {
        Linking.openURL(
            'https://www.connectourkids.org/tools/family-connections'
        );
    }

    function signUpPressed(): void {
        Linking.openURL(
            'https://www.connectourkids.org/tools/family-connections#request-access'
        );
    }

    return (
        <ScreenContainer>
            <MainText>
                Family Connections is a free tool that helps social workers,
                family recruiters, and CASA volunteers identify and engage
                extended family members of children in foster care.
            </MainText>
            <Text style={styles.linkText} onPress={learnMorePressed}>
                Learn More About Family Connections
            </Text>
            <MainText>
                Your team manager can request access, and invite their team
                members into a secure team account.
            </MainText>

            <Text style={styles.linkText} onPress={signUpPressed}>
                Request Team Access
            </Text>
            <MainText>
                If you have been invited to use Family Connections, you can
                login.
            </MainText>
            <View style={styles.linkContainer}>
                <View style={styles.logInBtns}>
                    <Button
                        style={styles.buttonStyle}
                        block
                        onPress={async () => handleLogin(props.setUserCreds)}
                    >
                        <Text style={styles.btnText}>Login</Text>
                    </Button>
                </View>
            </View>
        </ScreenContainer>
    );
}
