import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    StatusBar,
    Modal,
} from 'react-native';
import { connect } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import {
    fetchPerson,
    fetchSearchResult,
    resetState,
    setModalVisible,
    setAgreeModalVisible,
    setUserCreds,
    setVideoPlayerModalVisible,
    getInfo,
} from '../store/actions';

import { Container } from 'native-base';
import { ScrollView, FlatList } from 'react-native-gesture-handler';

import PersonRow from '../components/Person/PersonRow';
import headerConfig from '../helpers/headerConfig';
import constants from '../helpers/constants';
import SearchForm from '../components/SearchForm/SearchForm';
import { sendEvent } from '../helpers/createEvent';
import Loader from '../components/Loader/Loader';

import authHelpers from '../helpers/authHelpers';
import RegisterModalsContainer from './../components/auth/RegisterModalsContainer.tsx';

class PeopleSearchScreen extends React.Component {
  static navigationOptions = ({ navigation }) =>
      headerConfig('People Search', navigation);

  state = {
      data: this.props.info,
      type: this.props.type,
      videoPlayerOpen: false,
      modalVisible: false,
      terms: false,
      privacy: false,
  };

  componentDidMount() {

  }

  handleEncodeURI = (person) => {
      return encodeURI(JSON.stringify(person));
  };

  handleSearchRequest = async (person, searchType) => {
      const accessToken = await SecureStore.getItemAsync('cok_access_token');
      const idToken = await SecureStore.getItemAsync('cok_id_token');
      const {
          // accessToken,
          fetchSearchResult,
          // idToken,
          isLoggedIn,
          navigation,
          user,
      } = this.props;

      const body = {};
      const requestObject = {};

      if (isLoggedIn) {
          requestObject['authToken'] = accessToken;
          requestObject['idToken'] = idToken;
      }
      body['searchType'] = searchType;

      requestObject['person'] = this.handleEncodeURI(person);
      body['requestObject'] = JSON.stringify(requestObject);

      if (this.props.person || this.props.possiblePersons.length) {
          this.props.resetState();
      }

      fetchSearchResult(
          body,
          () => navigation.navigate('SearchResult'),
          user ? user.email : null,
      );


  };

  handleNavigateToResult = async (searchPointer) => {
      const { person } = this.state;
      if (!person) {
          await this.handlePersonRequest(searchPointer);
      }
      await this.props.navigation.navigate('SearchResult', {
          person: person,
      });
  };

  openVideo = () => {
      this.setState({ videoPlayerOpen: true });
      sendEvent(
          this.props.isLoggedIn ? this.props.user.email : 'anonymous@unknown.org',
          'open',
          'introduction-video',
      );
  };

  closeVideo = () => {
      this.setState({ videoPlayerOpen: false });
      sendEvent(
          this.props.isLoggedIn ? this.props.user.email : 'anonymous@unknown.org',
          'close',
          'introduction-video',
      );
  };

  closeModal = () => {
      this.setState({ modalVisible: false });
  };

  openModal = () => {
      this.setState({ modalVisible: true });
  };

  controlModal = (key, value) => {
      this.setState({ [key]: value });
  };

  resetReduxState = () => {
      const { resetState } = this.props;
      resetState();
  };

  startRegister = () => {
      this.props.setModalVisible(true);
  };

  showSearchErrorMessage = (message) => {
      this.setState({ ...this.state, errorMessgae: message });
  }

  render() {
      const { isLoggedIn, navigation } = this.props;
      return (
          <Container style={styles.container}>
              <SafeAreaView>
                  <StatusBar barStyle="dark-content" />
                  <RegisterModalsContainer
                      modalVisible={this.props.modalVisible}
                      setAgreeModalVisible={this.props.setAgreeModalVisible}
                      videoAgree={this.props.videoAgree}
                      videoVisible={this.props.videoVisible}
                      setModalVisible={this.props.setModalVisible}
                      setVideoPlayerModalVisible={this.props.setVideoPlayerModalVisible}
                      onLogin={() =>
                          authHelpers.handleLogin(
                              authHelpers._loginWithAuth0,
                              this.props.setUserCreds,
                          )
                      }
                  />

                  {!isLoggedIn && (
                      <TouchableHighlight onPress={this.startRegister}>
                          <Text style={styles.link}>
                                    This is a preview. Social workers, family recruiters, and CASA volunteers can have completely free access. Touch here to find out more.
                          </Text>
                      </TouchableHighlight>
                  )}
                  <>
                      <FlatList style={{ height: '100%' }}
                          ListHeaderComponent = {
                              <View>

                                  <View>
                                      <Text style={styles.intro}>Find A Person By...</Text>
                                  </View>

                                  <View>
                                      <SearchForm
                                          handleSearch={this.handleSearchRequest}
                                          resetReduxState={this.resetReduxState}
                                          data={this.props.data}
                                          sendSearchErrorMessage={this.showSearchErrorMessage}
                                      />

                                  </View>

                                  {this.state.errorMessage?.length > 0 ? (
                                      <View style={{ backgroundColor: '#fff3cd', padding: 15 }}>
                                          {this.state.errorMessage}
                                      </View>
                                  ) : null }


                                  {this.props.isFetching && <Loader />}

                                  {(this.props.possiblePersons.length) ? (
                                      <Text style={styles.matchesText}>Possible Matches</Text>
                                  ) : null}


                              </View>

                          }
                          data={this.props.possiblePersons}
                          renderItem={({ item }) => {
                              return (
                                  <PersonRow
                                      item={item}
                                      handlePress={() =>
                                          this.props.navigation.navigate('SearchResult', {
                                              searchPointer: item['@search_pointer_hash'],
                                          })
                                      }
                                  />
                              );
                          }}
                          keyExtractor={(item, index) => index.toString()}
                      />
                  </>
              </SafeAreaView>
          </Container>
      );
  }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        margin: 5,
    },
    intro: {
        paddingTop: 20,
        paddingLeft: 10,
        fontFamily: constants.fontFamily,
        fontSize: 18,
    },
    link: {
        color: `${constants.highlightColor}`,
        lineHeight: 17,
        padding: 15,
        backgroundColor: 'rgb(216,236,240)',
        borderRadius: 10,
        marginBottom: 20,
    },
    matchesText: {
        fontSize: 20,
        color: `${constants.highlightColor}`,
        marginBottom: 20,
        marginLeft: 10,
    },
});

const mapStateToProps = (state) => {
    const {
        error,
        isFetching,
        person,
        possiblePersons,
        data,
        query,
    } = state.people;
    const {
    // accessToken,
    // idToken,
        isLoggedIn,
        user,
        modalVisible,
        videoAgree,
        videoVisible,
    } = state.auth;
    return {
    // accessToken,
        error,
        // idToken,
        isFetching,
        isLoggedIn,
        person,
        possiblePersons,
        modalVisible,
        videoAgree,
        videoVisible,
        user,
        info: state.confirmationModal.info,
        queryType: state.confirmationModal.queryType,
        data,
        query,
    };
};

export default connect(
    mapStateToProps,
    {
        fetchPerson,
        fetchSearchResult,
        resetState,
        setModalVisible,
        setAgreeModalVisible,
        setUserCreds,
        setVideoPlayerModalVisible,
        getInfo,
    },
)(PeopleSearchScreen);
