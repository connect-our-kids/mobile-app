import React from 'react';
import { connect } from 'react-redux';
import { logout, login, setModalVisible } from '../../../store/actions';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'native-base';
import { Avatar, Divider } from 'react-native-elements';
import { sendEvent } from '../../../helpers/createEvent';
import { RootState } from '../../../store/reducers';
import { NavigationScreenProp, NavigationState } from 'react-navigation';

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
    isLoggedIn: boolean;
    picture?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
}

interface DispatchProps {
    login: typeof login;
    logout: typeof logout;
    setModalVisible: typeof setModalVisible;
}

type Navigation = NavigationScreenProp<NavigationState>;

interface OwnProps {
    navigation: Navigation;
}

type Props = StateProps & DispatchProps & OwnProps;

function LoginWithAuth0(props: Props): JSX.Element {
    if (props.isLoggedIn) {
        return (
            <View style={styles.view1}>
                <View style={styles.view2}>
                    {props.picture ? (
                        <Avatar
                            rounded
                            size="large"
                            source={{ uri: props.picture }}
                        />
                    ) : null}

                    <Text style={{ paddingTop: 10 }}>
                        {props.firstName
                            ? 'Welcome back, ' + props.firstName + '!'
                            : 'Welcome to Connect Our Kids!'}
                    </Text>

                    <Divider style={styles.divider} />
                </View>

                <View style={styles.view3}>
                    <Text style={styles.view3Text}>Information</Text>
                </View>

                <View style={styles.view4}>
                    <View style={styles.view5}>
                        <Text style={styles.view5Text}>First Name</Text>
                        <Text style={styles.view5Text}>Last Name</Text>
                        <Text style={styles.view5Text}>Email</Text>
                    </View>
                    <View style={styles.view6}>
                        <View style={styles.view7}>
                            <Text style={styles.text}>{props.firstName}</Text>
                        </View>
                        <View style={styles.view8And9}>
                            <Text style={styles.text}>{props.lastName}</Text>
                        </View>
                        <View style={styles.view8And9}>
                            <Text style={styles.text}>{props.email}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.linkContainer}>
                    <View style={styles.logInButtons}>
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
                    </View>
                </View>
            </View>
        );
    } else {
        return (
            <View style={styles.view1}>
                <View style={styles.linkContainer}>
                    <View style={styles.logInButtons}>
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
                                onPress={() => {
                                    props.setModalVisible(true);
                                    sendEvent(null, 'click', 'sign-up');
                                }}
                            >
                                <Text style={styles.btnText}>Sign Up</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        isLoggedIn: state.auth.isLoggedIn,
        picture: state.me.results?.picture ?? state.auth.user?.email,
        firstName: state.me.results?.firstName ?? state.auth.user?.given_name,
        lastName: state.me.results?.lastName ?? state.auth.user?.family_name,
        email: state.me.results?.email ?? state.auth.user?.email,
    };
};

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, {
    logout,
    login,
    setModalVisible,
})(LoginWithAuth0);
