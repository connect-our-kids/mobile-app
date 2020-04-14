import React from 'react';

import Login from '../Login';

import { connect } from 'react-redux';

import { setUserCreds, logOut, clearUserCases } from '../../../store/actions';
import { handleLogin } from '../../../helpers/authHelpers';

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
            onLogin={async () => handleLogin(props.setUserCreds)}
            onRegister={async () => handleLogin(props.setUserCreds)}
            email={props.user ? props.user.email : null}
            isLoggedIn={props.isLoggedIn}
            logOut={props.logOut}
            clearUserCases={props.clearUserCases}
            setModalVisible={props.setModalVisible}
        />
    );
}

export default connect(mapStateToProps, {
    setUserCreds,
    logOut,
    clearUserCases,
})(LoginWithAuth0);
