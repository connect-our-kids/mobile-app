import React from 'react';

import {
    View,
    Image,
    Platform,
    TouchableWithoutFeedback,
} from 'react-native';

import logoImg from '../../../assets/logo.png';

import { sendEvent } from '../../helpers/createEvent';

import { connect } from 'react-redux';

/**********************************************************/

function HeaderTitle(props) {
    // title should be the string of the components name
    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
        }}>
            {/* on android the text renders left aligned and therefore we put the logo next to it, ios renders centered */}
            {(Platform.OS === 'android') ? (
                <TouchableWithoutFeedback
                    onPress={() => {
                        props.navigation.navigate('FamilyConnections');
                        sendEvent(props.email, 'click', 'logo');
                    }}
                >
                    <Image
                        source={logoImg}
                        style={{
                            width: 225,
                            height: 90,
                        }}
                        resizeMode="contain"
                    />
                </TouchableWithoutFeedback>
            ) : null}
            {/* <Text style={styles.text}>{title}</Text> */}

        </View>
    );
}

// const styles = StyleSheet.create({
//   text: {
//     color: 'white',
//     fontSize: 25,
//     fontFamily: constants.headerFont
//   }
// });

const mapStateToProps = (state) => {
    return { email: state.auth.user ? state.auth.user.email : null };
};

export default connect(
    mapStateToProps,
    {},
)(HeaderTitle);
