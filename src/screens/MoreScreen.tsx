import React, { useEffect } from 'react';
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    View,
    Linking,
    Animated,
    Image,
    Modal,
} from 'react-native';
import { Divider } from 'react-native-elements';
import { logout, login } from '../store/actions';
import { connect, useDispatch } from 'react-redux';
import constants from '../helpers/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { RootState } from '../store/reducers';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { AuthState } from '../store/reducers/authReducer';

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: constants.backgroundColor,
    },
    launchIcon: {
        color: 'rgba(24, 23, 21, 0.3)',
        marginRight: 32,
        fontSize: 22,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: constants.backgroundColor,
    },
    half: {
        height: '50%',
    },
    linkBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 30,
    },
    arrow: {
        color: 'rgba(24, 23, 21, 0.3)',
        marginRight: 40,
    },
    text: {
        color: '#444444',
        fontSize: 18,
        paddingBottom: 15,
        paddingTop: 15,
        marginRight: 'auto',
        paddingLeft: 15,
    },
    withBorder: {
        borderColor: 'rgba(24, 23, 21, 0.1)',
        borderBottomWidth: 1,
    },
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: 'rgba(24, 23, 21, 0.1)',
    },
    logout: {
        borderColor: '#0279AC',
        borderWidth: 1,
        borderRadius: 10,
        width: 160,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutText: {
        color: '#0279AC',
    },
    modal: {
        margin: 50,
        marginTop: 425,
        backgroundColor: 'white',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        padding: 35,
        alignItems: 'center',
        alignContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalText: {
        textTransform: 'uppercase',
        color: '#fff',
    },
    saveButton: {
        backgroundColor: '#0279AC',
        padding: 10,
        width: '50%',
        marginTop: 25,
        borderRadius: 25,
        alignItems: 'center',
    },
});

interface StateProps {
    auth: AuthState;
}

interface DispatchProps {
    login: typeof login;
    logout: typeof logout;
}

type Navigation = NavigationScreenProp<NavigationState>;

interface OwnProps {
    navigation: Navigation;
}

type Props = StateProps & DispatchProps & OwnProps;

const MoreScreen = (props: Props) => {
    // refresh auth one time at page load
    useEffect(() => {
        props.login(true);
    }, []);
    const dispatch = useDispatch();

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <Animated.View style={styles.container}>
                <View style={styles.half}>
                    <TouchableOpacity
                        style={[styles.linkBox, styles.withBorder]}
                        onPress={() => props.navigation.navigate('MyAccount')}
                    >
                        <Ionicons name="md-person" size={32} color="#0279AC" />
                        <Text style={[styles.text]}>My Account</Text>
                        <Text style={styles.arrow}>❯</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.linkBox, styles.withBorder]}
                        onPress={() => props.navigation.navigate('About')}
                    >
                        <Ionicons
                            name="md-information-circle-outline"
                            size={32}
                            color="#0279AC"
                        />
                        <Text style={[styles.text]}>About</Text>
                        <Text style={styles.arrow}>❯</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.linkBox, styles.withBorder]}
                        onPress={() =>
                            Linking.openURL(
                                'https://www.connectourkids.org/contact'
                            )
                        }
                    >
                        <Ionicons name="md-cog" size={32} color="#0279AC" />
                        <Text style={[styles.text]}>Support</Text>
                        <MaterialIcons
                            name={'launch'}
                            style={styles.launchIcon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.linkBox, styles.withBorder]}
                        onPress={() =>
                            Linking.openURL(
                                'https://www.connectourkids.org/privacy'
                            )
                        }
                    >
                        <Ionicons name="md-key" size={32} color="#0279AC" />
                        <Text style={[styles.text]}>Privacy Policy</Text>
                        <MaterialIcons
                            name={'launch'}
                            style={styles.launchIcon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.linkBox}
                        onPress={() =>
                            Linking.openURL(
                                'https://www.connectourkids.org/terms'
                            )
                        }
                    >
                        <Ionicons name="md-paper" size={32} color="#0279AC" />
                        <Text style={styles.text}>Terms of Service</Text>
                        <MaterialIcons
                            name={'launch'}
                            style={styles.launchIcon}
                        />
                    </TouchableOpacity>

                    <Divider style={styles.divider} />
                </View>

                <View
                    style={[
                        styles.half,
                        { justifyContent: 'center', alignItems: 'center' },
                    ]}
                >
                    {/* // conditional based on whether users logout failed or was successful, with loader */}
                    {props.auth.isLoggedIn ? (
                        <>
                            <TouchableOpacity
                                onPress={() => {
                                    props.logout();
                                }}
                            >
                                {/* conditional based on logout failing  */}
                                {props.auth.isLoggingOut ? (
                                    <Image
                                        source={require('../../assets/loading.gif')}
                                        style={{ width: 80, height: 80 }}
                                    />
                                ) : (
                                    <>
                                        <Modal
                                            animationType={'fade'}
                                            transparent={true}
                                            visible={props.auth.loggedOutfail}
                                            onRequestClose={() => {
                                                console.log(
                                                    'Modal has been closed.'
                                                );
                                            }}
                                        >
                                            <View style={styles.modal}>
                                                <Text>
                                                    Error while logging out!
                                                </Text>
                                                <TouchableOpacity
                                                    style={styles.saveButton}
                                                    onPress={() => {
                                                        dispatch({
                                                            type:
                                                                'LOG_OUT_MODAL_CLOSED',
                                                        });
                                                    }}
                                                >
                                                    <Text
                                                        style={styles.modalText}
                                                    >
                                                        Okay
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </Modal>
                                        <View style={styles.logout}>
                                            <Text style={styles.logoutText}>
                                                Log Out
                                            </Text>
                                        </View>
                                    </>
                                )}
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Modal
                                animationType={'fade'}
                                transparent={true}
                                visible={props.auth.loggedOutSuccess}
                                onRequestClose={() => {
                                    console.log('Modal has been closed.');
                                }}
                            >
                                <View style={styles.modal}>
                                    <Text>Successfully logged out!</Text>
                                    <TouchableOpacity
                                        style={styles.saveButton}
                                        onPress={() => {
                                            dispatch({
                                                type: 'LOG_OUT_MODAL_CLOSED',
                                            });
                                        }}
                                    >
                                        <Text style={styles.modalText}>
                                            Okay
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </Modal>
                        </>
                    )}
                </View>
            </Animated.View>
        </SafeAreaView>
    );
};

const mapStateToProps = (state: RootState) => {
    return {
        auth: state.auth,
    };
};

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, {
    login,
    logout,
})(MoreScreen);
