import React, { useEffect } from 'react';
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    View,
    Linking,
    Animated,
} from 'react-native';
import { Divider } from 'react-native-elements';
import { logout, login } from '../store/actions';
import { connect } from 'react-redux';
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
        marginLeft: 30,
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
                    {/* // conditional based on whether user is logged in */}
                    {props.auth.isLoggedIn ? (
                        <>
                            <TouchableOpacity
                                onPress={() => {
                                    props.logout();
                                }}
                            >
                                <View style={styles.logout}>
                                    <Text style={styles.logoutText}>
                                        Log Out
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </>
                    ) : null}
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
