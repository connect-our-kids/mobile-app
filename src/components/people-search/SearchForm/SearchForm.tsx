import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Tabs, Tab, Input } from 'native-base';
import { SearchBar } from 'react-native-elements';
import {
    isValidName,
    isValidEmail,
    isValidAddress,
    isValidPhone,
    isValidUrl,
} from '../../../helpers/inputValidators';
import { Ionicons } from '@expo/vector-icons';
import * as _ from 'lodash';

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
        borderWidth: 0.5,
        borderStyle: 'solid',
        borderRadius: 4,
        width: '45%',
        marginRight: 12,
        marginLeft: 12,
        color: 'black',
    },

    textInputWide: {
        borderColor: 'rgba(24,23,21,.5)',
        borderWidth: 0.5,
        borderStyle: 'solid',
        borderRadius: 4,
        width: '85%',
        marginTop: 45,
        marginRight: 12,
        marginLeft: 12,
        backgroundColor: 'white',
    },

    button: {
        marginVertical: 15,
        padding: 10,
        backgroundColor: '#0279AC',
        width: '58%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonText: {
        color: 'white',
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
        fontSize: 16,
    },

    textStyle: {
        color: '#18171568',
        fontSize: 16,
    },

    nameInputFullWidth: {
        width: '100%',
    },

    peopleSearch: {
        flexDirection: 'row',
        paddingTop: '5%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: '5%',
    },
    ioniconsCentered: {
        marginTop: '11%',
    },
});

export type SearchValues =
    | { type: 'name'; name: string; location: string }
    | { type: 'email'; email: string }
    | { type: 'address'; address: string }
    | { type: 'phone'; phone: string }
    | { type: 'url'; url: string };

const formatRequestObject = (input: SearchValues) => {
    switch (input.type) {
        case 'name':
            if (input.location.trim()) {
                return {
                    names: [{ raw: input.name }],
                    addresses: [{ raw: input.location.trim() }],
                };
            } else {
                return { names: [{ raw: input.name }] };
            }

        case 'email':
            return { emails: [{ address: input.email }] };
        case 'address':
            return { addresses: [{ raw: input.address }] };
        case 'phone':
            return {
                phones: [{ number: input.phone.replace(/[^0-9]+/g, '') }],
            };
        case 'url':
            return { urls: [{ url: input.url }] };
    }
};

enum SearchTab {
    name = 0,
    email = 1,
    address = 2,
    phone = 3,
    url = 4,
}

interface LocalState {
    name: string;
    location: string;
    email: string;
    address: string;
    phone: string;
    url: string;
    tabPage: SearchTab;
    showNoInputMessage: boolean;
}

const defaultState: LocalState = {
    name: '',
    location: '',
    email: '',
    address: '',
    phone: '',
    url: '',
    tabPage: SearchTab.name,
    showNoInputMessage: false,
};

interface OwnProps {
    onSearch: (search: Record<string, unknown>) => void;
    onClear: () => void;
    searchValues?: SearchValues;
}

type Props = OwnProps;

export class SearchForm extends Component<Props, LocalState> {
    state = defaultState;

    componentDidUpdate(prev: OwnProps) {
        if (!_.isEqual(this.props.searchValues, prev.searchValues)) {
            if (this.props.searchValues) {
                switch (this.props.searchValues.type) {
                    case 'email':
                        this.setState(
                            {
                                ...this.state,
                                email: this.props.searchValues.email,
                                tabPage: SearchTab.email,
                            },
                            this.handleFormSubmit
                        );
                        break;
                    case 'phone':
                        this.setState(
                            {
                                ...this.state,
                                phone: this.props.searchValues.phone,
                                tabPage: SearchTab.phone,
                            },
                            this.handleFormSubmit
                        );
                        break;
                    case 'address':
                        this.setState(
                            {
                                ...this.state,
                                address: this.props.searchValues.address,
                                tabPage: SearchTab.address,
                            },
                            this.handleFormSubmit
                        );
                        break;
                    case 'name':
                        this.setState(
                            {
                                ...this.state,
                                name: this.props.searchValues.name,
                                location: this.props.searchValues.location,
                                tabPage: SearchTab.name,
                            },
                            this.handleFormSubmit
                        );
                        break;
                    case 'url':
                        this.setState(
                            {
                                ...this.state,
                                url: this.props.searchValues.url,
                                tabPage: SearchTab.url,
                            },
                            this.handleFormSubmit
                        );
                        break;
                }
            } else {
                this.setState(defaultState);
            }
        }
    }

