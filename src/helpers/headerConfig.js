import HeaderTitle from './../components/HeaderTitle';
import logoImg from '../../assets/logo.png';
import {
    Image,
    Platform,
    TouchableWithoutFeedback,
    StyleSheet,
} from 'react-native';
import React from 'react';
import { sendEvent } from '../helpers/createEvent';
import constants from '../helpers/constants';

export default (headerConfig = (title, navigation, email) => {


    return {
    // headerTitle: <HeaderTitle title={title} navigation={navigation} />,
        headerStyle: {
            backgroundColor: 'white',
            height: 52,
        },
        headerLeft:
      Platform.OS === 'ios' ? (
          <TouchableWithoutFeedback
              onPress={() => {
                  navigation.navigate('FamilyConnections');
                  sendEvent(email, 'click', 'logo');
              }}
          >
              <Image
                  source={logoImg}
                  style={styles.imageStyles}
                  resizeMode="contain"
              />
          </TouchableWithoutFeedback>
      ) : null,
    // headerRight:
    // (navigation.state.routeName !== 'MyAccount') ?
    // (
    //   <TouchableWithoutFeedback
    //     onPress={() => {
    //       navigation.navigate('MyAccount')
    //     }}
    //   >
    //   <Ionicons
    //     name="ios-menu"
    //     size={32} color='white'
    //     style={{ width: 32, height: 32, marginHorizontal: 10 }}
    //     resizeMode="contain"
    //   />
    //   </TouchableWithoutFeedback>
    // ) : (
    //   <TouchableWithoutFeedback
    //     onPress={() => {
    //       navigation.goBack()
    //     }}
    //   >
    //   <Feather
    //     name="x"
    //     size={32} color='white'
    //     style={{ width: 32, height: 32, marginHorizontal: 10 }}
    //     resizeMode="contain"
    //   />
    //   </TouchableWithoutFeedback>
    // )
    };
});

const styles = StyleSheet.create({
    imageStyles: { width: 225, height: 90 },
    iconStyles: { fontSize: 40, color: '#000', paddingRight: 20 },
});
