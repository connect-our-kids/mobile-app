import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Tabs, Tab, Input } from 'native-base';
import { SearchBar } from 'react-native-elements';
import constants from '../../helpers/constants';
import {
    isName,
    isEmail,
    isAddress,
    isPhone,
    isUrl,
} from '../../helpers/inputValidators';
import { parseAddress, parseCityState, parseName } from '../../helpers/parsers';
import { connect } from 'react-redux';
import {
    getInfo,
    stopSearchMe,
    sendSearchErrorMessage,
} from '../../store/actions';
import { Ionicons } from '@expo/vector-icons';

class SearchForm extends Component {
  state = {
      name: '',
      cityState: '',
      firstName: '',
      lastName: '',
      city: '',
      state: '',
      email: '',
      address: '',
      phone: '',
      url: '',
      tabPage: 0,
  };

  componentDidUpdate(prevProps, prevState) {
      if (this.props.searchMe && this.props.queryType) {
          this.changeHandler(this.props.queryType, this.props.info);
          this.handleFormSubmit();
          this.props.stopSearchMe();
      }
  }

  changeHandler = (name, text) => {
      const tabPages = { name: 0, email: 1, address: 2, phone: 3, url: 4 };
      this.setState({
          ...this.state,
          [name]: text,
          tabPage: tabPages[name],
      });
  }

  handleFormSubmit = () => {
      let inputKey;
      let inputValue;
      let formattedObject = null;

      const unusedKeys = [ 'firstName', 'lastName', 'city', 'state' ];

      console.log('this is the state ', this.state);

      const inputObj = this.findInputWithLength();

      if (!inputObj) {
          return;
      }

      for (let [ key, value ] of Object.entries(inputObj)) {
          inputKey = key;
          inputValue = value;
      }
      let searchType;
      if (isName(inputValue)) {
          if (!this.state.name) {
              this.setState({ name: inputValue, [inputKey]: '', tabPage: 0 });
          }
          searchType = 'name';
          formattedObject = this.formatRequestObject(inputValue, 'name');
      }
      else if (isEmail(inputValue)) {
          if (!this.state.email) {
              this.setState({ email: inputValue, [inputKey]: '', tabPage: 1 });
          }
          searchType = 'email';
          formattedObject = this.formatRequestObject(inputValue, 'email');
      }
      else if (isAddress(inputValue)) {
          if (!this.state.address) {
              this.setState({ address: inputValue, [inputKey]: '', tabPage: 2 });
          }
          searchType = 'address';
          formattedObject = this.formatRequestObject(inputValue, 'address');
      }
      else if (isPhone(inputValue)) {
          if (!this.state.phone) {
              this.setState({ phone: inputValue, [inputKey]: '', tabPage: 3 });
          }
          searchType = 'phone';
          formattedObject = this.formatRequestObject(inputValue, 'phone');
      }
      else if (isUrl(inputValue)) {
          if (!this.state.url) {
              this.setState({ url: inputValue, [inputKey]: '', tabPage: 4 });
          }
          searchType = 'url';
          formattedObject = this.formatRequestObject(inputValue, 'url');
      }
      if (unusedKeys.includes(inputKey)) {
          null;
      }
      else {
          console.log('your input is not valid');
      }

      if (formattedObject) {
          this.props.handleSearch(formattedObject, searchType, inputValue);
      }
      else {
          console.log('formattedObject: error');
          this.props.sendSearchErrorMessage({ inputKey, inputValue });
      }
  };

  findInputWithLength = () => {
      let input;
      let name;

      for (let key in this.state) {
          if (key !== 'cityState' && key !== 'tabPage' && this.state[key]) {
              if (this.state[key].length) {
                  input = this.state[key];
                  name = key;
              }
          }
      }
      if (name && input) {
          return { [name]: input };
      }
      else {
      }
  };

  formatRequestObject = (inputValue, type) => {
      const person = {};

      switch (type) {
      case 'name':
          person.names = [];
          const parsedName = parseName(inputValue);
          person.names.push(parsedName);

          if (this.state.cityState.length) {
              person.addresses = [];
              const location = parseCityState(this.state.cityState);
              person.addresses.push(location);
          }
          break;

      case 'email':
          person.emails = [];
          person.emails.push({
              address: inputValue,
          });
          break;
      case 'address':
          person.addresses = [];
          const addresses = parseAddress(inputValue);
          person.addresses.push(addresses);
          break;

      case 'phone':
          person.phones = [];
          person.phones.push({
              number: inputValue.replace(/[^0-9]+/g, ''),
          });
          break;

      case 'url':
          person.urls = [];
          person.urls.push({
              url: inputValue,
          });
          break;

      default:

          break;
      }
      return person;
  };