    /* componentDidUpdate() {
        if (this.props.searchMe && this.props.queryType) {
            this.changeHandler(this.props.queryType, this.props.info);
            this.handleFormSubmit();
            this.props.stopSearchMe();
        }
    } */

    handleFormSubmit = () => {
        console.log('in handle form submit');
        switch (this.state.tabPage) {
            case SearchTab.name:
                if (isValidName(this.state.name)) {
                    this.props.onSearch(
                        formatRequestObject({
                            type: 'name',
                            name: this.state.name,
                            location: this.state.location,
                        })
                    );
                } else {
                    // TODO show error
                    // this.props.sendSearchErrorMessage({ mainValue });
                    console.log('error');
                }
                break;
            case SearchTab.email:
                if (isValidEmail(this.state.email)) {
                    this.props.onSearch(
                        formatRequestObject({
                            type: 'email',
                            email: this.state.email,
                        })
                    );
                } else {
                    // TODO show error
                    console.log('error');
                }
                break;
            case SearchTab.address:
                if (isValidAddress(this.state.address)) {
                    this.props.onSearch(
                        formatRequestObject({
                            type: 'address',
                            address: this.state.address,
                        })
                    );
                } else {
                    // TODO show error
                    console.log('error');
                }
                break;
            case SearchTab.phone:
                if (isValidPhone(this.state.phone)) {
                    this.props.onSearch(
                        formatRequestObject({
                            type: 'phone',
                            phone: this.state.phone,
                        })
                    );
                } else {
                    // TODO show error
                    console.log('error');
                }
                break;
            case SearchTab.url:
                if (isValidUrl(this.state.url)) {
                    this.props.onSearch(
                        formatRequestObject({
                            type: 'url',
                            url: this.state.url,
                        })
                    );
                } else {
                    // TODO show error
                    console.log('error');
                }
                break;
            default:
                console.log('did not match switch');
                console.log(this.state.tabPage);
                break;
        }
    };

    onClear = () => {
        this.setState(defaultState);
        this.props.onClear();
    };

