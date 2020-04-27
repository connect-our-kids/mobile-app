import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import LoginWithAuth0 from '../components/auth/LoginWithAuth0';
import { connect } from 'react-redux';
import RegisterModalsContainer from '../components/auth/RegisterModalsContainer';
import {
    setModalVisible,
    setAgreeModalVisible,
    setVideoPlayerModalVisible,
    login,
} from '../store/actions';
import { SafeAreaView } from 'react-native-safe-area-context';
import constants from '../helpers/constants';

const styles = StyleSheet.create({
    safeAreaView: {
        backgroundColor: constants.backgroundColor,
        flex: 1, // fill screen
        margin: 5,
    },
    registerContainer: {
        backgroundColor: constants.backgroundColor,
        flex: 1,
    },
});

const AuthenticationView = (props) => {
    useEffect(() => {
        props.login(true);
    }, []);

    return (
        <View style={styles.registerContainer}>
            <SafeAreaView style={styles.safeAreaView}>
                <StatusBar barStyle="dark-content" />
                <RegisterModalsContainer
                    modalVisible={props.modalVisible}
                    setAgreeModalVisible={props.setAgreeModalVisible}
                    videoAgree={props.videoAgree}
                    videoVisible={props.videoVisible}
                    setModalVisible={props.setModalVisible}
                    setVideoPlayerModalVisible={
                        props.setVideoPlayerModalVisible
                    }
                    onLogin={async () => props.login()}
                />
                {!props.modalVisible && <LoginWithAuth0 {...props} />}
            </SafeAreaView>
        </View>
    );
};

const mapStateToProps = (state) => {
    const { modalVisible, videoAgree, videoVisible } = state.auth;
    const { idToken, loadingUser } = state.auth;

    return {
        modalVisible,
        videoAgree,
        videoVisible,
        idToken,
        loadingUser,
    };
};

export default connect(mapStateToProps, {
    setModalVisible,
    setAgreeModalVisible,
    setVideoPlayerModalVisible,
    login,
})(AuthenticationView);
