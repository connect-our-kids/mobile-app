// @ts-nocheck
import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Modal,
    StatusBar,
} from 'react-native';

import { Container } from 'native-base';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import {
    fetchPerson,
    resetPerson,
    setModalVisible,
    setAgreeModalVisible,
    setVideoPlayerModalVisible,
    showModal,
    getInfo,
    login,
} from '../store/actions';
import PersonInfo from '../components/people-search/PersonInfo';
import Loader from '../components/Loader';
import RegisterModalsContainer from '../components/auth/RegisterModalsContainer';
import PersonConfirmationModal from '../components/people-search/PersonConfirmationModal';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { RootState } from '../store/reducers';
import constants from '../helpers/constants';

const styles = StyleSheet.create({
    container: {
        backgroundColor: constants.backgroundColor,
    },
    safeAreaView: {
        backgroundColor: constants.backgroundColor,
        margin: 5,
    },
    link: {
        color: '#64aab8',
        lineHeight: 17,
        padding: 15,
        backgroundColor: 'rgb(216,236,240)',
        borderRadius: 10,
        marginBottom: 20,
    },
});

interface StateProps {
    error;
    isFetching;
    isLoggedIn;
    person;
    possiblePersons;
    user;
    modalVisible;
    videoAgree;
    videoVisible;
    getInfo;
}

interface DispatchProps {
    fetchPerson: typeof fetchPerson;
    resetPerson: typeof resetPerson;
    setModalVisible: typeof setModalVisible;
    setAgreeModalVisible: typeof setAgreeModalVisible;
    setVideoPlayerModalVisible: typeof setVideoPlayerModalVisible;
    showModal: typeof showModal;
    getInfo: typeof getInfo;
    login: typeof login;
}

type Navigation = NavigationScreenProp<NavigationState>;

interface OwnProps {
    navigation: Navigation;
}

type Props = StateProps & DispatchProps & OwnProps;

class SearchResultScreen extends React.Component<Props> {
    state = {
        requestObject: {},
        modalVisible: false,
        key: '',
        type: '',
        address: '',
        info: '',
        index: null,
    };

    toggleModal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible,
        });
    };

    componentDidMount() {
        const { fetchPerson, isLoggedIn, person, resetPerson } = this.props;

        if (this.props.navigation.state.params) {
            const requestObject = {};

            if (person) {
                resetPerson();
            }

            const { searchPointer } = this.props.navigation.state.params;
            requestObject['search_pointer_hash'] = searchPointer;

            if (!isLoggedIn) {
                this.setState({ requestObject });
            }

            fetchPerson(
                requestObject,
                this.props.user ? this.props.user.email : null
            );
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (
            prevProps.isLoggedIn === false &&
            this.props.isLoggedIn === true &&
            this.state.requestObject
        ) {
            this.props.resetPerson();
            const requestObject = { ...this.state.requestObject };
            this.props.fetchPerson(
                requestObject,
                this.props.user ? this.props.user.email : null
            );
            this.setState({ requestObject: {} });
        }
    }

    startRegister = () => {
        this.props.setModalVisible(true);
    };

    showConModal = (key, type, index) => {
        console.log('state before {}', this.state);
        this.setState({ key, type, index });
        console.log('state after {}', this.state);

        this.toggleModal();
    };

    setData = (key, type) => {
        this.setState({ info: key, type: type });
        this.props.getInfo(key, type);
    };

    render() {
        const { isLoggedIn, person, user } = this.props;
        return (
            <Container style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <View>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.modalVisible}
                        onRequestClose={this.toggleModal}
                    >
                        <PersonConfirmationModal
                            toggleModal={this.toggleModal}
                            type={this.state.type}
                            data={this.state.key}
                            home={this.state.address}
                            navigation={this.props.navigation}
                            setData={this.setData}
                            user={user}
                            index={this.state.index}
                        />
                    </Modal>
                </View>
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
                <SafeAreaView style={{ ...styles.safeAreaView }}>
                    <ScrollView>
                        <View>
                            {!isLoggedIn && (
                                <TouchableHighlight
                                    onPress={this.startRegister}
                                >
                                    <Text style={styles.link}>
                                        This is a preview with limited results.
                                        Social workers, family recruiters, and
                                        CASA volunteers can have completely free
                                        access. Touch here to find out more.
                                    </Text>
                                </TouchableHighlight>
                            )}
                            {/* TODO display error message {this.props.error && <ErrorMessage />} */}
                            {!person ? (
                                <Loader />
                            ) : (
                                <PersonInfo
                                    item={person}
                                    setModalVisible={this.props.setModalVisible}
                                    startRegister={this.startRegister}
                                    isLoggedIn={isLoggedIn}
                                    showConModal={this.showConModal}
                                    navigation={this.props.navigation}
                                    setData={this.setData}
                                />
                            )}
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </Container>
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
        user,
        modalVisible,
        videoAgree,
        videoVisible,
        getInfo: state.confirmationModal.info,
    };
};

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, {
    fetchPerson,
    resetPerson,
    setModalVisible,
    setAgreeModalVisible,
    setVideoPlayerModalVisible,
    showModal,
    getInfo,
    login,
})(SearchResultScreen);
