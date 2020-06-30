import React, { useState, useEffect } from 'react';

// RN component imports
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Modal,
    ScrollView,
    Platform,
    TouchableHighlight,
    TouchableOpacity,
    ListRenderItemInfo,
} from 'react-native';

import { ListItem, Image, SearchBar, CheckBox } from 'react-native-elements';

// redux
import { connect } from 'react-redux';

import { getCases, login } from '../store/actions';

// constants = like a config variable
import constants from '../helpers/constants';

import ConnectionsLogin from '../components/auth/ConnectionsLogin';
import Loader from '../components/Loader';

// 3rd party imports like icons & scroll functionality
import ScrollToTop from '../components/family-connections/ScrollToTop/ScrollToTop';
import { MaterialIcons } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';

// placeholder image for non-logged in users?
import placeholderImg from '../../assets/profile_placeholder.png';
import { RootState } from '../store/reducers';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { casesDetailSlim_cases } from '../generated/casesDetailSlim';
import { AuthState } from '../store/reducers/authReducer';
import { UserFullFragment_userTeams } from '../generated/UserFullFragment';
import { createPersonSubtitle } from '../helpers/personSubtitle';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useMutation } from '@apollo/react-hooks';
import { BusyModal } from '../components/modals/BusyModal';
import { GenericModal } from '../components/modals/GenericModal';
import { Roles } from '../generated/globalTypes';
import {
    DELETE_CASE_MUTATION,
    deleteCaseFromCache,
} from '../store/actions/fragments/cases';
import {
    deleteCaseMutation,
    deleteCaseMutationVariables,
} from '../generated/deleteCaseMutation';
import { DeleteCaseModal } from '../components/modals/DeleteCaseModal';
// unicode arrow
const leftArrow = '\u2190';

interface StateProps {
    auth: AuthState;
    cases: casesDetailSlim_cases[];
    isLoadingCases: boolean;
    casesError?: string;
    teams?: UserFullFragment_userTeams[];
    genders: string[];
    hasDeletePermission: boolean;
}

interface DispatchProps {
    getCases: typeof getCases;
    login: typeof login;
}

type Navigation = NavigationScreenProp<NavigationState>;

interface OwnProps {
    navigation: Navigation;
}

interface GenderFilter {
    [key: string]: boolean;
}

type Props = StateProps & DispatchProps & OwnProps;

let listViewRef: SwipeListView<casesDetailSlim_cases> | null = null;
let listViewRef2: SwipeListView<casesDetailSlim_cases> | null = null;

