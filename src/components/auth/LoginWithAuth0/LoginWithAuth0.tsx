import React, { Component } from 'react';

import Login from '../Login';

import authHelpers from '../../../helpers/authHelpers';

import { connect } from 'react-redux';

import {
    setUserCreds,
    logOut,
    clearUserCases,
} from '../../../store/actions';

/**********************************************************/

function mapStateToProps(state) {

    const { user, isLoggedIn, authToken, idToken } = state.auth;

    return { user, isLoggedIn, authToken, idToken };

}

function LoginWithAuth0(props): JSX.Element {

    return (
        <Login
            idToken={props.idToken ? props.idToken : null}
            navigation={props.navigation}
            onLogin={(): void =>
                authHelpers.handleLogin(
                    authHelpers._loginWithAuth0,
                    props.setUserCreds,
                )
            }
            onRegister={(): void =>
                authHelpers.handleLogin(
                    authHelpers._loginWithAuth0,
                    props.setUserCreds,
                )
            }
            email={props.user ? props.user.email : null}
            isLoggedIn={props.isLoggedIn}
            logOut={props.logOut}
            clearUserCases={props.clearUserCases}
            setModalVisible={props.setModalVisible}
        />
    );

}

export default connect(
    mapStateToProps,
    {
        setUserCreds,
        logOut,
        clearUserCases,
    },
)(LoginWithAuth0);
