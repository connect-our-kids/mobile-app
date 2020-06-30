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
    ListRenderItemInfo,
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
    caseDetailFull_engagements,
} from '../generated/caseDetailFull';
import { RelationshipScreenParams } from './RelationshipScreen';
import constants from '../helpers/constants';
import ConnectionsLogin from '../components/auth/ConnectionsLogin';
import { AuthState } from '../store/reducers/authReducer';
import { createPersonSubtitle } from '../helpers/personSubtitle';
import moment from 'moment';
import { useMutation } from '@apollo/react-hooks';
import {
    DELETE_RELATIONSHIP_MUTATION,
    deleteRelationshipCache,
} from '../store/actions/fragments/cases';
import { SwipeListView } from 'react-native-swipe-list-view';
import { GenericModal } from '../components/modals/GenericModal';
import { BusyModal } from '../components/modals/BusyModal';
import {
    deleteRelationshipMutation,
    deleteRelationshipMutationVariables,
} from '../generated/deleteRelationshipMutation';
import { Roles } from '../generated/globalTypes';

interface StateProps {
    caseId: number;
    case?: caseDetailFull;
    isLoadingCase: boolean;
    caseError?: string;
    auth: AuthState;
    genders: string[];
    hasDeletePermission: boolean;
}

interface DispatchProps {
    getCase: typeof getCase;
    clearCase: typeof clearCase;
}

type Navigation = NavigationScreenProp<NavigationState>;

interface OwnProps {
    navigation: Navigation;
}

interface GenderFilter {
    [key: string]: boolean;
}

type Props = StateProps & DispatchProps & OwnProps;

let relationshipsListViewRef: SwipeListView<
    caseDetailFull_relationships
> | null = null;

let relationshipsListViewRef2: SwipeListView<
    caseDetailFull_relationships
> | null = null;

