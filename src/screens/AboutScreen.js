import React, { Component } from 'react';
import { SafeAreaView, Text, Linking, StatusBar, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';
import { setUserCreds, logOut } from '../store/actions';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { Divider } from 'react-native-elements';
import headerConfig from '../helpers/headerConfig';
import constants from '../helpers/constants';
import Video from '../components/Video/Video';
import MainText from '../UI/MainText';
import NavigationButton from '../UI/NavigationButton';
import ScreenContainer from '../UI/ScreenContainer';
import appJSON from '../../app.json';

class AboutScreen extends Component {
  static navigationOptions = ({ navigation }) =>
      headerConfig('About', navigation);

  render() {
      function getYear() {
          const year = new Date()
          return year.getFullYear()
      }

      const version = appJSON.expo.version

      return (
          <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
              <SafeAreaView style={{ width: '95%' }}>
                  <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                      <MainText>
              Connect Our Kids makes free tools for social workers engaged in
              permanency searches for foster kids. Watch the video below to learn more about the free tools and resources in this app.
                      </MainText>

                      <Video uri={constants.aboutURI} />
                      <Text
                          style={{
                              fontFamily: constants.fontFamily,
                              color: constants.highlightColor,
                              fontSize: 14,
                              marginBottom: 15,
                              fontWeight: 'bold'
                          }}
                      >
            Video not loading?<Text style={{ textDecorationLine: 'underline', fontWeight: 'bold' }}>Tap here.</Text></Text>
                      <Divider style={{ height: 1, backgroundColor: '#E5E4E2' }} />

                      {/* Redirect links to website below */}
                      {/* <Text onPress={() => Linking.openURL('https://www.connectourkids.org/terms')}>Click Here to view the Terms of Service.</Text>
            <Text onPress={() => Linking.openURL('https://www.connectourkids.org/privacy')}>Click Here to view Privacy Policy.</Text>
            <Text onPress={() => Linking.openURL('https://www.connectourkids.org/contact')}>Click HERE to contact us!</Text> */}

                      <Text>
                          {`V${version}`}
                      </Text>
                      <Text
                          style={{
                              fontSize: 12,
                              flexDirection: 'column',
                              justifyContent: 'center',
                              textAlign: 'center',
                              color: "#AAA9AD",
                          }}
                      >
                          {`Copyright ${getYear()} © Connect Our Kids.\nAll Rights Reserved.`}
                      </Text>
                  </ScrollView>
              </SafeAreaView>
          </View>
      );
  }
}

const mapStateToProps = state => {
    const { isLoggedIn } = state.auth;
    return {
        isLoggedIn
    };
};

export default connect(
    mapStateToProps,
    { setUserCreds, logOut }
)(AboutScreen);
