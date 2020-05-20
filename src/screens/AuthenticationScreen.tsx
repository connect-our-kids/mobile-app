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
import { RootState } from '../store/reducers';
import { NavigationScreenProp, NavigationState } from 'react-navigation';

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

type Navigation = NavigationScreenProp<NavigationState>;

const AuthenticationView = (props: {
    modalVisible: boolean | undefined;
    setModalVisible: {
        (arg0: boolean): void;
        (arg0: boolean): void;
        (arg0: boolean): void;
    };
    videoAgree: boolean;
    videoVisible: boolean;
    setAgreeModalVisible: (arg0: boolean) => void;
    setVideoPlayerModalVisible: (arg0: boolean) => void;
    login: (arg0?: boolean) => void;
    navigation: Navigation;
}) => {
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

const mapStateToProps = (state: RootState) => {
    const { modalVisible, videoAgree, videoVisible } = state.auth;

    return {
        modalVisible,
        videoAgree,
        videoVisible,
    };
};

export default connect(mapStateToProps, {
    setModalVisible,
    setAgreeModalVisible,
    setVideoPlayerModalVisible,
    login,
})(AuthenticationView);
