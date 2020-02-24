import React from 'react';
import { SafeAreaView, Text, Linking, StatusBar, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { setUserCreds, logOut } from '../store/actions';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import headerConfig from '../helpers/headerConfig';
import constants from '../helpers/constants';
import MainText from '../UI/MainText';
import ScreenContainer from '../UI/ScreenContainer';
import authHelpers from '../helpers/authHelpers';

const PrivacyPolicyScreen = props => {
    return (
        <ScreenContainer>
            <SafeAreaView>
                <StatusBar barStyle="dark-content" />
                <ScrollView>
                    <MainText style={styles.mainText}>
                        Interested in viewing our Privacy Policy?
                    </MainText>
                    <Text onPress={() => Linking.openURL('https://www.connectourkids.org/privacy')}>Click HERE!</Text>
                </ScrollView>
            </SafeAreaView>
        </ScreenContainer >
    );
}

const mapStateToProps = state => {
    const { isLoggedIn } = state.auth;
    return {
        isLoggedIn
    };
};

export default connect(
    mapStateToProps,
    { setUserCreds, logOut }
)(PrivacyPolicyScreen);


