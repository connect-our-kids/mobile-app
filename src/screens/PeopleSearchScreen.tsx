import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    StatusBar,
} from 'react-native';
import { connect } from 'react-redux';
import {
    generalSearch,
    resetState,
    setModalVisible,
    setAgreeModalVisible,
    setVideoPlayerModalVisible,
    login,
} from '../store/actions';

import { FlatList } from 'react-native-gesture-handler';

import PersonRow from '../components/people-search/PersonRow';
import constants from '../helpers/constants';
import SearchForm from '../components/people-search/SearchForm';
import { sendEvent } from '../helpers/createEvent';
import Loader from '../components/Loader';

import RegisterModalsContainer from '../components/auth/RegisterModalsContainer';
import { RootState } from '../store/reducers';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { SearchValues } from '../components/people-search/SearchForm/SearchForm';

const styles = StyleSheet.create({
    safeAreaView: {
        backgroundColor: constants.backgroundColor,
    },
    intro: {
        paddingTop: 20,
        paddingLeft: 10,
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

interface StateProps {
    error?: string;
    isFetching: boolean;
    isLoggedIn: boolean;
    person?: Record<string, unknown>;
    possiblePersons: Record<string, unknown>[];
    modalVisible: boolean;
    videoAgree: boolean;
    videoVisible: boolean;
    email: string | null | undefined;
    searchValues?: SearchValues;
}

interface DispatchProps {
    fetchSearchResult: typeof generalSearch;
    resetState: typeof resetState;
    setModalVisible: typeof setModalVisible;
    setAgreeModalVisible: typeof setAgreeModalVisible;
    setVideoPlayerModalVisible: typeof setVideoPlayerModalVisible;
    login: typeof login;
}

type Navigation = NavigationScreenProp<NavigationState>;

interface OwnProps {
    navigation: Navigation;
}

type Props = StateProps & DispatchProps & OwnProps;

class PeopleSearchScreen extends React.Component<Props> {
    state: {
        videoPlayerOpen: boolean;
        modalVisible: boolean;
        terms: boolean;
        privacy: boolean;
    } = {
        videoPlayerOpen: false,
        modalVisible: false,
        terms: false,
        privacy: false,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleEncodeURI = (person: any) => {
        return encodeURI(JSON.stringify(person));
    };

    handleSearchRequest = (person: Record<string, unknown>) => {
        console.log('handle search request');
        const body = { person: JSON.stringify(person) };

        if (this.props.person || this.props.possiblePersons?.length) {
            this.props.resetState();
        }

        this.props.fetchSearchResult(body, () =>
            this.props.navigation.navigate('SearchResult')
        );
    };

    openVideo = () => {
        this.setState({ videoPlayerOpen: true });
        sendEvent(this.props.email, 'open', 'introduction-video');
    };

    closeVideo = () => {
        this.setState({ videoPlayerOpen: false });
        sendEvent(this.props.email, 'close', 'introduction-video');
    };

    closeModal = () => {
        this.setState({ modalVisible: false });
    };

    openModal = () => {
        this.setState({ modalVisible: true });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    controlModal = (key: any, value: any) => {
        this.setState({ [key]: value });
    };

    resetReduxState = () => {
        const { resetState } = this.props;
        resetState();
    };

    startRegister = () => {
        this.props.setModalVisible(true);
    };

    showSearchErrorMessage = (message: string) => {
        this.setState({ ...this.state, errorMessage: message });
    };

    render() {
        const { isLoggedIn } = this.props;
        return (
            <SafeAreaView style={{ ...styles.safeAreaView }}>
                <StatusBar barStyle="dark-content" />
                <RegisterModalsContainer
                    modalVisible={this.props.modalVisible}
                    setAgreeModalVisible={this.props.setAgreeModalVisible}
                    videoAgree={this.props.videoAgree}
                    videoVisible={this.props.videoVisible}
                    setModalVisible={this.props.setModalVisible}
                    setVideoPlayerModalVisible={
                        this.props.setVideoPlayerModalVisible
                    }
                    onLogin={async () => this.props.login()}
                />

                {!isLoggedIn && (
                    <TouchableHighlight onPress={this.startRegister}>
                        <Text style={styles.link}>
                            This is a preview with limited results. Social
                            workers, family recruiters, and CASA volunteers can
                            have completely free access. Touch here to find out
                            more.
                        </Text>
                    </TouchableHighlight>
                )}
                <>
                    <FlatList
                        style={{ height: '100%' }}
                        ListHeaderComponent={
                            <View>
                                <View>
                                    <Text style={styles.intro}>
                                        Find A Person By...
                                    </Text>
                                </View>

                                <View>
                                    <SearchForm
                                        onSearch={this.handleSearchRequest}
                                        onClear={() => {
                                            // clear navigate parameters
                                            this.props.navigation.setParams({
                                                searchValues: undefined,
                                            });
                                            this.resetReduxState;
                                        }}
                                        searchValues={this.props.searchValues}
                                    />
                                </View>

                                {this.props.error ? (
                                    <View
                                        style={{
                                            backgroundColor: '#fff3cd',
                                            padding: 15,
                                        }}
                                    >
                                        <Text>{this.props.error}</Text>
                                    </View>
                                ) : null}

                                {this.props.isFetching && <Loader />}

                                {this.props.possiblePersons?.length ? (
                                    <Text style={styles.matchesText}>
                                        Possible Matches
                                    </Text>
                                ) : null}
                            </View>
                        }
                        data={this.props.possiblePersons}
                        renderItem={({ item }) => {
                            return (
                                <PersonRow
                                    item={item}
                                    handlePress={() =>
                                        this.props.navigation.navigate(
                                            'SearchResult',
                                            {
                                                searchPointer:
                                                    item[
                                                        '@search_pointer_hash'
                                                    ],
                                            }
                                        )
                                    }
                                />
                            );
                        }}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </>
            </SafeAreaView>
        );
    }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps): StateProps => {
    const searchValues = ownProps.navigation.getParam('searchValues') as
        | SearchValues
        | undefined;

    const { errorMessage, isFetching, person, possiblePersons } = state.people;
    const { isLoggedIn, modalVisible, videoAgree, videoVisible } = state.auth;
    return {
        error: errorMessage,
        isFetching,
        isLoggedIn,
        person,
        possiblePersons,
        modalVisible,
        videoAgree,
        videoVisible,
        email: state.auth?.user?.email,
        searchValues,
    };
};

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, {
    fetchSearchResult: generalSearch,
    resetState,
    setModalVisible,
    setAgreeModalVisible,
    setVideoPlayerModalVisible,
    login,
})(PeopleSearchScreen);