const DetailsView = (props: { case?: caseDetailFull }): JSX.Element =>
    props.case?.details ? (
        <ListItem
            title={props.case.details?.person.fullName}
            titleStyle={{ fontSize: 18 }}
            subtitle={
                <View>
                    <Text style={{ color: '#434245' }}>
                        {createPersonSubtitle(props.case.details.person)}
                    </Text>
                    {props.case.details.person.addresses?.length > 0 &&
                    props.case.details?.person.addresses[0].raw &&
                    (props.case.details.person.addresses[0].locality ||
                        props.case.details.person.addresses[0].state) ? (
                        <Text style={{ color: '#434245' }}>
                            {`${props.case.details.person.addresses[0].locality}, ${props.case.details.person.addresses[0].state}`}
                        </Text>
                    ) : null}
                    {props.case.details.fosterCare ? (
                        <Text style={{ color: '#434245' }}>
                            {`Case started ${moment.utc().from(
                                props.case.details.fosterCare,

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
                                uri: props.case.details.person.picture,
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
    ) : (
        <></>
    );

const createDeleteMessage = (
    relationship: caseDetailFull_relationships,
    engagements: caseDetailFull_engagements[]
): string => {
    let message = `Are you sure you want to delete ${relationship.person.fullName}?`;
    const numRelevantEngagements = engagements.filter(
        (engagement) => relationship.id === engagement.relationship?.id
    ).length;
    if (numRelevantEngagements === 1) {
        message += `\n\nThis will delete 1 engagement`;
    } else if (numRelevantEngagements > 1) {
        message += `\n\nThis will delete ${numRelevantEngagements} engagements`;
    }
    message += '\n\nThis action cannot be undone.';
    return message;
};

const CaseScreen = (props: Props) => {
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [, setIsScrolling] = useState(false);
    const [sort, setSort] = useState('Full Name');
    const [searchKeywords, setSearchKeywords] = useState('');
    const [filtersSelected, setFiltersSelected] = useState({
        0: true,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true, //fullname
        7: false, //lastName
        8: false, // createdAt
        9: false, //updatedAt
        10: false, //Date of Birth - unused
    });

    const [isListScrolled, setIsListScrolled] = useState(false);

    const [deleteRelationshipState, setDeleteRelationshipState] = useState<
        | {
              state: 'confirm';
              relationship: caseDetailFull_relationships;
          }
        | {
              state: 'delete';
              relationship: caseDetailFull_relationships;
          }
        | {
              state: 'error';
              error: string;
          }
        | undefined
    >(undefined);

    const [deleteRelationshipGraphQL, { loading }] = useMutation<
        deleteRelationshipMutation,
        deleteRelationshipMutationVariables
    >(DELETE_RELATIONSHIP_MUTATION, {
        errorPolicy: 'all',
        onCompleted: () => {
            setDeleteRelationshipState(undefined);
        },
        onError: (error) => {
            setDeleteRelationshipState({
                state: 'error',
                error: error.message ?? 'Unknown error',
            });
        },
    });

    const performDeleteRelationship = (
        caseId: number,
        relationship: caseDetailFull_relationships
    ) => {
        deleteRelationshipGraphQL({
            variables: {
                caseId,
                relationshipId: relationship.id,
            },
            update: (cache) => {
                deleteRelationshipCache({
                    caseId,
                    relationshipId: relationship.id,
                    cache,
                });
            },
        });
    };

    const [rtn, setRtn] = useState('RETURN');

    // load once to get all case data
    useEffect(() => {
        props.getCase(props.caseId);
        Platform.OS === 'android' ? setRtn('') : null;
    }, []);

    const handleKeywordChange = (e: string) => {
        setSearchKeywords(e);
    };

    const createDefaultGenderFilter = () =>
        props.genders.reduce((result, item) => {
            result[item] = true;
            return result;
        }, {} as GenderFilter);

    // gender filter
    const [genderFilters, setGenderFilters] = useState(
        createDefaultGenderFilter()
    );

    // any time the genders change, we need to update the gender filter
    useEffect(() => {
        setGenderFilters(createDefaultGenderFilter());
    }, [props.genders]);

    /* const shouldShowRemoveFilterBanner = (): boolean => {
        return !(
            Object.values(genderFilters).every((value) => value === true) &&
            sort === 'First Name'
        );
    };*/

    function filterGenders(
        cases: caseDetailFull_relationships[]
    ): caseDetailFull_relationships[] {
        // filter cases based on gender
        return cases.filter((value) => {
            const gender = value.person.gender
                ? value.person.gender
                : 'Unspecified';

            if (!props.genders.includes(gender)) {
                console.warn(
                    `Gender of '${gender}' for case id ${value.id} not in list of schema genders`
                );
                // include this case
                return true;
            } else {
                return genderFilters[gender];
            }
        });
    }

    // SORT functionality
    function sorter(arr: caseDetailFull_relationships[]) {
        const sorted = arr;
        if (filtersSelected[6]) {
            const sorted = arr.sort(function (
                a: caseDetailFull_relationships,
                b: caseDetailFull_relationships
            ) {
                if (a.person.fullName < b.person.fullName) {
                    return -1;
                }
                if (a.person.fullName > b.person.fullName) {
                    return 1;
                }
                return 0;
            });
            return sorted;
        }
        if (filtersSelected[7]) {
            const sorted = arr.sort(function (
                a: caseDetailFull_relationships,
                b: caseDetailFull_relationships
            ) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (a.person.lastName < b.person.lastName) {
                    return -1;
                }
                if (a.person.lastName === null) {
                    return 1;
                }
                if (b.person.lastName === null) {
                    return -1;
                }
                if (a.person.lastName > b.person.lastName) {
                    return 1;
                }
                return 0;
            });
            return sorted;
        }
        if (filtersSelected[8]) {
            const sorted = arr.sort(function (a, b) {
                if (a.person.createdAt < b.person.createdAt) {
                    return -1;
                }
                if (a.person.createdAt > b.person.createdAt) {
                    return 1;
                }
                return 0;
            });
            return sorted;
        }
        if (filtersSelected[9]) {
            const sorted = arr.sort(function (a, b) {
                if (a.person.updatedAt < b.person.updatedAt) {
                    return -1;
                }
                if (a.person.updatedAt > b.person.updatedAt) {
                    return 1;
                }
                return 0;
            });
            return sorted;
        }
        return sorted;
    }
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
            // return genderFilter(caseToFilter.relationships);
            const preSorted = filterGenders(caseToFilter.relationships);
            const sorted = sorter(preSorted);
            return sorted;
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

            const preSorted = filterGenders(filteredList);
            const sorted = sorter(preSorted);
            return sorted;
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
        searchBarRow: {
            width: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            flexDirection: 'row',
            borderBottomWidth: 0.5,
            borderBottomColor: '#babab9',
        },
        searchBar: {
            marginRight: 5,
            marginLeft: 5,
            flexGrow: 1,
            width: 1,
            backgroundColor: 'white',
        },
        filterButton: {
            width: 70,
            marginVertical: 20,
            maxHeight: 40,
            marginRight: 10,
        },
        checkboxes: {
            fontSize: 18,
            fontWeight: 'normal',
        },
        backTextWhite: {
            color: '#FFF',
        },
        rowBack: {
            backgroundColor: '#0279AC',
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignContent: 'flex-end',
        },
        swipeDeleteButton: {
            alignItems: 'center',
            bottom: 0,
            justifyContent: 'center',
            top: 0,
            width: 75,
            backgroundColor: 'red',
            right: 0,
        },
        swipeEditButton: {
            alignItems: 'center',
            bottom: 0,
            justifyContent: 'center',
            top: 0,
            width: 75,
            backgroundColor: '#0279AC',
            right: 0,
        },
    });

    const FilterModal = (): JSX.Element => (
        <Modal
            animationType="fade"
            transparent={false}
            visible={filterModalVisible}
            onRequestClose={() => setFilterModalVisible(false)}
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
                    setFilterModalVisible(false);
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
                    <TouchableOpacity
                        onPress={() =>
                            setFiltersSelected({
                                ...filtersSelected,
                                0: !filtersSelected[0],
                            })
                        }
                    >
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
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>
                            setFiltersSelected({
                                ...filtersSelected,
                                2: !filtersSelected[2],
                            })
                        }
                    >
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
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>
                            setFiltersSelected({
                                ...filtersSelected,
                                4: !filtersSelected[4],
                            })
                        }
                    >
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
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>
                            setFiltersSelected({
                                ...filtersSelected,
                                5: !filtersSelected[5],
                            })
                        }
                    >
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
                                    backgroundColor: 'royalblue',
                                    width: 25,
                                    height: 25,
                                    marginRight: 20,
                                    borderWidth: 1,
                                    borderColor: '#fff',
                                    borderRadius: 100,
                                }}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>
                            setFiltersSelected({
                                ...filtersSelected,
                                1: !filtersSelected[1],
                            })
                        }
                    >
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
                                    backgroundColor: 'green',
                                    width: 25,
                                    height: 25,
                                    marginRight: 20,
                                    borderWidth: 1,
                                    borderColor: '#fff',
                                    borderRadius: 100,
                                }}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>
                            setFiltersSelected({
                                ...filtersSelected,
                                3: !filtersSelected[3],
                            })
                        }
                    >
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
                    </TouchableOpacity>
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
                            borderBottomColor: 'rgba(24, 23, 21, 0.3)',
                            borderBottomWidth: 0.5,
                            marginBottom: 10,
                            marginHorizontal: 10,
                        }}
                    ></View>
                    {props.genders.map((gender) => (
                        <CheckBox
                            containerStyle={{
                                backgroundColor: 'white',
                                borderColor: 'white',
                            }}
                            title={`${gender} (${
                                props.case?.relationships.filter((value) => {
                                    const caseGender = value.person.gender
                                        ? value.person.gender
                                        : 'Unspecified';

                                    return caseGender === gender;
                                }).length
                            })`}
                            textStyle={{ ...styles.checkboxes }}
                            size={30}
                            checked={genderFilters[gender]}
                            key={gender}
                            checkedColor="#0279ac"
                            onPress={() => {
                                const updatedGenderFilters = {
                                    ...genderFilters,
                                };
                                updatedGenderFilters[gender] = !genderFilters[
                                    gender
                                ];
                                setGenderFilters(updatedGenderFilters);
                            }}
                        />
                    ))}
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
                            borderBottomColor: 'rgba(24, 23, 21, 0.3)',
                            borderBottomWidth: 0.5,
                            marginBottom: 10,
                            marginHorizontal: 10,
                        }}
                    ></View>
                    <TouchableOpacity
                        onPress={() => {
                            setSort('Full Name');
                            setFiltersSelected({
                                ...filtersSelected,
                                6: !filtersSelected[6],
                                7: false,
                                8: false,
                                9: false,
                                10: false,
                            });
                        }}
                    >
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
                                        6: !filtersSelected[6],
                                        7: false,
                                        8: false,
                                        9: false,
                                        10: false,
                                    });
                                }}
                            />
                            <Text style={styles.checkboxes}> Full Name</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setSort('Last Name');
                            setFiltersSelected({
                                ...filtersSelected,
                                6: false,
                                7: !filtersSelected[7],
                                8: false,
                                9: false,
                                10: false,
                            });
                        }}
                    >
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
                                        6: false,
                                        7: !filtersSelected[7],
                                        8: false,
                                        9: false,
                                        10: false,
                                    });
                                }}
                            />
                            <Text style={styles.checkboxes}> Last Name</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setSort('Date Created');
                            setFiltersSelected({
                                ...filtersSelected,
                                6: false,
                                7: false,
                                8: !filtersSelected[8],
                                9: false,
                                10: false,
                            });
                        }}
                    >
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
                                        6: false,
                                        7: false,
                                        8: !filtersSelected[8],
                                        9: false,
                                        10: false,
                                    });
                                }}
                            />
                            <Text style={styles.checkboxes}> Date Created</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setSort('Last Updated');
                            setFiltersSelected({
                                ...filtersSelected,
                                6: false,
                                7: false,
                                8: false,
                                9: !filtersSelected[9],
                                10: false,
                            });
                        }}
                    >
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
                                        6: false,
                                        7: false,
                                        8: false,
                                        9: !filtersSelected[9],
                                        10: false,
                                    });
                                }}
                            />
                            <Text style={styles.checkboxes}> Last Updated</Text>
                            <View />
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Modal>
    );

    const renderRelationship = (
        itemInfo: ListRenderItemInfo<caseDetailFull_relationships>
    ) => (
        <RelationshipListItem
            pressed={() => {
                const params: RelationshipScreenParams = {
                    relationshipId: itemInfo.item.id,
                };
                props.navigation.navigate('RelationshipScreen', { ...params });
                setIsScrolling(false);
            }}
            key={itemInfo.index}
            relationship={itemInfo.item}
        />
    );

    const renderSwipeButtons = (
        itemInfo: ListRenderItemInfo<caseDetailFull_relationships>
    ) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={styles.swipeEditButton}
                onPress={() => {
                    try {
                        relationshipsListViewRef2?.closeAllOpenRows();
                    } catch (error) {
                        console.log(
                            `Error when trying to close open rows: ${error}`
                        );
                    }
                    props.navigation.navigate('AddRelationshipScreen', {
                        caseId: props.caseId,
                        teamId: props.case?.details?.teamId,
                        relationshipId: itemInfo.item.id,
                    });
                }}
            >
                <Text style={styles.backTextWhite}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.swipeDeleteButton}
                activeOpacity={0.9}
                onPress={() => {
                    setDeleteRelationshipState({
                        state: 'confirm',
                        relationship: itemInfo.item,
                    });
                }}
            >
                <Text style={styles.backTextWhite}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    if (!props.auth.isLoggedIn) {
        return <ConnectionsLogin />;
    }

    return (
        <View
            style={{
                backgroundColor: constants.backgroundColor,
                flex: 1,
                flexDirection: 'column',
            }}
        >
            {props.isLoadingCase ? (
                <Loader />
            ) : props.caseError ? (
                <Text>props.caseError</Text>
            ) : props.case?.details ? (
                <>
                    <DetailsView {...props} />

                    <View style={styles.searchBarRow}>
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
                        <View style={styles.filterButton}>
                            <TouchableHighlight
                                onPressIn={() => {
                                    setFilterModalVisible(true);
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
                                    <Text style={{ fontSize: 16 }}>Filter</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>

                    {searchedConnections.length > 0 ? (
                        <SwipeListView
                            disableRightSwipe
                            data={searchedConnections}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderRelationship}
                            renderHiddenItem={renderSwipeButtons}
                            rightOpenValue={-150}
                            listViewRef={(ref) => {
                                relationshipsListViewRef = ref;
                            }}
                            ref={(ref) => {
                                relationshipsListViewRef2 = ref;
                            }}
                            style={{ flex: 1 }}
                            onScroll={(scrollingEvent): void => {
                                setIsListScrolled(
                                    scrollingEvent.nativeEvent.contentOffset.y >
                                        0
                                );
                            }}
                            onScrollToTop={(): void => {
                                setIsListScrolled(false);
                            }}
                            scrollEventThrottle={5}
                        />
                    ) : (
                        <Text
                            style={{
                                width: '100%',
                                textAlign: 'center',
                                marginTop: 50,
                            }}
                        >
                            This case does not contain any relationships.
                        </Text>
                    )}
                    {isListScrolled && (
                        <ScrollToTop
                            style={{
                                position: 'absolute',
                                zIndex: 1000,
                                bottom: 10,
                                right: 38,
                                backgroundColor: 'white',
                                padding: 8,
                                borderRadius: 35,
                            }}
                            onPress={(): void => {
                                // Problem with typings for library
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                relationshipsListViewRef?.scrollToOffset({
                                    x: 0,
                                    y: 0,
                                    animated: true,
                                });
                            }}
                        />
                    )}
                    <FilterModal />
                </>
            ) : (
                <Text>Unable to load case</Text>
            )}

            {deleteRelationshipState?.state === 'confirm' ? (
                props.hasDeletePermission ? (
                    <GenericModal
                        title={`Delete ${deleteRelationshipState.relationship.person.fullName}?`}
                        message={createDeleteMessage(
                            deleteRelationshipState.relationship,
                            props.case?.engagements ?? []
                        )}
                        animationType="fade"
                        leftButtonText="Cancel"
                        rightButtonText="Delete"
                        isRightButtonRed={true}
                        onLeftButton={() => {
                            try {
                                relationshipsListViewRef2?.closeAllOpenRows();
                            } catch (error) {
                                console.log(
                                    `Error when trying to close open rows: ${error}`
                                );
                            }
                            setDeleteRelationshipState(undefined);
                        }}
                        onRightButton={() => {
                            if (props.case?.details) {
                                performDeleteRelationship(
                                    props.case.details.id,
                                    deleteRelationshipState.relationship
                                );
                                setDeleteRelationshipState({
                                    state: 'delete',
                                    relationship:
                                        deleteRelationshipState.relationship,
                                });
                            }
                        }}
                    />
                ) : (
                    <GenericModal
                        message={`You do not have permission to delete from this case.`}
                        animationType="fade"
                        rightButtonText="OK"
                        onRightButton={() => {
                            try {
                                relationshipsListViewRef2?.closeAllOpenRows();
                            } catch (error) {
                                console.log(
                                    `Error when trying to close open rows: ${error}`
                                );
                            }
                            setDeleteRelationshipState(undefined);
                        }}
                    />
                )
            ) : null}
            {deleteRelationshipState?.state === 'error' ? (
                <GenericModal
                    message={deleteRelationshipState.error}
                    rightButtonText="OK"
                    onRightButton={() => {
                        try {
                            relationshipsListViewRef2?.closeAllOpenRows();
                        } catch (error) {
                            console.log(
                                `Error when trying to close open rows: ${error}`
                            );
                        }
                        setDeleteRelationshipState(undefined);
                    }}
                />
            ) : null}
            <BusyModal
                message="Deleting"
                animationType="none"
                visible={loading}
            />
        </View>
    );
};

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
    let genders = state.schema.results?.schema?.gender ?? [];
    // remove empty strings. The backend should do this in the future
    genders = genders.filter((gender) => gender);

    const relevantCaseRole =
        state.me.results?.caseRoles.find(
            (role) => role.caseId === state.case.results?.details?.id
        )?.role ?? Roles.NONE;

    const relevantTeamRole =
        state.me.results?.userTeams.find(
            (team) => team.id === state.case.results?.details?.teamId
        )?.role ?? Roles.NONE;
    const hasDeletePermission =
        state.me.results?.isSiteAdmin ||
        relevantTeamRole === Roles.EDITOR ||
        relevantTeamRole === Roles.MANAGER ||
        relevantCaseRole === Roles.EDITOR ||
        relevantCaseRole === Roles.MANAGER;

    return {
        caseId: ownProps.navigation.getParam('pk') as number,
        case: state.case.results,
        isLoadingCase: state.case.isLoading,
        caseError: state.case.error,
        auth: state.auth,
        genders,
        hasDeletePermission,
    };
};

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, {
    getCase,
    clearCase,
})(CaseScreen);
