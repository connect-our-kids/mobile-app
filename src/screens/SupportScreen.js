import React from 'react';
import {
    SafeAreaView,
    Text,
    StatusBar,
    StyleSheet,
    Linking
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';
import { setUserCreds, logOut } from '../store/actions';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import headerConfig from '../helpers/headerConfig';
import constants from '../helpers/constants';
import MainText from '../UI/MainText';
import ScreenContainer from '../UI/ScreenContainer';

const SupportScreen = props => {
    return (
        <ScreenContainer>
            <SafeAreaView>
                <StatusBar barStyle="dark-content" />
                <ScrollView style={styles.style}>
                    <MainText >
                        Get in touch!
                    </MainText>
                    <Text style={styles.text} >
                        Have any questions or comments?
                    </Text>
                    <Text onPress={() => Linking.openURL('https://www.connectourkids.org/contact')}>Click HERE to contact us!</Text>
                </ScrollView>
            </SafeAreaView>
        </ScreenContainer >
    );
}

const styles = StyleSheet.create({
    style: {
        width: '100%',
        height: 100,
        backgroundColor: '#b2e3fb',
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        padding: 10
    },
    text: {
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        color: '#baadad'
    }
})

const mapStateToProps = state => {
    const { isLoggedIn } = state.auth;
    return {
        isLoggedIn
    };
};

export default connect(
    mapStateToProps,
    { setUserCreds, logOut }
)(SupportScreen);
