import React, { Component } from 'react';
import {
    SafeAreaView,
    Text,
    Linking,
    StatusBar,
    ScrollView,
    TouchableHighlight,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { setUserCreds, logOut } from '../store/actions';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import headerConfig from '../helpers/headerConfig';
import constants from '../helpers/constants';
import MainText from '../UI/MainText';
import ScreenContainer from '../UI/ScreenContainer';

const TermsOfServiceScreen = (props) => {
    return (
        <ScreenContainer>
            <SafeAreaView>
                <StatusBar barStyle="dark-content" />
                <ScrollView>
                    <MainText style={styles.mainText}>
                        Interested in viewing our Terms of Service?
                    </MainText>
                    <Text onPress={() => Linking.openURL('https://www.connectourkids.org/terms')}>Click HERE!</Text>
                </ScrollView>
            </SafeAreaView>
        </ScreenContainer >
    );
};

const mapStateToProps = (state) => {
    const { isLoggedIn } = state.auth;
    return {
        isLoggedIn,
    };
};

export default connect(
    mapStateToProps,
    { setUserCreds, logOut },
)(TermsOfServiceScreen);


