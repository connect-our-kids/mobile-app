// This is your main screen for Family Connections

// Default react imports
import React, { Component, useState, useEffect } from 'react';

// RN component imports
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Modal,
    StatusBar,
    TextInput,
    ActivityIndicator,
    ScrollView,
    Platform,
    TouchableHighlight,
    Alert,
    TouchableOpacity,
} from 'react-native';
import {
    ListItem,
    Image,
    SearchBar,
    Button,
    CheckBox,
    Divider,
} from 'react-native-elements';

// redux
import { connect } from 'react-redux';
import {
    getCaseData,
    getUserCases,
    setUserCreds,
    setModalVisible,
    authChecker,
} from '../store/actions';

// constants = like a config variable
import constants from '../helpers/constants';

// local component imports
import CaseViewScreen from './CaseViewScreen.js';
import ConnectionsLogin from '../components/Authentication/ConnectionsLogin';
import Loader from '../components/Loader/Loader';

// 3rd party imports like icons & scroll functionality
import ScrollToTop from '../UI/ScrollToTop';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';

// placeholder image for non-logged in users?
const placeholderImg = require('../../assets/profile_placeholder.png');
// unicode arrow
const leftArrow = '\u2190';

// this is like a local "store" -- used to initialize some state values, accessed in [state] hook
const FamilyConnectionsScreen = (props) => {
    const initialState = {
        searchKeywords: '',
        gender: 'Gender',
        ageRange: 'Age Range',
        sortBy: 'Sort By',
        modalVisible: false,
        filters: {
            male: false,
            female: false,
            unspecified: false,
            zero_five: false, // these are age groups, possibly not yet implemented in filters
            six_nine: false,
            ten_thirteen: false,
            fourteen_eighteen: false,
            name: false,
            last: false,
            DOB: false,
            created: false,
            updated: false,
        },
        caseVisible: false,
        addCaseModalVisible: true, // cannot currently add case to app, state not needed?
        pk: '',
    };

    // STATE HOOKS
    const [ state, setState ] = useState(initialState);
    const [ isScrolling, setIsScrolling ] = useState(false); // used to show "scroll to top" buttons; look into RN component that does this?
    const [ options, setOptions ] = useState({ x: 0, y: 0, animated: true }); // used as landing coordinates for scroll to top
    const [ sort, setSort ] = useState('Full Name'); // sort results of Family Connections, can be changed to several other values
    const [ rtn, setRtn ] = useState('RETURN'); // ❓ MIGHT display "RETURN" next to a return arrow in iOS modals; also exists in the CaseView component

    const genderAssignment = (gender) => { // also exists in the CaseView component
        if (gender === 'M') {
            return 'Male';
        }
        else if (gender === 'F') {
            return 'Female';
        }
        else if (gender === 'O') {
            return '';
        }
        else {
            return '';
        }
    };

    const goToTop = () => { // exists in multiple components
        scroll.scrollTo(options);
    };

    useEffect(() => {
    // if (!props.results[0]) {
        props.authChecker();
        props.getUserCases();
        Platform.OS === 'android' ? setRtn('') : null; // if Android, display no "RETURN" text, otherwise do nothing => probs better written as Platform.OS === 'android' && setRtn('')
    // }
    }, [ props.loadingUser ]);

    const setModalVisible = (visible) => {
        setState({ ...state, modalVisible: visible });
    };

    const setAddCaseModalVisible = (visible) => {
        setState({ ...state, addCaseModalVisible: visible });
    };

    const setCaseVisible = (visible) => {
        setState({ ...state, caseVisible: visible });
    };

    const handleKeywordChange = (event) => {
        setState({
            ...state,
            searchKeywords: event,
        });
    };

    // ------GENDER FILTER functionality------
    let filteredCases = props.results; // state.results

    if (
        !state.filters.male
    && !state.filters.female
    && !state.filters.unspecified
    ) {
    // if nothing is selected -- do nothing
    }
    else {
        if (!state.filters.male) {
            filteredCases = filteredCases.filter((c) => c.gender !== 'M');
        } // if male is not selected -- remove all males
        if (!state.filters.female) {
            filteredCases = filteredCases.filter((c) => c.gender !== 'F');
        }
        if (!state.filters.unspecified) {
            filteredCases = filteredCases.filter((c) => c.gender !== 'O');
        }
    }

    // ------SORTING Functionality------
    const name = (a, b) => {
        const A = a.full_name.toUpperCase();
        const B = b.full_name.toUpperCase();
        let comparison = 0;
        if (A > B) {
            comparison = 1;
        }
        else {
            comparison = -1;
        }
        return comparison;
    };

    const lastName = (a, b) => {
        const A = a.last_name.toUpperCase();
        const B = b.last_name.toUpperCase();
        let comparison = 0;
        if (A > B) {
            comparison = 1;
        }
        else {
            comparison = -1;
        }
        return comparison;
    };

    const created = (a, b) => {
        const A = a.created_at;
        const B = b.created_at;
        let comparison = 0;
        if (A > B) {
            comparison = 1;
        }
        else {
            comparison = -1;
        }
        return comparison;
    };

    const updated = (a, b) => {
        const A = a.updated_at;
        const B = b.updated_at;
        let comparison = 0;
        if (A > B) {
            comparison = 1;
        }
        else {
            comparison = -1;
        }
        return comparison;
    };

    if (state.filters.last) {
        filteredCases.sort(lastName);
    }
    else if (state.filters.created) {
        filteredCases.sort(created);
    }
    else if (state.filters.updated) {
        filteredCases.sort(updated);
    }
    else {
    // default
        filteredCases.sort(name);
    }

    // ------SEARCHBAR functionality - filters by case first_name or last_name---------
    let SearchedCases = filteredCases.filter((result) => {
        return (
            result.full_name
                .toLowerCase()
                .indexOf(state.searchKeywords.toLowerCase()) != -1
        );
    });

    return props.isLoadingCases ? (
        <Loader />
    ) : props.results[0] ? (
        <SafeAreaView>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    alignContent: 'center',
                    borderBottomWidth: 0.5,
                    borderBottomColor: '#babab9',
                }}
            >
                <SearchBar
                    inputStyle={{ fontSize: 16 }}
                    inputContainerStyle={{ backgroundColor: '#FAFAFA', height: 45.62 }}
                    placeholder="Search Cases"
                    placeholderTextColor="#8D8383"
                    // lightTheme
                    round
                    name="searchKeywords"
                    value={state.searchKeywords}
                    onChangeText={handleKeywordChange}
                    // create searchbar target platform.os
                    platform="ios"
                    containerStyle={styles.searchBar}
                />
                <TouchableHighlight
                    onPressIn={() => {
                        setModalVisible(true);
                    }}
                >
                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                        <MaterialIcons name="filter-list" color="black" size={32} />
                        <Text style={{ fontSize: 16 }}>Filter</Text>
                    </View>
                </TouchableHighlight>
            </View>

            {/* FILTERS BUTTON - onPress Modal */}
            <Modal
                animationType="fade"
                transparent={false}
                visible={state.modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View
                    style={{ backgroundColor: '#fff',
                        justifyContent: 'center',
                        height: Platform.OS == 'android' ? 20 : 52 }}
                >
                </View>

                <TouchableOpacity
                    underlayColor="lightgray"
                    onPressIn={() => {
                        setModalVisible(!state.modalVisible);
                    }}
                >
                    <Text
                        style={{
                            padding: 10,
                            paddingBottom: Platform.OS == 'android' ? 0 : 30,
                            fontSize: 18,
                            paddingTop: 0,
                            color: '#0F6580',
                            marginTop: Platform.OS === 'android' ? -37 : 0,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: Platform.OS === 'android' ? 45 : 20,
                                margin: Platform.OS === 'android' ? -50 : 0,
                            }}
                        >{leftArrow}
                        </Text>
                        <Text
                        > {rtn}
                        </Text>
                    </Text>
                </TouchableOpacity>
                <ScrollView
                    scrollsToTop
                    contentContainerStyle={{
                    }}
                >

                    <ScrollView
                        scrollsToTop
                        contentContainerStyle={{
                        }}
                    ></ScrollView>
                    <View
                        style={{
                            // marginTop: 10,
                            flex: 1,
                            width: '100%',
                            height: '100%',
                            alignSelf: 'flex-start',
                        }}
                    >

                        {/* SORT BY */}
                        <Text
                            style={{
                                fontFamily: constants.lotoFamily,
                                color: 'rgba(24, 23, 21, 0.5)',
                                marginLeft: 10,
                                // marginTop: 20,
                                marginBottom: 5,
                                fontSize: 14,
                                fontWeight: '800',
                                textAlign: 'left',
                            }}
                        >
              SORT BY
                        </Text>
                        <View
                            style={{
                                borderBottomColor: 'rgba(24, 23, 21, 0.3)',
                                borderBottomWidth: 0.5,
                                marginBottom: 10,
                                marginHorizontal: 10,
                            }}
                        />
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginLeft: 10,
                                marginVertical: 10,
                            }}
                        >
                            <RadioButton
                                value="Full Name"
                                status= {sort === 'Full Name' ? 'checked' : 'unchecked'}
                                color="#0279ac"
                                checked={state.filters.name}
                                onPress={() => {
                                    setSort('Full Name');
                                    setState({
                                        ...state,
                                        filters: {
                                            ...state.filters,
                                            name: !state.filters.name,
                                            last: false,
                                            DOB: false,
                                            created: false,
                                            updated: false,
                                        },
                                    });
                                }
                                }
                            />
                            <Text style={styles.checkboxes}>  Full Name</Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginLeft: 10,
                                marginVertical: 10,
                            }}
                        >
                            <RadioButton
                                value="Last Name"
                                status= {sort === 'Last Name' ? 'checked' : 'unchecked'}
                                color="#0279ac"
                                checked={state.filters.last}
                                onPress={() => {
                                    setSort('Last Name');
                                    setState({
                                        ...state,
                                        filters: {
                                            ...state.filters,
                                            name: false,
                                            last: !state.filters.last,
                                            DOB: false,
                                            created: false,
                                            updated: false,
                                        },
                                    });
                                }
                                }
                            />
                            <Text style={styles.checkboxes}>  Last Name</Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginLeft: 10,
                                marginVertical: 10,
                            }}
                        >
                            <RadioButton
                                value="Date Created"
                                status={sort === 'Date Created' ? 'checked' : 'unchecked'}
                                color="#0279ac"
                                checked={state.filters.created}
                                onPress={() => {
                                    setSort('Date Created');
                                    setState({
                                        ...state,
                                        filters: {
                                            ...state.filters,
                                            name: false,
                                            last: false,
                                            DOB: false,
                                            created: !state.filters.created,
                                            updated: false,
                                        },
                                    });
                                }
                                }
                            />
                            <Text style={styles.checkboxes}>  Date Created</Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginLeft: 10,
                                marginVertical: 10,
                            }}
                        >
                            <RadioButton
                                value="Last Updated"
                                status={sort === 'Last Updated' ? 'checked' : 'unchecked'}
                                color="#0279ac"
                                checked={state.filters.updated}
                                onPress={() => {
                                    setSort('Last Updated');
                                    setState({
                                        ...state,
                                        filters: {
                                            ...state.filters,
                                            name: false,
                                            last: false,
                                            DOB: false,
                                            created: false,
                                            updated: !state.filters.updated,
                                        },
                                    });
                                }
                                }
                            />
                            <Text style={styles.checkboxes}>  Last Updated</Text>
                        </View>
                        {/* GENDER */}
                        <Text
                            style={{
                                fontFamily: constants.lotoFamily,
                                color: 'rgba(24, 23, 21, 0.5)',
                                marginLeft: 10,
                                marginTop: 20,
                                marginBottom: 5,
                                fontSize: 14,
                                fontWeight: '800',
                                textAlign: 'left',
                            }}
                        >
              GENDER
                        </Text>
                        <View
                            style={{
                                borderBottomColor: 'rgba(24, 23, 21, 0.3)',
                                borderBottomWidth: 0.5,
                                marginBottom: 10,
                                marginHorizontal: 10,
                            }}
                        />
                        <CheckBox
                            containerStyle={{
                                backgroundColor: 'white',
                                borderColor: 'white',
                            }}
                            title="Male"
                            textStyle={{ ...styles.checkboxes }}
                            size={30}
                            checked={state.filters.male}
                            checkedColor="#0279ac"
                            onPress={() =>
                                setState({
                                    ...state,
                                    filters: {
                                        ...state.filters,
                                        male: !state.filters.male,
                                    },
                                })
                            }
                        />
                        <CheckBox
                            containerStyle={{
                                backgroundColor: 'white',
                                borderColor: 'white',
                            }}
                            title="Female"
                            textStyle={{ ...styles.checkboxes }}
                            size={30}
                            checked={state.filters.female}
                            checkedColor="#0279ac"
                            onPress={() =>
                                setState({
                                    ...state,
                                    filters: {
                                        ...state.filters,
                                        female: !state.filters.female,
                                    },
                                })
                            }
                        />
                        <CheckBox
                            containerStyle={{
                                backgroundColor: 'white',
                                borderColor: 'white',
                                marginBottom: 100,
                            }}
                            title="Not Specified"
                            textStyle={{ ...styles.checkboxes }}
                            size={30}
                            checked={state.filters.unspecified}
                            checkedColor="#0279ac"
                            onPress={() =>
                                setState({
                                    ...state,
                                    filters: {
                                        ...state.filters,
                                        unspecified: !state.filters.unspecified,
                                    },
                                })
                            }
                        />
                    </View>
                </ScrollView>
                <View
                    style={{
                        alignContent: 'center',
                        alignSelf: 'center',
                        width: 100,
                        fontSize: 80,
                    }}
                >
                </View>
            </Modal>

            {/* Case List Todos:
       Cache case info from API for faster loading */}
            {/* Case List View Starts Here */}
            <View style={{ paddingBottom: 142 }}>
                <View>
                    {isScrolling ? (
                        <ScrollToTop
                            style={{
                                position: 'absolute',
                                zIndex: 1000,
                                bottom: 10,
                                right: 46,
                            }}
                            onPress={() => goToTop()}
                        />
                    ) : null}
                    <ScrollView
                        style={{ height: '100%' }}
                        ref={(a) => (scroll = a)}
                        contentInset={{ bottom: constants.headerHeight }}
                        scrollsToTop
                        onScroll={(e) => {
                            if (e.nativeEvent.contentOffset.y <= 250) {
                                setIsScrolling(false);
                            }
                            else if (e.nativeEvent.contentOffset.y >= 250) {
                                setIsScrolling(true);
                            }
                        }}
                        onScrollToTop={() => setIsScrolling(false)}
                        scrollEventThrottle={16}
                    >
                        {props.isLoading ? (
                            <Loader />
                        ) : (
                            SearchedCases.map((result, index) => (
                                <ListItem
                                    key={index}
                                    title={result.full_name}
                                    titleStyle={{ color: '#5A6064' }}
                                    subtitle={`${genderAssignment(result.gender)}${
                                        result.birthday?.raw?.length > 0 ? '\nBirth: ' + result.birthday.raw : ''
                                    }`}
                                    subtitleStyle={{ color: '#9FABB3' }}
                                    leftAvatar={
                                        <View
                                            style={{
                                                height: 50,
                                                width: 50,
                                                borderRadius: 25,
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <Image
                                                source={
                                                    result.picture
                                                        ? { uri: result.picture }
                                                        : placeholderImg
                                                }
                                                style={{
                                                    height: 50,
                                                    width: 50,
                                                    borderRadius: 25,
                                                    overflow: 'hidden',
                                                }}
                                            />
                                        </View>
                                    }
                                    to
                                    pDivider={true}
                                    onPress={() => {
                                        props.navigation.navigate('CaseView', {
                                            pk: result.pk,
                                            caseData: result,
                                        });
                                        setIsScrolling(false);
                                    }}
                                />
                            ))
                        )}
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    ) : (
        <ConnectionsLogin
            setUserCreds={props.setUserCreds}
            setModalVisible={props.setModalVisible}
        />
    );
}; // end of FamilyConnectionsScreen

const styles = StyleSheet.create({
    searchBar: {
        marginRight: 5,
        marginLeft: 5,
        width: '75%',
        backgroundColor: Platform.OS === 'ios' ? 'white' : 'white',
    },
    filterButton: {
        width: Platform.OS === 'ios' ? 70 : 70,
        marginVertical: Platform.OS === 'ios' ? 20 : 20,
        maxHeight: Platform.OS === 'ios' ? 40 : 40,
    },
    isLoading: {
        textAlign: 'center',
        fontSize: 20,
        flex: 1,
        marginTop: 240,
        color: 'black',
    },
    checkboxes: {
        fontSize: 18,
        fontWeight: 'normal',
    },
});

const mapStateToProps = (state) => {
    const { caseData } = state.caseData;
    const { results, isLoadingCases, caseDataError } = state.userCases;
    const { accessToken, loadingUser } = state.auth;

    return {
        results,
        caseData,
        accessToken,
        isLoadingCases,
        caseDataError,
        loadingUser,
    };
};

export default connect(mapStateToProps, {
    getUserCases,
    getCaseData,
    setUserCreds,
    setModalVisible,
    authChecker,
})(FamilyConnectionsScreen);
