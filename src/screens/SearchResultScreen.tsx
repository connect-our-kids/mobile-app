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

import { Container, Button } from 'native-base';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import {
    fetchPerson,
    resetPerson,
    setModalVisible,
    setAgreeModalVisible,
    setUserCreds,
    setVideoPlayerModalVisible,
    showModal,
    getInfo,
} from '../store/actions';
import PersonInfo from '../components/people-search/PersonInfo';
import Loader from '../components/Loader';
import RegisterModalsContainer from '../components/auth/RegisterModalsContainer';
import PersonConfirmationModal from '../components/people-search/PersonConfirmationModal';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { RootState } from '../store/reducers';
import { handleLogin } from '../helpers/authHelpers';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        margin: 5,
    },
    button: {
        margin: 10,
        padding: 10,
        backgroundColor: '#fff',
    },
    buttonText: {
        color: '#0279AC',
        fontWeight: '500',
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
    accessToken;
    error;
    idToken;
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
    setUserCreds: typeof setUserCreds;
    setVideoPlayerModalVisible: typeof setVideoPlayerModalVisible;
    showModal: typeof showModal;
    getInfo: typeof getInfo;
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
        const {
            accessToken,
            fetchPerson,
            idToken,
            isLoggedIn,
            person,
            resetPerson,
        } = this.props;

        if (this.props.navigation.state.params) {
            const requestObject = {};

            if (person) {
                resetPerson();
            }

            const { searchPointer } = this.props.navigation.state.params;
            requestObject['search_pointer_hash'] = searchPointer;

            if (isLoggedIn) {
                requestObject['authToken'] = accessToken;
                requestObject['idToken'] = idToken;
            } else {
                this.setState({ requestObject });
            }

            fetchPerson(
                JSON.stringify(requestObject),
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
            requestObject['authToken'] = this.props.accessToken;
            requestObject['idToken'] = this.props.idToken;
            this.props.fetchPerson(
                JSON.stringify(requestObject),
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
                    onLogin={async () => handleLogin(this.props.setUserCreds)}
                />
                <SafeAreaView>
                    <ScrollView>
                        <View>
                            <Button
                                style={styles.button}
                                onPress={() => this.props.navigation.goBack()}
                            >
                                <Text
                                    style={{
                                        ...styles.buttonText,
                                        paddingTop: 10,
                                        paddingBottom: 10,
                                        marginLeft: 5,
                                        fontSize: 20,
                                        color: '#0279AC',
                                    }}
                                >
                                    {'\u2190 Back to Search'}
                                </Text>
                            </Button>
                        </View>
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
        accessToken,
        idToken,
        isLoggedIn,
        user,
        modalVisible,
        videoAgree,
        videoVisible,
    } = state.auth;
    return {
        accessToken,
        error,
        idToken,
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
    setUserCreds,
    setVideoPlayerModalVisible,
    showModal,
    getInfo,
})(SearchResultScreen);
