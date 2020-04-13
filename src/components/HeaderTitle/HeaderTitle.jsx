import React from 'react';

import { View, Image, Platform, TouchableWithoutFeedback } from 'react-native';

import logoImg from '../../../assets/logo.png';

import { sendEvent } from '../../helpers/createEvent';

import { connect } from 'react-redux';

import styles from './HeaderTitle.styles';

/**********************************************************/

function mapStateToProps(state) {
    return {
        email: state.auth.user ? state.auth.user.email : null,
    };
}

function HeaderTitle(props) {
    // title should be the string of the components name
    return (
        <View style={styles.view1}>
            {/* on android the text renders left aligned and therefore we put the logo next to it, ios renders centered */}
            {Platform.OS === 'android' ? (
                <TouchableWithoutFeedback
                    onPress={() => {
                        props.navigation.navigate('FamilyConnections');
                        sendEvent(props.email, 'click', 'logo');
                    }}
                >
                    <Image
                        source={logoImg}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                </TouchableWithoutFeedback>
            ) : null}
        </View>
    );
}

export default connect(mapStateToProps, {})(HeaderTitle);
