// no typescript needed

import React from 'react';
import { View, Text, StyleSheet, Linking, ScrollView } from 'react-native';
import { Button } from 'native-base';
import { Avatar, Divider } from 'react-native-elements';
import constants from '../../../helpers/constants';
import { sendEvent } from '../../../helpers/createEvent';
import NavigationButton from '../../../UI/NavigationButton';
import ScreenContainer from '../../../UI/ScreenContainer';
import MainText from '../../../UI/MainText';

const Login = (props) => {
    return (
        <View style={{ width: '100%' }}>
            <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 15, paddingBottom: 15 }}>
                {props.idToken && props.idToken.picture
                    ? <Avatar
                        rounded
                        size="large"
                        source={{
                            uri: props.idToken.picture,
                        }}
                    /> : null}
                <Text>
                    {props.isLoggedIn && props.idToken && props.idToken.email
                        ? 'Welcome back, ' + props.idToken.given_name + '!'
                        : 'Welcome to Connect Our Kids!'}
                </Text>
                {props.isLoggedIn && props.idToken && props.idToken.email
                    ? <Divider style={{ width: '100%', height: 1, backgroundColor: '#E5E4E2', marginTop: 20, marginBottom: 6 }} /> : null}
            </View>

            {props.isLoggedIn && props.idToken
      && <View style={{ paddingLeft: 10 }}><Text style={{ fontWeight: 'bold', fontSize: 20 }}>Information</Text></View>}
            {props.isLoggedIn && props.idToken
      && <View style={{ flexDirection: 'row', padding: 10 }}>
          <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', width: '30%' }}>
              <Text style={{ marginTop: 6, marginBottom: 6, fontSize: 16 }}>First Name</Text>
              <Text style={{ marginTop: 6, marginBottom: 6, fontSize: 16 }}>Last Name</Text>
              <Text style={{ marginTop: 6, marginBottom: 6, fontSize: 16 }}>Email</Text>
          </View>
          <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', width: '70%' }} >
              <View style={{
                  width: '100%',
                  borderBottomColor: '#E5E4E2',
                  borderBottomWidth: 1,
              }}>
                  <Text style={styles.text}>
                      {props.isLoggedIn && props.idToken && props.idToken.given_name
                          ? props.idToken.given_name
                          : null}
                  </Text>
              </View>
              <View style={{
                  width: '100%',
                  borderBottomColor: '#E5E4E2',
                  borderBottomWidth: 1,
              }}>
                  <Text style={styles.text}>
                      {props.isLoggedIn && props.idToken && props.idToken.family_name
                          ? props.idToken.family_name
                          : null}
                  </Text>
              </View>
              <View style={{
                  width: '100%',
                  borderBottomColor: '#E5E4E2',
                  borderBottomWidth: 1,
              }}>
                  <Text style={styles.text}>
                      {props.isLoggedIn && props.idToken && props.idToken.name
                          ? props.idToken.name
                          : null}
                  </Text>
              </View>
          </View>
      </View>}
            <View style={styles.linkContainer}>
                <View style={styles.logInBtns}>
                    {props.isLoggedIn ? (
                        <View style={{ width: '50%', marginTop: 40 }}>
                            <Button
                                style={[ styles.button, { backgroundColor: 'red', alignItems: 'center', justifyContent: 'center' } ]}
                                onPress={() => {
                                    props.idToken && props.idToken.email ? props.logOut(props.idToken.email) : props.logOut();
                                    props.clearUserCases();
                                }}
                                block
                            >
                                <Text style={styles.logOutText}>Log Out</Text>
                            </Button>
                        </View>
                    ) : (
                        <View style={styles.logInBtns}>
                            <Button style={styles.buttonStyle} block onPress={props.onLogin}>
                                <Text style={styles.btnText}>Login </Text>
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
                    )}
                </View>
                {/* <View>
          <NavigationButton
            titleText="Resources"
            subTitleText="Useful Materials and Information"
            handlePress={() => Linking.openURL('https://connectourkids.org')}
            style={{ marginBottom: 20 }}
          />
        </View> */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    logInBtns: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-evenly',
    },
    logOutText: {
        color: '#fff',
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
    // marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 6,
        marginBottom: 6,
        fontSize: 15,

    },
});

export default Login;
