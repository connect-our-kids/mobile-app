import React from 'react';
import { connect } from 'react-redux';
import { logout, login, setModalVisible } from '../../../store/actions';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'native-base';
import { Avatar, Divider } from 'react-native-elements';
import { sendEvent } from '../../../helpers/createEvent';
import { AuthState } from '../../../store/reducers/authReducer';
import { RootState } from '../../../store/reducers';

const styles = StyleSheet.create({
    logInButtons: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-evenly',
    },

    logOutText: {
        color: 'rgb(8,121,169)',
    },

    linkContainer: {
        justifyContent: 'space-between',
        flex: 1,
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

    button: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom: 10,
    },

    text: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 6,
        marginBottom: 6,
        fontSize: 15,
    },

    view1: {
        width: '100%',
    },

    view2: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
    },

    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#E5E4E2',
        marginTop: 20,
        marginBottom: 6,
    },

    view3: {
        paddingLeft: 10,
    },

    view3Text: {
        fontWeight: 'bold',
        fontSize: 20,
    },

    view4: {
        flexDirection: 'row',
        padding: 10,
    },

    view5: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'column',
        width: '30%',
    },

    view5Text: {
        marginTop: 6,
        marginBottom: 6,
        fontSize: 16,
    },

    view6: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '70%',
    },

    view7: {
        width: '100%',
        borderBottomColor: '#E5E4E2',
        borderBottomWidth: 1,
    },

    view8And9: {
        width: '100%',
        borderBottomColor: '#E5E4E2',
        borderBottomWidth: 1,
    },

    view10: {
        width: '50%',
        marginTop: 40,
    },

    view10Button: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'rgb(8,121,169)',
        borderWidth: 1,
    },
});

interface StateProps {
    auth: AuthState;
}

interface DispatchProps {
    login: typeof login;
    logout: typeof logout;
    setModalVisible: typeof setModalVisible;
}

type Props = StateProps & DispatchProps;

function LoginWithAuth0(props: Props): JSX.Element {
    return (
        <View style={styles.view1}>
            <View style={styles.view2}>
                {props.auth.user && props.auth.user.picture ? (
                    <Avatar
                        rounded
                        size="large"
                        source={{ uri: props.auth.user.picture }}
                    />
                ) : null}

                <Text>
                    {props.auth.isLoggedIn &&
                    props.auth.user &&
                    props.auth.user.email
                        ? 'Welcome back, ' + props.auth.user.given_name + '!'
                        : 'Welcome to Connect Our Kids!'}
                </Text>

                {props.auth.isLoggedIn &&
                props.auth.user &&
                props.auth.user.email ? (
                    <Divider style={styles.divider} />
                ) : null}
            </View>

            {props.auth.isLoggedIn && props.auth.user ? (
                <View style={styles.view3}>
                    <Text style={styles.view3Text}>Information</Text>
                </View>
            ) : null}

            {props.auth.isLoggedIn && props.auth.user ? (
                <View style={styles.view4}>
                    <View style={styles.view5}>
                        <Text style={styles.view5Text}>First Name</Text>
                        <Text style={styles.view5Text}>Last Name</Text>
                        <Text style={styles.view5Text}>Email</Text>
                    </View>
                    <View style={styles.view6}>
                        <View style={styles.view7}>
                            <Text style={styles.text}>
                                {props.auth.isLoggedIn &&
                                props.auth.user &&
                                props.auth.user.given_name
                                    ? props.auth.user.given_name
                                    : null}
                            </Text>
                        </View>
                        <View style={styles.view8And9}>
                            <Text style={styles.text}>
                                {props.auth.isLoggedIn &&
                                props.auth.user &&
                                props.auth.user.family_name
                                    ? props.auth.user.family_name
                                    : null}
                            </Text>
                        </View>
                        <View style={styles.view8And9}>
                            <Text style={styles.text}>
                                {props.auth.isLoggedIn &&
                                props.auth.user &&
                                props.auth.user.email
                                    ? props.auth.user.email
                                    : null}
                            </Text>
                        </View>
                    </View>
                </View>
            ) : null}
            <View style={styles.linkContainer}>
                <View style={styles.logInButtons}>
                    {props.auth.isLoggedIn ? (
                        <View style={styles.view10}>
                            <Button
                                style={[styles.button, styles.view10Button]}
                                onPress={() => {
                                    props.logout();
                                }}
                                block
                            >
                                <Text style={styles.logOutText}>Log Out</Text>
                            </Button>
                        </View>
                    ) : (
                        <View style={styles.logInButtons}>
                            <Button
                                style={styles.buttonStyle}
                                block
                                onPress={() => props.login()}
                            >
                                <Text style={styles.btnText}>Login</Text>
                            </Button>
                            <Button
                                style={styles.buttonStyle}
                                block
                                onPress={(): void => {
                                    props.setModalVisible(true);
                                    sendEvent(null, 'click', 'sign-up');
                                }}
                            >
                                <Text style={styles.btnText}>Sign Up</Text>
                            </Button>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}

function mapStateToProps(state: RootState) {
    return { auth: state.auth };
}

export default connect<StateProps, DispatchProps, {}>(mapStateToProps, {
    logout,
    login,
    setModalVisible,
})(LoginWithAuth0);