const FamilyConnectionsScreen = (props: Props): JSX.Element => {
    const styles = StyleSheet.create({
        safeAreaView: {
            backgroundColor: constants.backgroundColor,
            width: '100%',
            flex: 1,
        },
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

    const [modalVisible, setModalVisible] = useState(false);
    const [searchKeywords, setSearchKeywords] = useState('');
    const [, setIsScrolling] = useState(false); // used to show "scroll to top" buttons; look into RN component that does this?
    const [sort, setSort] = useState<
        'First Name' | 'Last Name' | 'Created' | 'Updated'
    >('First Name'); // sort results of Family Connections, can be changed to several other values
    const [rtn, setRtn] = useState('RETURN'); // MIGHT display "RETURN" next to a return arrow in iOS modals; also exists in the CaseView component

    const [isListScrolled, setIsListScrolled] = useState(false);

    const [deleteCaseState, setDeleteCaseState] = useState<
        | {
              state: 'confirm';
              case: casesDetailSlim_cases;
          }
        | {
              state: 'delete';
              case: casesDetailSlim_cases;
          }
        | {
              state: 'error';
              error: string;
          }
        | undefined
    >(undefined);

    const [deleteCaseGraphQL, { loading }] = useMutation<
        deleteCaseMutation,
        deleteCaseMutationVariables
    >(DELETE_CASE_MUTATION, {
        errorPolicy: 'all',
        onCompleted: () => {
            setDeleteCaseState(undefined);
        },
        onError: (error) => {
            setDeleteCaseState({
                state: 'error',
                error: error.message ?? 'Unknown error',
            });
        },
    });

    const performDeleteCase = (caseId: number) => {
        deleteCaseGraphQL({
            variables: {
                caseId,
            },
            update: (cache) => {
                deleteCaseFromCache({
                    caseId,
                    cache,
                });
            },
        });
    };

    // run this once
    useEffect(() => {
        Platform.OS === 'android' ? setRtn('') : null; // if Android, display no "RETURN" text, otherwise do nothing => probs better written as Platform.OS === 'android' && setRtn('')
    }, []);

    const [casesLoaded, setCasesLoaded] = useState(false); // used to show "scroll to top" buttons; look into RN component that does this?

    // run any time the logged in status changes
    useEffect(() => {
        if (
            props.auth.isLoggedIn &&
            !props.auth.isLoggingIn &&
            props.genders.length > 0 &&
            props.teams?.length &&
            !props.isLoadingCases &&
            !casesLoaded
        ) {
            props.getCases();
            setCasesLoaded(true);
        }
    }, [
        props.auth.isLoggedIn,
        props.auth.isLoggingIn,
        props.genders,
        props.teams,
        props.isLoadingCases,
    ]);

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

    const shouldShowRemoveFilterBanner = (): boolean => {
        return !(
            Object.values(genderFilters).every((value) => value === true) &&
            sort === 'First Name'
        );
    };

    function filterGenders(
        cases: casesDetailSlim_cases[]
    ): casesDetailSlim_cases[] {
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

    const filteredCases = filterGenders(props.cases);

    if (sort === 'Last Name') {
        filteredCases.sort((a, b) => {
            const aLastName = a.person.lastName || '';
            const bLastName = b.person.lastName || '';
            return aLastName.localeCompare(bLastName, undefined, {
                sensitivity: 'accent',
            });
        });
    } else if (sort === 'Created') {
        // TODO
        filteredCases.sort((a, b) =>
            a.person.createdAt.localeCompare(b.person.createdAt)
        );
    } else if (sort === 'Updated') {
        filteredCases.sort((a, b) =>
            a.person.updatedAt.localeCompare(b.person.updatedAt)
        );
    } else {
        // default. sort by first name
        filteredCases.sort((a, b) =>
            a.person.fullName.localeCompare(b.person.fullName, undefined, {
                sensitivity: 'accent',
            })
        );
    }

    // ------SEARCH BAR functionality - filters by case first_name or last_name---------
    const searchedCases = filteredCases.filter((result) => {
        // TODO search other fields in the case as well
        return (
            result.person.firstName
                ?.toLowerCase()
                .indexOf(searchKeywords.toLowerCase()) !== -1
        );
    });

    const renderCase = (
        itemInfo: ListRenderItemInfo<casesDetailSlim_cases>
    ) => (
        <View>
            <ListItem
                key={itemInfo.index}
                title={itemInfo.item.person.fullName}
                titleStyle={{ color: '#5A6064' }}
                subtitle={createPersonSubtitle(itemInfo.item.person)}
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
                                itemInfo.item.person.picture
                                    ? {
                                          uri: itemInfo.item.person.picture,
                                      }
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
                topDivider={true}
                onPress={() => {
                    props.navigation.navigate('CaseView', {
                        pk: itemInfo.item.id,
                    });
                    setIsScrolling(false);
                }}
            />
        </View>
    );

    const renderSwipeButtons = (
        itemInfo: ListRenderItemInfo<casesDetailSlim_cases>
    ) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={styles.swipeEditButton}
                onPress={() => {
                    try {
                        listViewRef2?.closeAllOpenRows();
                    } catch (error) {
                        console.log(
                            `Error when trying to close open rows: ${error}`
                        );
                    }
                    props.navigation.navigate('AddCaseScreen', {
                        pk: itemInfo.item.id,
                    });
                }}
            >
                <Text style={styles.backTextWhite}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.swipeDeleteButton}
                activeOpacity={0.9}
                onPress={() => {
                    setDeleteCaseState({
                        state: 'confirm',
                        case: itemInfo.item,
                    });
                }}
            >
                <Text style={styles.backTextWhite}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    return !props.auth.isLoggedIn || !props.teams?.length ? (
        <ConnectionsLogin />
    ) : props.isLoadingCases || props.genders.length === 0 ? (
        <SafeAreaView style={{ ...styles.safeAreaView }}>
            <Loader />
        </SafeAreaView>
    ) : props.casesError ? (
        <Text>{props.casesError}</Text>
    ) : (
        <View style={{ ...styles.safeAreaView }}>
            <View style={styles.searchBarRow}>
                <SearchBar
                    inputStyle={{ fontSize: 16 }}
                    inputContainerStyle={{
                        backgroundColor: '#FAFAFA',
                        height: 45.62,
                    }}
                    placeholder="Search Cases"
                    placeholderTextColor="#8D8383"
                    cancelButtonProps={{
                        buttonTextStyle: { color: 'rgb(8,121,169)' },
                    }}
                    // lightTheme
                    round
                    value={searchKeywords}
                    onChangeText={(event) => setSearchKeywords(event)}
                    // create searchbar target platform.os
                    platform="ios"
                    containerStyle={styles.searchBar}
                />
                <View style={styles.filterButton}>
                    <TouchableHighlight
                        onPressIn={() => {
                            setModalVisible(true);
                        }}
                    >
                        <View
                            style={{
                                alignItems: 'center',
                                flexDirection: 'row',
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

            <Modal
                animationType="fade"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View
                    style={{
                        backgroundColor: '#fff',
                        justifyContent: 'center',
                        height: Platform.OS === 'android' ? 20 : 52,
                    }}
                ></View>

                <TouchableOpacity
                    onPressIn={() => {
                        setModalVisible(!modalVisible);
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
                        >
                            {leftArrow}
                        </Text>
                        <Text> {rtn}</Text>
                    </Text>
                </TouchableOpacity>
                <ScrollView scrollsToTop contentContainerStyle={{}}>
                    <ScrollView
                        scrollsToTop
                        contentContainerStyle={{}}
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
                                status={
                                    sort === 'First Name'
                                        ? 'checked'
                                        : 'unchecked'
                                }
                                color="#0279ac"
                                onPress={() => {
                                    setSort('First Name');
                                }}
                            />
                            <Text
                                style={styles.checkboxes}
                                onPress={() => {
                                    setSort('First Name');
                                }}
                            >
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
                                }}
                            />
                            <Text
                                style={styles.checkboxes}
                                onPress={() => {
                                    setSort('Last Name');
                                }}
                            >
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
                                    sort === 'Created' ? 'checked' : 'unchecked'
                                }
                                color="#0279ac"
                                onPress={() => {
                                    setSort('Created');
                                }}
                            />
                            <Text
                                style={styles.checkboxes}
                                onPress={() => {
                                    setSort('Created');
                                }}
                            >
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
                            }}
                        >
                            <RadioButton
                                value="Last Updated"
                                status={
                                    sort === 'Updated' ? 'checked' : 'unchecked'
                                }
                                color="#0279ac"
                                onPress={() => {
                                    setSort('Updated');
                                }}
                            />
                            <Text
                                style={styles.checkboxes}
                                onPress={() => {
                                    setSort('Updated');
                                }}
                            >
                                {' '}
                                Last Updated
                            </Text>
                        </View>
                        {/* GENDER */}
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
                        />

                        {props.genders.map((gender) => (
                            <CheckBox
                                containerStyle={{
                                    backgroundColor: 'white',
                                    borderColor: 'white',
                                }}
                                title={`${gender} (${
                                    props.cases.filter((value) => {
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
                                    updatedGenderFilters[
                                        gender
                                    ] = !genderFilters[gender];
                                    setGenderFilters(updatedGenderFilters);
                                }}
                            />
                        ))}
                    </View>
                </ScrollView>
                <View
                    style={{
                        alignContent: 'center' as const,
                        alignSelf: 'center' as const,
                        width: 100,
                    }}
                ></View>
            </Modal>

            {props.cases.length === 0 && (
                <Text
                    style={{
                        width: '100%',
                        textAlign: 'center',
                        marginTop: 50,
                    }}
                >
                    No cases. Use the Add Case button to create a case.
                </Text>
            )}

            <TouchableOpacity
                onPressIn={() => {
                    setSort('First Name');
                    setGenderFilters(createDefaultGenderFilter());
                }}
            >
                <Text
                    style={{
                        backgroundColor: '#e8e8e8',
                        color: '#0279AC',
                        height: 50,
                        fontSize: 25,
                        textAlign: 'center',
                        paddingTop: 8,
                        display: shouldShowRemoveFilterBanner()
                            ? undefined
                            : 'none',
                    }}
                >
                    Remove filters
                </Text>
            </TouchableOpacity>

            {searchedCases.length > 0 && (
                <SwipeListView
                    disableRightSwipe
                    data={searchedCases}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderCase}
                    renderHiddenItem={renderSwipeButtons}
                    rightOpenValue={-150}
                    listViewRef={(ref) => {
                        listViewRef = ref;
                    }}
                    ref={(ref) => {
                        listViewRef2 = ref;
                    }}
                    style={{ flex: 1 }}
                    onScroll={(scrollingEvent): void => {
                        setIsListScrolled(
                            scrollingEvent.nativeEvent.contentOffset.y > 0
                        );
                    }}
                    onScrollToTop={(): void => {
                        setIsListScrolled(false);
                    }}
                    scrollEventThrottle={5}
                />
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
                        listViewRef?.scrollToOffset({
                            x: 0,
                            y: 0,
                            animated: true,
                        });
                    }}
                />
            )}
            {deleteCaseState?.state === 'confirm' ? (
                props.hasDeletePermission ? (
                    <DeleteCaseModal
                        caseName={deleteCaseState.case.person.fullName}
                        onCancel={() => {
                            try {
                                listViewRef2?.closeAllOpenRows();
                            } catch (error) {
                                console.log(
                                    `Error when trying to close open rows: ${error}`
                                );
                            }
                            setDeleteCaseState(undefined);
                        }}
                        onDelete={() => {
                            performDeleteCase(deleteCaseState.case.id);
                            setDeleteCaseState({
                                state: 'delete',
                                case: deleteCaseState.case,
                            });
                        }}
                    />
                ) : (
                    <GenericModal
                        message={`You do not have permission to delete this case.`}
                        animationType="fade"
                        rightButtonText="OK"
                        onRightButton={() => {
                            try {
                                listViewRef2?.closeAllOpenRows();
                            } catch (error) {
                                console.log(
                                    `Error when trying to close open rows: ${error}`
                                );
                            }
                            setDeleteCaseState(undefined);
                        }}
                    />
                )
            ) : null}
            {deleteCaseState?.state === 'error' ? (
                <GenericModal
                    message={deleteCaseState.error}
                    rightButtonText="OK"
                    onRightButton={() => {
                        try {
                            listViewRef2?.closeAllOpenRows();
                        } catch (error) {
                            console.log(
                                `Error when trying to close open rows: ${error}`
                            );
                        }
                        setDeleteCaseState(undefined);
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
}; // end of FamilyConnectionsScreen

const mapStateToProps = (state: RootState) => {
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
        cases: state.cases.results ?? [], // TODO this is a temporary fie. state.cases.results should never be undefined
        auth: state.auth,
        isLoadingCases: state.cases.isLoadingCases,
        casesError: state.cases.error,
        teams: state.me.results?.userTeams,
        genders,
        hasDeletePermission,
    };
};

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, {
    getCases,
    login,
})(FamilyConnectionsScreen);