    render() {
        return (
            <View style={{ marginBottom: 20 }}>
                <Tabs
                    style={styles.container}
                    tabBarUnderlineStyle={{ backgroundColor: '#0279AC' }}
                    page={this.state.tabPage as number}
                    onChangeTab={(tab: { i: number }) => {
                        this.setState({
                            ...this.state,
                            tabPage: tab.i,
                        });
                    }}
                >
                    <Tab
                        heading="Name"
                        activeTextStyle={styles.activeTextStyle}
                        textStyle={styles.textStyle}
                        activeTabStyle={{ backgroundColor: '#fff' }}
                        tabStyle={{ backgroundColor: '#fff' }}
                    >
                        <View style={styles.nameInputFullWidth}>
                            <View style={styles.peopleSearch}>
                                <Ionicons
                                    name="md-person"
                                    size={32}
                                    color="#0279AC"
                                />
                                <Input
                                    placeholder="First Middle Last Name"
                                    placeholderTextColor="rgba(24,23,21,.5)"
                                    style={styles.textInput}
                                    value={this.state.name}
                                    onChangeText={(text) =>
                                        this.setState({
                                            ...this.state,
                                            name: text,
                                        })
                                    }
                                    autoCapitalize="words"
                                />
                            </View>
                            <View style={styles.peopleSearch}>
                                <Ionicons
                                    name="md-map"
                                    size={32}
                                    color="#0279AC"
                                />
                                <Input
                                    placeholder="City, State (Optional)"
                                    placeholderTextColor="rgba(24,23,21,.5)"
                                    style={styles.textInput}
                                    value={this.state.location}
                                    onChangeText={(text) =>
                                        this.setState({
                                            ...this.state,
                                            location: text,
                                        })
                                    }
                                    autoCapitalize="words"
                                />
                            </View>
                        </View>
                    </Tab>

                    <Tab
                        heading="Email"
                        activeTextStyle={{
                            ...styles.activeTextStyle,
                            color: '#0279ac',
                        }}
                        textStyle={styles.textStyle}
                        activeTabStyle={[{ backgroundColor: '#fff' }]}
                        tabStyle={[{ backgroundColor: '#fff' }]}
                    >
                        <View style={styles.searchBar}>
                            <Ionicons
                                name="md-mail"
                                size={32}
                                color="#0279AC"
                                style={styles.ioniconsCentered}
                            />
                            <SearchBar
                                placeholder="Email Address"
                                placeholderTextColor="rgba(24,23,21,.5)"
                                containerStyle={styles.textInputWide}
                                inputContainerStyle={{
                                    backgroundColor: '#fff',
                                }}
                                inputStyle={{ backgroundColor: '#fff' }}
                                value={this.state.email}
                                onChangeText={(text) =>
                                    this.setState({
                                        ...this.state,
                                        email: text,
                                    })
                                }
                                lightTheme
                                autoCapitalize="none"
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
                        <View style={styles.searchBar}>
                            <Ionicons
                                name="md-pin"
                                size={32}
                                color="#0279AC"
                                style={styles.ioniconsCentered}
                            />
                            <SearchBar
                                placeholder="Mailing Address"
                                placeholderTextColor="rgba(24,23,21,.5)"
                                containerStyle={styles.textInputWide}
                                inputContainerStyle={{
                                    backgroundColor: '#fff',
                                }}
                                inputStyle={{ backgroundColor: '#fff' }}
                                value={this.state.address}
                                onChangeText={(text) =>
                                    this.setState({
                                        ...this.state,
                                        address: text,
                                    })
                                }
                                lightTheme
                                autoCapitalize="none"
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
                        <View style={styles.searchBar}>
                            <Ionicons
                                name="md-call"
                                size={32}
                                color="#0279AC"
                                style={styles.ioniconsCentered}
                            />
                            <SearchBar
                                placeholder="Phone Number"
                                placeholderTextColor="rgba(24,23,21,.5)"
                                containerStyle={styles.textInputWide}
                                inputContainerStyle={{
                                    backgroundColor: '#fff',
                                }}
                                inputStyle={{ backgroundColor: '#fff' }}
                                value={this.state.phone}
                                onChangeText={(text) =>
                                    this.setState({
                                        ...this.state,
                                        phone: text,
                                    })
                                }
                                lightTheme
                                autoCapitalize="none"
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
                        <View style={styles.searchBar}>
                            <Ionicons
                                name="md-globe"
                                size={32}
                                color="#0279AC"
                                style={styles.ioniconsCentered}
                            />
                            <SearchBar
                                placeholder="URL"
                                placeholderTextColor="rgba(24,23,21,.5)"
                                containerStyle={styles.textInputWide}
                                inputContainerStyle={{
                                    backgroundColor: '#fff',
                                }}
                                inputStyle={{ backgroundColor: '#fff' }}
                                value={this.state.url}
                                onChangeText={(text) =>
                                    this.setState({
                                        ...this.state,
                                        url: text,
                                    })
                                }
                                lightTheme
                                autoCapitalize="none"
                            />
                        </View>
                    </Tab>
                </Tabs>
                <View
                    style={{
                        flexDirection: 'row',
                        margin: 16,
                        justifyContent: 'space-between',
                    }}
                >
                    <Button
                        style={styles.button}
                        onPress={this.handleFormSubmit}
                    >
                        <Text style={styles.buttonText}> Search </Text>
                    </Button>

                    <Button style={styles.greyButton} onPress={this.onClear}>
                        <Text
                            style={{ ...styles.buttonText, color: '#0279ac' }}
                        >
                            {' '}
                            Clear{' '}
                        </Text>
                    </Button>
                </View>

                {this.state.showNoInputMessage ? (
                    <View>
                        <Text>Enter a value above to search</Text>
                    </View>
                ) : null}
            </View>
        );
    }
}
