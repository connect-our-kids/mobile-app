// @ts-nocheck
// NOTE Ignoring typescript errors so we can enable typescript checking across the repo
// in the CI system. That will prevent more errors from being added.
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
    fetchPerson,
    fetchSearchResult,
    resetState,
    setModalVisible,
    setAgreeModalVisible,
    setVideoPlayerModalVisible,
    getInfo,
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
    error;
    isFetching;
    isLoggedIn;
    person;
    possiblePersons;
    modalVisible;
    videoAgree;
    videoVisible;
    user;
    info;
    queryType;
}

interface DispatchProps {
    fetchPerson: typeof fetchPerson;
    fetchSearchResult: typeof fetchSearchResult;
    resetState: typeof resetState;
    setModalVisible: typeof setModalVisible;
    setAgreeModalVisible: typeof setAgreeModalVisible;
    setVideoPlayerModalVisible: typeof setVideoPlayerModalVisible;
    getInfo: typeof getInfo;
}

type Navigation = NavigationScreenProp<NavigationState>;

interface OwnProps {
    navigation: Navigation;
}

type Props = StateProps & DispatchProps & OwnProps;

class PeopleSearchScreen extends React.Component<Props> {
    state = {
        data: this.props.info,
        type: this.props.type,
        videoPlayerOpen: false,
        modalVisible: false,
        terms: false,
        privacy: false,
    };

    componentDidMount() {
        console.log('useEffect: PeopleSearch');
        /**
         * login(true) is safe to call anytime
         * Inside the function it ensures only one execution at a
         * time.
         */
        this.props.login(true);
    }

    handleEncodeURI = (person) => {
        return encodeURI(JSON.stringify(person));
    };

    handleSearchRequest = async (person, searchType) => {
        const { fetchSearchResult, navigation, user } = this.props;

        const body = {};
        const requestObject = {};

        body['searchType'] = searchType;

        requestObject['person'] = this.handleEncodeURI(person);
        body['requestObject'] = JSON.stringify(requestObject);

        if (this.props.person || this.props.possiblePersons.length) {
            this.props.resetState();
        }

        fetchSearchResult(
            body,
            () => navigation.navigate('SearchResult'),
            user ? user.email : null
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
            this.props.isLoggedIn
                ? this.props.user.email
                : 'anonymous@unknown.org',
            'open',
            'introduction-video'
        );
    };

    closeVideo = () => {
        this.setState({ videoPlayerOpen: false });
        sendEvent(
            this.props.isLoggedIn
                ? this.props.user.email
                : 'anonymous@unknown.org',
            'close',
            'introduction-video'
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
                                        handleSearch={this.handleSearchRequest}
                                        resetReduxState={this.resetReduxState}
                                        data={this.props.data}
                                        sendSearchErrorMessage={
                                            this.showSearchErrorMessage
                                        }
                                    />
                                </View>

                                {this.props.error?.length > 0 ? (
                                    <View
                                        style={{
                                            backgroundColor: '#fff3cd',
                                            padding: 15,
                                        }}
                                    >
                                        {this.props.error}
                                    </View>
                                ) : null}

                                {this.props.isFetching && <Loader />}

                                {this.props.possiblePersons.length ? (
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

const mapStateToProps = (state: RootState): StateProps => {
    const { error, isFetching, person, possiblePersons } = state.people;
    const {
        isLoggedIn,
        user,
        modalVisible,
        videoAgree,
        videoVisible,
    } = state.auth;
    return {
        error,
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
    };
};

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, {
    fetchPerson,
    fetchSearchResult,
    resetState,
    setModalVisible,
    setAgreeModalVisible,
    setVideoPlayerModalVisible,
    getInfo,
    login,
})(PeopleSearchScreen);