  startOver = () => {
      this.props.resetReduxState();
      this.setState({
          firstName: '',
          lastName: '',
          city: '',
          state: '',
          email: '',
          address: '',
          phone: '',
          url: '',
      });
  };

  render() {
      return (
          <View style={{ marginBottom: 20 }}>
              <Tabs
                  style={styles.container}
                  activeTextStyle={{ color: '#64aab8' }}
                  tabBarUnderlineStyle={{ backgroundColor: '#0279AC' }}
                  page={this.state.tabPage}
              >
                  <Tab
                      heading="Name"
                      style={[ styles.nameInput, { color: '#64aab8' } ]}
                      activeTextStyle={styles.activeTextStyle}
                      textStyle={styles.textStyle}
                      activeTabStyle={{ backgroundColor: '#fff' }}
                      tabStyle={{ backgroundColor: '#fff' }}
                  >
                      <View style={styles.nameInputFullWidth}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Text style={{ width: '50%', position: 'relative', top: 16, left: 14 }}>First Name</Text>
                              <Text style={{ width: '50%', position: 'relative', top: 16, left: 14 }}>Last Name</Text>
                          </View>

                          <View style={styles.peopleSearch}>

                              <Input
                                  placeholder="e.g. John"
                                  placeholderTextColor='rgba(24,23,21,.5)'
                                  style={styles.textInput}
                                  value={this.state.firstName}
                                  onChangeText={(text) => this.changeHandler('firstName', text)}
                              />
                              <Input
                                  placeholder="e.g. Smith"
                                  placeholderTextColor='rgba(24,23,21,.5)'
                                  style={styles.textInput}
                                  value={this.state.lastName}
                                  onChangeText={(text) => this.changeHandler('lastName', text)}
                              />

                          </View>

                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Text style={{ width: '50%', position: 'relative', top: 16, left: 14 }}>City</Text>
                              <Text style={{ width: '50%', position: 'relative', top: 16, left: 14 }}>State</Text>

                          </View>
                          <View style={styles.peopleSearch}>
                              <Input
                                  placeholder="e.g. Boston"
                                  placeholderTextColor='rgba(24,23,21,.5)'
                                  style={styles.textInput}
                                  value={this.state.city}
                                  onChangeText={(text) => this.changeHandler('city', text)}
                              />


                              <Input
                                  placeholder="e.g. Massachusetts"
                                  placeholderTextColor='rgba(24,23,21,.5)'
                                  style={styles.textInput}
                                  value={this.state.state}
                                  onChangeText={(text) => this.changeHandler('state', text)}
                              />
                          </View>
                      </View>
                  </Tab>

                  <Tab
                      heading="Email"
                      activeTextStyle={{ ...styles.activeTextStyle, color: '#0279ac' }}
                      textStyle={styles.textStyle}
                      activeTabStyle={[ { backgroundColor: '#fff' } ]}
                      tabStyle={[ { backgroundColor: '#fff' } ]}
                      style={[ { flex: 0 } ]}
                  >
                      <View style={styles.searchBar}>
                          <SearchBar
                              placeholder="Search email..."
                              placeholderTextColor='rgba(24,23,21,.5)'
                              containerStyle={styles.textInputWide}
                              inputContainerStyle={{ backgroundColor: '#fff' }}
                              inputStyle={{ backgroundColor: '#fff' }}
                              value={this.state.email}
                              onChangeText={(text) => this.changeHandler('email', text)}
                              lightTheme
                          />
                      </View>
                  </Tab>

                  <Tab
                      heading="Addr."
                      activeTextStyle={styles.activeTextStyle}
                      textStyle={styles.textStyle}
                      activeTabStyle={{ backgroundColor: '#fff' }}
                      tabStyle={{ backgroundColor: '#fff' }}
                  >
                      <View>
                          <SearchBar
                              placeholder="Search address..."
                              placeholderTextColor='rgba(24,23,21,.5)'
                              containerStyle={styles.textInputWide}
                              inputContainerStyle={{ backgroundColor: '#fff' }}
                              inputStyle={{ backgroundColor: '#fff' }}
                              value={this.state.address}
                              onChangeText={(text) => this.changeHandler('address', text)}
                              lightTheme
                          />
                      </View>
                  </Tab>

                  <Tab
                      heading="Phone"
                      activeTextStyle={styles.activeTextStyle}
                      textStyle={styles.textStyle}
                      activeTabStyle={{ backgroundColor: '#fff' }}
                      tabStyle={{ backgroundColor: '#fff' }}
                  >
                      <View>
                          <SearchBar
                              placeholder="Search phone number..."
                              placeholderTextColor='rgba(24,23,21,.5)'
                              containerStyle={styles.textInputWide}
                              inputContainerStyle={{ backgroundColor: '#fff' }}
                              inputStyle={{ backgroundColor: '#fff' }}
                              value={this.state.phone}
                              onChangeText={(text) => this.changeHandler('phone', text)}
                              lightTheme
                          />
                      </View>
                  </Tab>

                  <Tab
                      heading="URL"
                      activeTextStyle={styles.activeTextStyle}
                      textStyle={styles.textStyle}
                      activeTabStyle={{ backgroundColor: '#fff' }}
                      tabStyle={{ backgroundColor: '#fff' }}
                  >
                      <View>
                          <SearchBar
                              placeholder="Search URL..."
                              placeholderTextColor='rgba(24,23,21,.5)'
                              containerStyle={styles.textInputWide}
                              inputContainerStyle={{ backgroundColor: '#fff' }}
                              inputStyle={{ backgroundColor: '#fff' }}
                              value={this.state.url}
                              onChangeText={(text) => this.changeHandler('url', text)}
                              lightTheme
                          />
                      </View>
                  </Tab>
              </Tabs>
              <View style={{ flexDirection: 'row', margin: 16, justifyContent: 'space-between' }}>
                  <Button style={styles.button} onPress={() => {
                      this.setState({
                          firstName: '',
                          lastName: '',
                          city: '',
                          state: '',
                          name: `${this.state.firstName} ${this.state.lastName}`,
                          cityState: `${this.state.city} ${this.state.state}`,
                          email: this.state.email,
                          address: this.state.address,
                          phone: this.state.phone,
                          url: this.state.url,
                          tabPage: this.state.tabPage || 0,
                      }, () => this.handleFormSubmit());
                  }}>
                      <Text style={styles.buttonText}> Search </Text>
                  </Button>

                  <Button style={styles.greyButton} onPress={this.startOver}>
                      <Text style={{ ...styles.buttonText, color: '#0279ac' }}> Clear </Text>
                  </Button>
              </View>
          </View>
      );
  }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        margin: 5,
        flex: 0,

    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    textInput: {
        borderColor: 'rgba(24,23,21,.5)',
        borderWidth: .5,
        borderStyle: 'solid',
        borderRadius: 4,
        width: '45%',
        marginRight: 12,
        marginLeft: 12,
        color: 'black',
    },
    textInputWide: {
        borderColor: 'rgba(24,23,21,.5)',
        borderWidth: .5,
        borderStyle: 'solid',
        borderRadius: 4,
        width: '95%',
        marginTop: 45,
        marginRight: 12,
        marginLeft: 12,
        backgroundColor: 'white',
    },

