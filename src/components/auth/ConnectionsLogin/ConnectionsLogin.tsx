import React from 'react';
import { View, Text, Linking, StyleSheet, Modal } from 'react-native';
import { Button, Container } from 'native-base';
import { login, clearLoginError } from '../../../store/actions';
import { RootState } from '../../../store/reducers';
import { AuthState } from '../../../store/reducers/authReducer';
import { SafeAreaView } from 'react-native-safe-area-context';
import constants from '../../../helpers/constants';
import Loader from '../../Loader';
import { connect } from 'react-redux';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { UserFullFragment_userTeam_team } from '../../../generated/UserFullFragment';

const styles = StyleSheet.create({
    safeAreaView: {
        backgroundColor: constants.backgroundColor,
        flex: 1, // fill screen
    },
    logInBtns: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-evenly',
    },
    container: {
        backgroundColor: '#fff',
        padding: 20,
    },
    mainText: {
        fontSize: 16,
        lineHeight: 26,
        marginBottom: 4,
    },
    linkText: {
        color: '#0279AC',
        marginTop: 20,
        textAlign: 'center',
        marginBottom: 20,
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    openButton: {
        backgroundColor: '#F194FF',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});

interface StateProps {
    auth: AuthState;
    team?: UserFullFragment_userTeam_team;
}

interface DispatchProps {
    login: typeof login;
    clearLoginError: typeof clearLoginError;
}

type Props = StateProps & DispatchProps;

function ConnectionsLogin(props: Props): JSX.Element {
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
    // run any time there a change to auth
    /* useEffect(() => {
        console.log('useEffect: ConnectionsLogin');
        /**
         * login(true) is safe to call anytime
         * Inside the function it ensures only one execution at a
         * time.
         */
    //  props.login(true);
    //}, []);

    //console.log(JSON.stringify(props.auth, null, 2));
    if (props.auth.isLoggingIn || props.auth.isLoggingOut) {
        return (
            <SafeAreaView style={{ ...styles.safeAreaView }}>
                <Loader />
            </SafeAreaView>
        );
    } else if (props.auth.isLoggedIn && props.team) {
        return (
            <SafeAreaView style={{ ...styles.safeAreaView }}>
                <Text>You are now logged in</Text>
            </SafeAreaView>
        );
    } else if (props.auth.loginError) {
        return (
            <SafeAreaView style={{ ...styles.safeAreaView }}>
                <View style={styles.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={true}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>
                                    There was an error logging in.
                                </Text>
                                <Text style={styles.modalText}>
                                    {props.auth.loginError}
                                </Text>

                                <TouchableHighlight
                                    style={{
                                        ...styles.openButton,
                                        backgroundColor: '#2196F3',
                                    }}
                                    onPress={() => props.clearLoginError()}
                                >
                                    <Text style={styles.textStyle}>OK</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </Modal>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ ...styles.safeAreaView }}>
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
                {!props.auth.isLoggedIn && (
                    <Text style={styles.mainText}>
                        If you have been invited to use Family Connections, you
                        can login.
                    </Text>
                )}
                {!props.auth.isLoggedIn && (
                    <View style={styles.linkContainer}>
                        <View style={styles.logInBtns}>
                            <Button
                                style={styles.buttonStyle}
                                block
                                onPress={async () => props.login()}
                            >
                                <Text style={styles.btnText}>Login</Text>
                            </Button>
                        </View>
                    </View>
                )}
            </Container>
        </SafeAreaView>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        auth: state.auth,
        team: state.me.results?.userTeam?.team,
    };
};

export default connect<StateProps, DispatchProps, {}>(mapStateToProps, {
    login,
    clearLoginError,
})(ConnectionsLogin);
