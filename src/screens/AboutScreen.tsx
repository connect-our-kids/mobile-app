import React, { Component } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { logout } from '../store/actions';
import { connect } from 'react-redux';
import { Divider } from 'react-native-elements';
import constants from '../helpers/constants';
import Video from '../components/Video';
import Constants from 'expo-constants';

class AboutScreen extends Component {
    render() {
        const version = Constants.nativeAppVersion;

        return (
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    backgroundColor: constants.backgroundColor,
                }}
            >
                <SafeAreaView
                    style={{
                        width: '95%',
                        backgroundColor: constants.backgroundColor,
                    }}
                >
                    <ScrollView
                        contentContainerStyle={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                lineHeight: 26,
                                marginBottom: 4,
                            }}
                        >
                            Connect Our Kids makes free tools for social
                            workers, family recruiters, and CASA volunteers
                            engaged in permanency searches for kids in foster
                            care.
                        </Text>

                        <Video uri={constants.aboutURI} />
                        <Text
                            style={{
                                color: constants.highlightColor,
                                fontSize: 14,
                                marginBottom: 15,
                                fontWeight: 'bold',
                            }}
                        >
                            Video not loading?
                            <Text
                                style={{
                                    textDecorationLine: 'underline',
                                    fontWeight: 'bold',
                                }}
                            >
                                Tap here.
                            </Text>
                        </Text>
                        <Divider
                            style={{ height: 1, backgroundColor: '#E5E4E2' }}
                        />

                        <Text>{`V${version}`}</Text>
                        <Text
                            style={{
                                fontSize: 12,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                textAlign: 'center',
                                color: '#AAA9AD',
                            }}
                        ></Text>
                    </ScrollView>
                </SafeAreaView>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const { isLoggedIn } = state.auth;
    return {
        isLoggedIn,
    };
};

export default connect(mapStateToProps, { logOut: logout })(AboutScreen);