    textInputSmall: {
        flex: 1,
    },
    nameInput: {
        flexDirection: 'row',
    },

    button: {

        marginVertical: 15,
        padding: 10,
        backgroundColor: '#0279AC',
        width: '58%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    tab: {
        backgroundColor: 'white',
    },

    buttonText: {
        color: 'white',
    },

    link: {
        color: '#64aab8',
        lineHeight: 17,
        padding: 15,
        backgroundColor: `${constants.highlightColor}`,
        borderRadius: 10,
        marginBottom: 20,
    },
    matchesText: {
        fontSize: 20,
        color: `${constants.highlightColor}`,
        marginBottom: 20,
    },
    greyButton: {
        backgroundColor: 'white',
        marginVertical: 15,
        padding: 10,
        width: '37%',
        borderWidth: 1,
        borderColor: '#0279AC',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#0279AC',


    },
    activeTextStyle: {
        color: '#0279AC',
        fontFamily: constants.lotoFamily,
        fontSize: 16,
    },
    textStyle: {
        color: '#18171568',
        fontFamily: constants.lotoFamily,
        fontSize: 16,
    },
    nameInputFullWidth: {
        width: '100%',
        height: '100%',
    },
    peopleSearch: {
        flexDirection: 'row',
        paddingTop: '5%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: '5%',

    },
});

const mapStateToProps = (state) => {
    const { info, queryType, searchMe } = state.confirmationModal;
    return {
        info,
        queryType,
        searchMe,
    };
};

export default connect(
    mapStateToProps,
    { getInfo, stopSearchMe, sendSearchErrorMessage },
)(SearchForm);
