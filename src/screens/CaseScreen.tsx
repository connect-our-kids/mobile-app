import React, { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {
    Text,
    View,
    TouchableHighlight,
    TouchableOpacity,
    Image,
    StyleSheet,
    Platform,
    ScrollView,
    Modal,
} from 'react-native';
import { ListItem, SearchBar, CheckBox } from 'react-native-elements';
import { getCase, clearCase } from '../store/actions/caseAction';

import { connect } from 'react-redux';
import Loader from '../components/Loader';
import RelationshipListItem from '../components/family-connections/CaseList';

import ScrollToTop from '../components/family-connections/ScrollToTop/ScrollToTop';
import { RadioButton } from 'react-native-paper';

const leftArrow = '\u2190';
import placeholderImg from '../../assets/profile_placeholder.png';
import { RootState } from '../store/reducers';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import {
    caseDetailFull,
    caseDetailFull_relationships,
} from '../generated/caseDetailFull';
import { RelationshipScreenParams } from './RelationshipScreen';
import constants from '../helpers/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import ConnectionsLogin from '../components/auth/ConnectionsLogin';
import { AuthState } from '../store/reducers/authReducer';
import { createPersonSubtitle } from '../helpers/personSubtitle';
import moment from 'moment';

interface StateProps {
    case?: caseDetailFull;
    isLoadingCase: boolean;
    caseError?: string;
    auth: AuthState;
}

interface DispatchProps {
    getCase: typeof getCase;
    clearCase: typeof clearCase;
}

type Navigation = NavigationScreenProp<NavigationState>;

interface OwnProps {
    navigation: Navigation;
}

type Props = StateProps & DispatchProps & OwnProps;

const CaseScreen = (props: Props) => {
    const [descriptionVisible, setDescriptionVisible] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const [sort, setSort] = useState('Full Name');
    const [searchKeywords, setSearchKeywords] = useState('');
    const [filtersSelected, setFiltersSelected] = useState({
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false, // male  TODO update for new genders
        7: false, // female TODO update for new genders
        8: false, // unspecified gender TODO update for new genders
        name: true,
        last: false,
        DOB: false,
        created: false,
        updated: false,
    });
    const [rtn, setRtn] = useState('RETURN');

    // load once to get all case data
    useEffect(() => {
        props.getCase(props.navigation.getParam('pk') as number);
        Platform.OS === 'android' ? setRtn('') : null;
    }, []);

    const handleKeywordChange = (e) => {
        setSearchKeywords(e);
    };

    // TODO this is wrong with new genders
    const genderFilter = (arr: caseDetailFull_relationships[]) => {
        // ------GENDER FILTER functionality------
        if (!filtersSelected[6] && !filtersSelected[7] && !filtersSelected[8]) {
            return arr;
        } else {
            if (!filtersSelected[6]) {
                arr = arr.filter((c) => c.person.gender !== 'M');
            }

            if (!filtersSelected[7]) {
                arr = arr.filter((c) => c.person.gender !== 'F');
            }

            if (!filtersSelected[8]) {
                arr = arr.filter((c) => c.person.gender !== 'O');
            }
            return arr;
        }
    };

    // ------FILTER functionality------
    const filteredConnections = (caseToFilter: caseDetailFull) => {
        // ------STATUS FILTER functionality------
        // if no filters are set, do nothing
        // if (props.caseConnections === undefined) {
        //     return [];
        // }

        if (
            !filtersSelected[0] &&
            !filtersSelected[1] &&
            !filtersSelected[2] &&
            !filtersSelected[3] &&
            !filtersSelected[4] &&
            !filtersSelected[5]
        ) {
            return genderFilter(caseToFilter.relationships);
        } else {
            // remove everyone without a status
            const noStatus = caseToFilter.relationships.filter(
                (connection) => !connection.status
            );

            // people with statuses only
            let filteredList = caseToFilter.relationships.filter(
                (connection) => connection.status
            );

            if (!filtersSelected[1]) {
                // if filter1 not selected, remove everyone with filter1
                filteredList = filteredList.filter(
                    (connection) =>
                        connection.status?.name !== 'Family Candidate'
                );
            }
            if (!filtersSelected[2]) {
                // if filter2 not selected, remove everyone with filter2
                filteredList = filteredList.filter(
                    (connection) => connection.status?.name !== 'Highlight'
                );
            }
            if (!filtersSelected[3]) {
                // if filter3 not selected, remove everyone with filter3
                filteredList = filteredList.filter(
                    (connection) => connection.status?.name !== 'No-Go'
                );
            }
            if (!filtersSelected[4]) {
                // if filter4 not selected, remove everyone with filter4
                filteredList = filteredList.filter(
                    (connection) => connection.status?.name !== 'Of Interest'
                );
            }
            if (!filtersSelected[5]) {
                // if filter5 not selected, remove everyone with filter5
                filteredList = filteredList.filter(
                    (connection) =>
                        connection.status?.name !== 'Support Candidate'
                );
            }
            if (filtersSelected[0]) {
                // add back people without a status if no status filter is selected
                filteredList = filteredList.concat(noStatus);
            }

            return genderFilter(filteredList);
        }
    };

    // ------SEARCH BAR functionality - filters by case first_name or last_name---------
    let searchedConnections: caseDetailFull_relationships[] = [];
    if (!props.isLoadingCase && props.case) {
        searchedConnections = filteredConnections(props.case).filter(
            (result) => {
                return (
                    result.person.fullName
                        .toLowerCase()
                        .indexOf(searchKeywords.toLowerCase()) !== -1
                );
            }
        );
    }

    const styles = StyleSheet.create({
        searchBar: {
            marginHorizontal: Platform.OS === 'ios' ? 5 : 5,
            width: '75%',
            backgroundColor: Platform.OS === 'ios' ? 'white' : 'white',
        },
        checkboxes: {
            fontSize: 18,
            fontWeight: 'normal',
        },
    });

    if (!props.auth.isLoggedIn) {
        return <ConnectionsLogin />;
    }

    let scroll: ScrollView | null = null;

    console.log(props.case?.details);

    return (
        <SafeAreaView
            style={{
                backgroundColor: constants.backgroundColor,
                flex: 1,
                paddingTop: 0,
            }}
        >
            <View
                style={{ backgroundColor: constants.backgroundColor, flex: 1 }}
            >
                {isScrolling ? (
                    <ScrollToTop
                        style={{
                            position: 'absolute',
                            zIndex: 1000,
                            bottom: 15,
                            right: 46,
                        }}
                        onPress={() => {
                            scroll?.scrollTo({ x: 0, y: 0, animated: true });
                        }}
                    />
                ) : null}

                {props.isLoadingCase ? (
                    <Loader />
                ) : props.case?.details ? (
                    <ScrollView
                        scrollsToTop
                        ref={(a) => {
                            scroll = a;
                        }}
                        onScroll={(e) => {
                            if (e.nativeEvent.contentOffset.y <= 250) {
                                setIsScrolling(false);
                            } else if (e.nativeEvent.contentOffset.y >= 250) {
                                setIsScrolling(true);
                            }
                        }}
                        onScrollToTop={() => setIsScrolling(false)}
                        scrollEventThrottle={16}
                    >
                        <View style={{ height: 95 }}>
                            <ListItem
                                title={props.case.details?.person.fullName}
                                titleStyle={{ fontSize: 18 }}
                                style={{ height: 50 }}
                                subtitle={
                                    <View>
                                        <Text style={{ color: '#434245' }}>
                                            {createPersonSubtitle(
                                                props.case.details.person
                                            )}
                                        </Text>
                                        {props.case.details.person.addresses
                                            ?.length > 0 &&
                                        props.case.details?.person.addresses[0]
                                            .raw ? (
                                            <Text style={{ color: '#434245' }}>
                                                {`${props.case.details.person.addresses[0].locality}, ${props.case.details.person.addresses[0].state}`}
                                            </Text>
                                        ) : null}
                                        {props.case.details.fosterCare ? (
                                            <Text style={{ color: '#434245' }}>
                                                {`Case started ${moment().from(
                                                    [
                                                        props.case.details
                                                            .fosterCare,
                                                    ],
                                                    true
                                                )} ago`}
                                            </Text>
                                        ) : null}
                                    </View>
                                }
                                leftAvatar={
                                    <View
                                        style={{
                                            height: 80,
                                            width: 80,
                                            borderRadius: 40,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {props.case.details.person.picture ? (
                                            <Image
                                                source={{
                                                    uri:
                                                        props.case.details
                                                            .person.picture,
                                                }}
                                                style={{
                                                    height: 80,
                                                    width: 80,
                                                    borderRadius: 40,
                                                    overflow: 'hidden',
                                                }}
                                                defaultSource={placeholderImg}
                                            />
                                        ) : (
                                            <Image
                                                source={placeholderImg}
                                                style={{
                                                    height: 80,
                                                    width: 80,
                                                    borderRadius: 40,
                                                    overflow: 'hidden',
                                                }}
                                                defaultSource={placeholderImg}
                                            />
                                        )}
                                    </View>
                                }
                            />
                        </View>
                        <View
                            style={{
                                justifyContent: 'center',
                                flexDirection: 'column',
                                width: '100%',
                                alignItems: 'center',
                            }}
                        >
                            {/* search Functionality */}
                            <View
                                style={{
                                    flexDirection: 'column',
                                    width: '100%',
                                    minHeight: 350,
                                }}
                            >
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
                                        inputContainerStyle={{
                                            backgroundColor: '#FAFAFA',
                                            height: 45.62,
                                        }}
                                        placeholder="Search Connections"
                                        placeholderTextColor="#8D8383"
                                        cancelButtonProps={{
                                            buttonTextStyle: {
                                                color: 'rgb(8,121,169)',
                                            },
                                        }}
                                        // lightTheme
                                        round
                                        value={searchKeywords}
                                        onChangeText={handleKeywordChange}
                                        // create searchbar target platform.os
                                        platform="ios"
                                        containerStyle={styles.searchBar}
                                    />
                                    <TouchableHighlight
                                        onPressIn={() => {
                                            setDescriptionVisible(true);
                                        }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <MaterialIcons
                                                name="filter-list"
                                                color="black"
                                                size={32}
                                            />
                                            <Text style={{ fontSize: 16 }}>
                                                Filter
                                            </Text>
                                        </View>
                                    </TouchableHighlight>
                                </View>

                                {/* List of Connections to Child Starts Here */}

                                {searchedConnections &&
                                    searchedConnections.map(
                                        (connection, index) => {
                                            return (
                                                <RelationshipListItem
                                                    pressed={() => {
                                                        const params: RelationshipScreenParams = {
                                                            relationshipId:
                                                                connection.id,
                                                        };
                                                        props.navigation.navigate(
                                                            'RelationshipScreen',
                                                            { ...params }
                                                        );
                                                        setIsScrolling(false);
                                                    }}
                                                    key={index}
                                                    relationship={connection}
                                                />
                                            );
                                        }
                                    )}
                            </View>
                        </View>
                        <Modal
                            animationType="fade"
                            transparent={false}
                            visible={descriptionVisible}
                            onRequestClose={() => setDescriptionVisible(false)}
                        >
                            <View
                                style={{
                                    backgroundColor: '#fff',
                                    height: Platform.OS === 'android' ? 20 : 52,
                                    justifyContent: 'center',
                                }}
                            ></View>
                            <TouchableOpacity
                                onPressIn={() => {
                                    setDescriptionVisible(false);
                                }}
                            >
                                <Text
                                    style={{
                                        padding: 10,
                                        fontSize: 18,
                                        paddingBottom:
                                            Platform.OS === 'android' ? -20 : 0,
                                        color: '#0F6580',
                                        marginTop:
                                            Platform.OS === 'android' ? -37 : 0,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize:
                                                Platform.OS === 'android'
                                                    ? 45
                                                    : 20,
                                            margin:
                                                Platform.OS === 'android'
                                                    ? -2
                                                    : 0,
                                        }}
                                    >
                                        {leftArrow}
                                    </Text>
                                    <Text> {rtn}</Text>
                                </Text>
                            </TouchableOpacity>
                            <ScrollView scrollsToTop>
                                <View
                                    style={{
                                        marginTop: 10,
                                        flex: 1,
                                        width: '100%',
                                        height: '100%',
                                        alignSelf: 'flex-start',
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: 'rgba(24, 23, 21, 0.5)',
                                            marginLeft: 10,
                                            marginTop:
                                                Platform.OS === 'android'
                                                    ? 0
                                                    : 20,
                                            marginBottom: 5,
                                            fontSize: 14,
                                            fontWeight: '800',
                                            textAlign: 'left',
                                        }}
                                    >
                                        PERSON STATUS
                                    </Text>
                                    <View
                                        style={{
                                            borderBottomColor:
                                                'rgba(24, 23, 21, 0.3)',
                                            borderBottomWidth: 0.5,
                                            marginBottom: 10,
                                            marginHorizontal: 10,
                                        }}
                                    ></View>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <CheckBox
                                            containerStyle={{
                                                backgroundColor: 'white',
                                                borderColor: 'white',
                                            }}
                                            title="Not Set"
                                            textStyle={styles.checkboxes}
                                            size={30}
                                            checked={
                                                filtersSelected[0]
                                                    ? true
                                                    : false
                                            }
                                            onPress={() =>
                                                setFiltersSelected({
                                                    ...filtersSelected,
                                                    0: !filtersSelected[0],
                                                })
                                            }
                                        />
                                        <View
                                            style={{
                                                backgroundColor: 'white',
                                                width: 25,
                                                height: 25,
                                                marginRight: 20,
                                                borderWidth: 1,
                                                borderColor: '#ddd',
                                                borderRadius: 100,
                                            }}
                                        />
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <CheckBox
                                            containerStyle={{
                                                backgroundColor: 'white',
                                                borderColor: 'white',
                                            }}
                                            title="Highlight"
                                            textStyle={styles.checkboxes}
                                            size={30}
                                            checked={
                                                filtersSelected[2]
                                                    ? true
                                                    : false
                                            }
                                            onPress={() =>
                                                setFiltersSelected({
                                                    ...filtersSelected,
                                                    2: !filtersSelected[2],
                                                })
                                            }
                                        />
                                        <View
                                            style={{
                                                backgroundColor: '#F8E358',
                                                width: 25,
                                                height: 25,
                                                marginRight: 20,
                                                borderWidth: 1,
                                                borderColor: '#fff',
                                                borderRadius: 100,
                                            }}
                                        />
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <CheckBox
                                            containerStyle={{
                                                backgroundColor: 'white',
                                                borderColor: 'white',
                                            }}
                                            title="Of interest"
                                            textStyle={styles.checkboxes}
                                            size={30}
                                            checked={
                                                filtersSelected[4]
                                                    ? true
                                                    : false
                                            }
                                            onPress={() =>
                                                setFiltersSelected({
                                                    ...filtersSelected,
                                                    4: !filtersSelected[4],
                                                })
                                            }
                                        />
                                        <View
                                            style={{
                                                backgroundColor: '#8656B6',
                                                width: 25,
                                                height: 25,
                                                marginRight: 20,
                                                borderWidth: 1,
                                                borderColor: '#fff',
                                                borderRadius: 100,
                                            }}
                                        />
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <CheckBox
                                            containerStyle={{
                                                backgroundColor: 'white',
                                                borderColor: 'white',
                                            }}
                                            title="Potential Supporter"
                                            textStyle={styles.checkboxes}
                                            size={30}
                                            checked={
                                                filtersSelected[5]
                                                    ? true
                                                    : false
                                            }
                                            onPress={() =>
                                                setFiltersSelected({
                                                    ...filtersSelected,
                                                    5: !filtersSelected[5],
                                                })
                                            }
                                        />
                                        <View
                                            style={{
                                                backgroundColor: '#60C1E9',
                                                width: 25,
                                                height: 25,
                                                marginRight: 20,
                                                borderWidth: 1,
                                                borderColor: '#fff',
                                                borderRadius: 100,
                                            }}
                                        />
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <CheckBox
                                            containerStyle={{
                                                backgroundColor: 'white',
                                                borderColor: 'white',
                                            }}
                                            title="Placement Option"
                                            textStyle={styles.checkboxes}
                                            size={30}
                                            checked={
                                                filtersSelected[1]
                                                    ? true
                                                    : false
                                            }
                                            onPress={() =>
                                                setFiltersSelected({
                                                    ...filtersSelected,
                                                    1: !filtersSelected[1],
                                                })
                                            }
                                        />
                                        <View
                                            style={{
                                                backgroundColor: '#9DE36B',
                                                width: 25,
                                                height: 25,
                                                marginRight: 20,
                                                borderWidth: 1,
                                                borderColor: '#fff',
                                                borderRadius: 100,
                                            }}
                                        />
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <CheckBox
                                            containerStyle={{
                                                backgroundColor: 'white',
                                                borderColor: 'white',
                                            }}
                                            title="No-go"
                                            textStyle={styles.checkboxes}
                                            size={30}
                                            checked={
                                                filtersSelected[3]
                                                    ? true
                                                    : false
                                            }
                                            onPress={() =>
                                                setFiltersSelected({
                                                    ...filtersSelected,
                                                    3: !filtersSelected[3],
                                                })
                                            }
                                        />
                                        <View
                                            style={{
                                                backgroundColor: '#DE4A4C',
                                                width: 25,
                                                height: 25,
                                                marginRight: 20,
                                                borderWidth: 1,
                                                borderColor: '#fff',
                                                borderRadius: 100,
                                            }}
                                        />
                                    </View>

                                    <Text
                                        style={{
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
                                            borderBottomColor:
                                                'rgba(24, 23, 21, 0.3)',
                                            borderBottomWidth: 0.5,
                                            marginBottom: 10,
                                            marginHorizontal: 10,
                                        }}
                                    ></View>
                                    <CheckBox
                                        containerStyle={{
                                            backgroundColor: 'white',
                                            borderColor: 'white',
                                        }}
                                        title="Male"
                                        textStyle={styles.checkboxes}
                                        size={30}
                                        checked={filtersSelected[6]}
                                        // onIconPress={setFiltersSelected({
                                        //   ...filtersSelected,
                                        //   male: true
                                        // })}
                                        onPress={() => {
                                            setFiltersSelected({
                                                ...filtersSelected,
                                                6: !filtersSelected[6],
                                            });
                                        }}
                                    />
                                    <CheckBox
                                        containerStyle={{
                                            backgroundColor: 'white',
                                            borderColor: 'white',
                                        }}
                                        title="Female"
                                        textStyle={styles.checkboxes}
                                        size={30}
                                        checked={filtersSelected[7]}
                                        onPress={() =>
                                            setFiltersSelected({
                                                ...filtersSelected,
                                                7: !filtersSelected[7],
                                            })
                                        }
                                    />
                                    <CheckBox
                                        containerStyle={{
                                            backgroundColor: 'white',
                                            borderColor: 'white',
                                        }}
                                        title="Not Specified"
                                        textStyle={styles.checkboxes}
                                        size={30}
                                        checked={filtersSelected[8]}
                                        onPress={() =>
                                            setFiltersSelected({
                                                ...filtersSelected,
                                                8: !filtersSelected[8],
                                            })
                                        }
                                    />

                                    <Text
                                        style={{
                                            color: 'rgba(24, 23, 21, 0.5)',
                                            marginLeft: 10,
                                            marginTop: 20,
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
                                            borderBottomColor:
                                                'rgba(24, 23, 21, 0.3)',
                                            borderBottomWidth: 0.5,
                                            marginBottom: 10,
                                            marginHorizontal: 10,
                                        }}
                                    ></View>
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
                                            status={
                                                sort === 'Full Name'
                                                    ? 'checked'
                                                    : 'unchecked'
                                            }
                                            color="#0279ac"
                                            onPress={() => {
                                                setSort('Full Name');
                                                setFiltersSelected({
                                                    ...filtersSelected,
                                                    name: !filtersSelected.name,
                                                    last: false,
                                                    DOB: false,
                                                    created: false,
                                                    updated: false,
                                                });
                                            }}
                                        />
                                        <Text style={styles.checkboxes}>
                                            {' '}
                                            Full Name
                                        </Text>
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
                                            status={
                                                sort === 'Last Name'
                                                    ? 'checked'
                                                    : 'unchecked'
                                            }
                                            color="#0279ac"
                                            onPress={() => {
                                                setSort('Last Name');
                                                setFiltersSelected({
                                                    ...filtersSelected,
                                                    name: false,
                                                    last: !filtersSelected.last,
                                                    DOB: false,
                                                    created: false,
                                                    updated: false,
                                                });
                                            }}
                                        />
                                        <Text style={styles.checkboxes}>
                                            {' '}
                                            Last Name
                                        </Text>
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
                                            status={
                                                sort === 'Date Created'
                                                    ? 'checked'
                                                    : 'unchecked'
                                            }
                                            color="#0279ac"
                                            onPress={() => {
                                                setSort('Date Created');
                                                setFiltersSelected({
                                                    ...filtersSelected,
                                                    name: false,
                                                    last: false,
                                                    DOB: false,
                                                    created: !filtersSelected.created,
                                                    updated: false,
                                                });
                                            }}
                                        />
                                        <Text style={styles.checkboxes}>
                                            {' '}
                                            Date Created
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginLeft: 10,
                                            marginVertical: 10,
                                            marginBottom: 100,
                                        }}
                                    >
                                        <RadioButton
                                            value="Last Updated"
                                            status={
                                                sort === 'Last Updated'
                                                    ? 'checked'
                                                    : 'unchecked'
                                            }
                                            color="#0279ac"
                                            onPress={() => {
                                                setSort('Last Updated');
                                                setFiltersSelected({
                                                    ...filtersSelected,
                                                    name: false,
                                                    last: false,
                                                    DOB: false,
                                                    created: false,
                                                    updated: !filtersSelected.updated,
                                                });
                                            }}
                                        />
                                        <Text style={styles.checkboxes}>
                                            {' '}
                                            Last Updated
                                        </Text>
                                        <View />
                                    </View>
                                </View>
                            </ScrollView>
                        </Modal>
                    </ScrollView>
                ) : (
                    <Loader />
                )}
            </View>
        </SafeAreaView>
    );
};

const mapStateToProps = (state: RootState) => {
    return {
        case: state.case.results,
        isLoadingCase: state.case.isLoading,
        caseError: state.case.error,
        auth: state.auth,
    };
};

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, {
    getCase,
    clearCase,
})(CaseScreen);
