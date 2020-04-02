import React, { useState, useEffect } from 'react';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
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
    BackHandler,
} from 'react-native';
import constants from '../helpers/constants';
import { ListItem, SearchBar, CheckBox } from 'react-native-elements';
import { getCaseData, clearCaseData } from '../store/actions/caseData';
import {
    getCaseConnections,
    clearCaseConnections,
} from '../store/actions/caseConnections';

import { connect } from 'react-redux';
import Loader from '../components/Loader';
import CaseList from '../components/cases/CaseList';

import ScrollToTop from '../UI/ScrollToTop';
import { RadioButton } from 'react-native-paper';

const leftArrow = '\u2190';
const placeholderImg = require('../../assets/profile_placeholder.png');

export function CaseViewScreen(props) {
    let filteredCases = props.caseConnections;

    const [ descriptionVisible, setDescriptionVisible ] = useState(false);
    const [ isScrolling, setIsScrolling ] = useState(false);
    const [ sort, setSort ] = useState('Full Name');
    const [ searchKeywords, setSearchKeywords ] = useState('');
    const [ filtersSelected, setFiltersSelected ] = useState({
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false, // male
        7: false, // female
        8: false, // unspecified gender
        name: true,
        last: false,
        DOB: false,
        created: false,
        updated: false,
    });
    const [ rtn, setRtn ] = useState('RETURN');

    // on load get case data and case connections through redux
    useEffect(() => {
        props.getCaseData(props.navigation.getParam('pk'));
        props.getCaseConnections(props.navigation.getParam('pk'));
        Platform.OS === 'android' ? setRtn('') : null;
    }, [ false ]);

    let caseData = props.caseData;

    const handleKeywordChange = (e) => {
        setSearchKeywords(e);
    };

    const genderAssignment = (gender) => {
        if (gender === 'M') {
            return 'Male';
        }
        else if (gender === 'F') {
            return 'Female';
        }
        else if (gender === 'O') {
            return 'Not Specified';
        }
        else {
            return null;
        }
    };

    // sort by name
    const name = (a, b) => {
        const A = a.person.full_name.toUpperCase();
        const B = b.person.full_name.toUpperCase();
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
        const A = a.person.last_name.toUpperCase();
        const B = b.person.last_name.toUpperCase();
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
        const A = a.person.created_at;
        const B = b.person.created_at;
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
        const A = a.person.updated_at;
        const B = b.person.updated_at;
        let comparison = 0;
        if (A > B) {
            comparison = 1;
        }
        else {
            comparison = -1;
        }
        return comparison;
    };

    if (filtersSelected.last) {
        filteredCases.sort(lastName);
    }
    else if (filtersSelected.created) {
        filteredCases.sort(created);
    }
    else if (filtersSelected.updated) {
        filteredCases.sort(updated);
    }
    else {
        filteredCases.sort(name); // switched default to sort by last name, change param to name to sort by full
    }

    // ------FILTER functionality------
    const filteredConnections = () => {
    // ------STATUS FILTER functionality------
    // if no filters are set, do nothing

        if (
            !filtersSelected[0]
      && !filtersSelected[1]
      && !filtersSelected[2]
      && !filtersSelected[3]
      && !filtersSelected[4]
      && !filtersSelected[5]
        ) {
            return genderFilter(props.caseConnections);
        }
        else {
            // remove everyone without a status
            let noStatus = props.caseConnections.filter(
                (connection) => !connection.person.status,
            );

            // people with statuses only
            let filteredList = props.caseConnections.filter(
                (connection) => connection.person.status,
            );

            if (!filtersSelected[1]) {
                // if filter1 not selected, remove everyone with filter1
                filteredList = filteredList.filter(
                    (connection) => connection.person.status.name !== 'Family Candidate',
                );
            }
            if (!filtersSelected[2]) {
                // if filter2 not selected, remove everyone with filter2
                filteredList = filteredList.filter(
                    (connection) => connection.person.status.name !== 'Highlight',
                );
            }
            if (!filtersSelected[3]) {
                // if filter3 not selected, remove everyone with filter3
                filteredList = filteredList.filter(
                    (connection) => connection.person.status.name !== 'No-Go',
                );
            }
            if (!filtersSelected[4]) {
                // if filter4 not selected, remove everyone with filter4
                filteredList = filteredList.filter(
                    (connection) => connection.person.status.name !== 'Of Interest',
                );
            }
            if (!filtersSelected[5]) {
                // if filter5 not selected, remove everyone with filter5
                filteredList = filteredList.filter(
                    (connection) => connection.person.status.name !== 'Support Candidate',
                );
            }
            if (filtersSelected[0]) {
                // add back people without a status if no status filter is selected
                filteredList = filteredList.concat(noStatus);
            }

            return genderFilter(filteredList);
        }
    };

    const genderFilter = (arr) => {
    // ------GENDER FILTER functionality------
        if (!filtersSelected[6] && !filtersSelected[7] && !filtersSelected[8]) {
            return arr;
        }
        else {
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

    // ------SEARCHBAR functionality - filters by case first_name or last_name---------
    let SearchedConnections = filteredConnections().filter((result) => {
        return (
            result.person.full_name
                .toLowerCase()
                .indexOf(searchKeywords.toLowerCase()) != -1
        );
    });

    const goToTop = () => {
        scroll.scrollTo({ x: 0, y: 0, animated: true });
    };

    return (
        <View>
            {isScrolling ? (
                <ScrollToTop
                    style={{
                        position: 'absolute',
                        zIndex: 1000,
                        bottom: 15,
                        right: 46,
                    }}
                    onPress={goToTop}
                />
            ) : null}
            <ScrollView
                scrollsToTop
                ref={(a) => {
                    scroll = a;
                }}
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
                <View>
                    <ListItem
                        title={caseData.full_name}
                        titleStyle={{ fontSize: 18 }}
                        subtitle={
                            <View>
                                {caseData.gender ? (
                                    <Text style={{ color: '#434245' }}>
                                        {genderAssignment(caseData.gender)}
                                    </Text>
                                ) : null}
                                {caseData.birthday?.raw?.length > 0 ? (
                                    <Text style={{ color: '#434245' }}>
                                        Date of Birth: {caseData.birthday.raw}
                                    </Text>
                                ) : null}
                                {caseData.address && caseData.address.formatted ? (
                                    <Text style={{ color: '#434245' }}>
                                        {caseData.address.formatted}
                                    </Text>
                                ) : null}
                                {caseData.foster_care ? (
                                    <Text style={{ color: '#434245' }}>
                                        Case Initiation: {caseData.foster_care}
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
                                {caseData.picture ? (
                                    <Image
                                        source={{ uri: caseData.picture }}
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
                                cancelButtonProps={{ buttonTextStyle: { color: 'rgb(8,121,169)' } }}
                                // lightTheme
                                round
                                name="searchKeywords"
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
                                    <MaterialIcons name="filter-list" color="black" size={32} />
                                    <Text style={{ fontSize: 16 }}>Filter</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        {props.isLoadingConnections ? (
                            <Loader />
                        ) : (
                            SearchedConnections
              && SearchedConnections.map((connection, index) => {
                  return (
                      <CaseList
                          pressed={() => {
                              props.navigation.navigate('ConnectionsView', {
                                  connectionData: connection,
                                  childName: caseData.full_name,
                              });
                              setIsScrolling(false);
                          }}
                          key={index}
                          connection={connection}
                      />
                  );
              })
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
                            height: Platform.OS == 'android' ? 20 : 52,
                            justifyContent: 'center',
                        }}
                    >

                    </View>
                    <TouchableOpacity
                        underlayColor="lightgray"
                        onPressIn={() => {
                            setDescriptionVisible(false);
                        }}
                    >
                        <Text
                            style={{
                                padding: 10,
                                fontSize: 18,
                                paddingBottom: Platform.OS === 'android' ? -20 : 0,
                                color: '#0F6580',
                                marginTop: Platform.OS === 'android' ? -37 : 0,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: Platform.OS === 'android' ? 45 : 20,
                                    margin: Platform.OS === 'android' ? -2 : 0,
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

                    >

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
                                    fontFamily: constants.lotoFamily,
                                    color: 'rgba(24, 23, 21, 0.5)',
                                    marginLeft: 10,
                                    marginTop: Platform.OS === 'android' ? 0 : 20,
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
                                    borderBottomColor: 'rgba(24, 23, 21, 0.3)',
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
                                    checked={filtersSelected[0] ? true : false}
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
                                    checked={filtersSelected[2] ? true : false}
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
                                    checked={filtersSelected[4] ? true : false}
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
                                    checked={filtersSelected[5] ? true : false}
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
                                    checked={filtersSelected[1] ? true : false}
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
                                    checked={filtersSelected[3] ? true : false}
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
                SORT BY
                            </Text>
                            <View
                                style={{
                                    borderBottomColor: 'rgba(24, 23, 21, 0.3)',
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
                                    status={sort === 'Full Name' ? 'checked' : 'unchecked'}
                                    color="#0279ac"
                                    checked={filtersSelected.name}
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
                                <Text style={styles.checkboxes}> Full Name</Text>
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
                                    status={sort === 'Last Name' ? 'checked' : 'unchecked'}
                                    color="#0279ac"
                                    checked={filtersSelected.last}
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
                                <Text style={styles.checkboxes}> Last Name</Text>
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
                                    checked={filtersSelected.created}
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
                                <Text style={styles.checkboxes}> Date Created</Text>
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
                                    status={sort === 'Last Updated' ? 'checked' : 'unchecked'}
                                    color="#0279ac"
                                    checked={filtersSelected.updated}
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
                                <Text style={styles.checkboxes}> Last Updated</Text>
                                <View />
                            </View>
                        </View>
                    </ScrollView>
                </Modal>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    tabs: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },

    selected: {
        backgroundColor: constants.highlightColor,
        color: 'white',
        borderWidth: 1,
        borderColor: constants.highlightColor,
        borderRadius: 4,
        overflow: 'hidden',
    },

    tab: {
        padding: 10,
        fontSize: 16,
    },
    searchBar: {
        marginHorizontal: Platform.OS === 'ios' ? 5 : 5,
        width: '75%',
        backgroundColor: Platform.OS === 'ios' ? 'white' : 'white',
    },
    imageStyles: { width: 225, height: 90 },
    iconStyles: { fontSize: 40, color: '#000', paddingRight: 20 },
    filters: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
    },
    filter: {
        height: 26,
        width: 26,
        borderRadius: 13,
        overflow: 'hidden',
        marginLeft: 10,
        marginRight: 10,
    },
    descriptionModalItems: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
    },
    checkboxes: {
        fontSize: 18,
        fontWeight: 'normal',
    },
});

const mapStateToProps = (state) => {
    const { caseData, isLoadingCaseData, caseDataError } = state.caseData;
    const {
        caseConnections,
        isLoadingConnections,
        connectionsError,
    } = state.caseConnections;
    const details = state.details;
    return {
        caseData,
        isLoadingCaseData,
        isLoadingConnections,
        caseDataError,
        connectionsError,
        caseConnections,
        details,
    };
};

export default connect(mapStateToProps, {
    getCaseData,
    clearCaseData,
    getCaseConnections,
    clearCaseConnections,
})(CaseViewScreen);
