import React from 'react';
import { View, Text, Linking } from 'react-native';
import { Button, Container } from 'native-base';
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
        <Container style={styles.container}>
            <Text style={styles.mainText}>
                Family Connections is a free tool that helps social workers,
                family recruiters, and CASA volunteers identify and engage
                extended family members of children in foster care.
            </Text>
            <Text style={styles.linkText} onPress={learnMorePressed}>
                Learn More About Family Connections
            </Text>
            <Text style={styles.mainText}>
                Your team manager can request access, and invite their team
                members into a secure team account.
            </Text>

            <Text style={styles.linkText} onPress={signUpPressed}>
                Request Team Access
            </Text>
            <Text style={styles.mainText}>
                If you have been invited to use Family Connections, you can
                login.
            </Text>
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
        </Container>
    );
}
