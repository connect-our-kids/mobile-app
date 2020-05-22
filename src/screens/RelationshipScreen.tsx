import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Modal,
    ListRenderItemInfo,
    Image,
} from 'react-native';
import constants from '../helpers/constants';
import { connect } from 'react-redux';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import {
    Engagement,
    Document,
} from '../components/family-connections/RelationshipViewTabs';
import Loader from '../components/Loader';
import ConnectionsDetailsView from '../components/family-connections/RelationshipViewTabs/RelationshipDetailsView';
import RelationshipListItem from '../components/family-connections/CaseList';
import { created } from '../helpers/comparators';

import { RootState } from '../store/reducers';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { getRelationship } from '../store/actions/relationshipAction';
import { EngagementDocumentDetail } from '../generated/EngagementDocumentDetail';
import { EngagementDetail } from '../generated/EngagementDetail';
import { RelationshipDetailFullFragment } from '../generated/RelationshipDetailFullFragment';
import { EngagementTypes } from '../components/family-connections/EngagementTypes';
import { AddEngagementFormParams } from '../components/family-connections/AddEngagementForm/AddEngagementForm';
import ScrollToTop from '../components/family-connections/ScrollToTop/ScrollToTop';
import { caseDetailFull_engagements_EngagementDocument } from '../generated/caseDetailFull';
import PickFileButton from '../components/family-connections/AddDocumentButtons/PickFileButton';
import PickPhotoButton from '../components/family-connections/AddDocumentButtons/PickPhotoButton';
import TakePhotoButton from '../components/family-connections/AddDocumentButtons/TakePhotoButton';
import {
    createDocEngagement,
    docClearError,
    docClearSuccess,
    clearEngagementSuccess,
} from '../store/actions';
import { AuthState } from '../store/reducers/authReducer';
import ConnectionsLogin from '../components/auth/ConnectionsLogin';
import { useMutation } from '@apollo/react-hooks';
import {
    DELETE_ENGAGEMENT_MUTATION,
    deleteEngagementCache,
} from '../store/actions/fragments/cases';
import {
    deleteEngagementMutation,
    deleteEngagementMutationVariables,
} from '../generated/deleteEngagementMutation';
import { SwipeListView } from 'react-native-swipe-list-view';
import { engagements_engagements_EngagementDocument } from '../generated/engagements';

const styles = StyleSheet.create({
    topView: {
        backgroundColor: constants.backgroundColor,
        height: '100%',
    },
    tabs: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#EBEBEB',
        paddingTop: 10,
    },
    engagementTab: {
        width: '33.3%',
        justifyContent: 'center',
        alignItems: 'center',
        height: 36,
        fontSize: 17.5,
        textAlign: 'center',
    },
    documentsTab: {
        width: '33.3%',
        justifyContent: 'center',
        alignItems: 'center',
        height: 36,
        fontSize: 17.5,
        textAlign: 'center',
    },
    detailsTab: {
        width: '33.3%',
        justifyContent: 'center',
        alignItems: 'center',
        height: 36,
        fontSize: 17.5,
        textAlign: 'center',
    },
    thatBlue: {
        color: constants.highlightColor,
    },
    documentsButtonsGroup: {
        display: 'flex',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        marginBottom: 0,
        marginHorizontal: 15,
    },
    engagementSelected: {
        color: 'orange',
        borderBottomWidth: 3,
        borderBottomColor: constants.highlightColor,
        overflow: 'hidden',
    },
    documentsSelected: {
        color: constants.highlightColor,
        borderBottomWidth: 3,
        borderBottomColor: constants.highlightColor,
        overflow: 'hidden',
    },
    detailsSelected: {
        color: constants.highlightColor,
        borderBottomWidth: 3,
        borderBottomColor: constants.highlightColor,
        overflow: 'hidden',
    },
    iconLabelContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        marginHorizontal: 15,
    },
    iconContainer: {
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconStyles: {
        fontSize: 28,
        color: constants.highlightColor,
        width: 30,
        height: 28,
        marginHorizontal: 15,
    },
    iconLabel: {
        color: '#0F6580',
        fontSize: 12,
        textAlign: 'center',
        width: 65,
        paddingLeft: -3,
    },
    relationshipCard: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingBottom: 30,
        paddingTop: 15,
        paddingLeft: 5,
    },
    centerView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        padding: 35,
        borderRadius: 10,
        alignItems: 'center',
        alignContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalButtonView: {
        flexDirection: 'row',
    },
    modalButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 96,
        height: 36,
        borderRadius: 50,
        borderWidth: 1,
        marginTop: 20,
        backgroundColor: constants.highlightColor,
        borderColor: constants.highlightColor,
    },
    modalDeleteButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 96,
        height: 36,
        borderRadius: 50,
        borderWidth: 1,
        marginTop: 20,
        marginLeft: 15,
        backgroundColor: 'red',
        borderColor: 'red',
    },
    modalButtonText: {
        fontSize: 14,
        textTransform: 'uppercase',
        color: '#fff',
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        backgroundColor: 'white',
    },
    rowBack: {
        backgroundColor: 'red',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        backgroundColor: 'red',
        right: 0,
    },
});

interface StateProps {
    caseId?: number;
    relationshipId: number;
    relationship?: RelationshipDetailFullFragment;
    isLoading: boolean;
    documents: EngagementDocumentDetail[];
    engagements: EngagementDetail[];
    documentError?: string;
    documentSuccess: boolean;
    documentSuccessID?: number;
    engagementSuccess: boolean;
    engagementSuccessID?: number;
    auth: AuthState;
}

interface DispatchProps {
    getRelationship: typeof getRelationship;
    createDocEngagement: typeof createDocEngagement;
    docClearError: typeof docClearError;
    docClearSuccess: typeof docClearSuccess;
    clearEngagementSuccess: typeof clearEngagementSuccess;
}

type Navigation = NavigationScreenProp<NavigationState>;

interface OwnProps {
    navigation: Navigation;
}

type Props = StateProps & DispatchProps & OwnProps;

export interface RelationshipScreenParams {
    relationshipId: number;
}

function ErrorModal(modalProps: {
    error: string;
    dismissModal: () => void;
}): JSX.Element {
    return (
        <Modal animationType={'fade'} transparent={true} visible={true}>
            <View style={styles.centerView}>
                <View style={styles.modalView}>
                    <Text>Error adding document. Please Try again later.</Text>
                    <TouchableOpacity
                        style={styles.modalButton}
                        onPress={() => modalProps.dismissModal()}
                    >
                        <Text style={styles.modalButtonText}>close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

function DeleteConfirmationModal(props: {
    type: 'engagement' | 'document';
    onCancel: () => void;
    onDelete: () => void;
}): JSX.Element {
    return (
        <Modal animationType={'none'} transparent={true} visible={true}>
            <View style={styles.centerView}>
                <View style={styles.modalView}>
                    <Text>
                        Delete{' '}
                        {props.type === 'document' ? 'Document' : 'Engagement'}?
                    </Text>
                    <View style={styles.modalButtonView}>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={props.onCancel}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalDeleteButton}
                            onPress={props.onDelete}
                        >
                            <Text style={styles.modalButtonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

function DeletingModal(props: {
    type: 'engagement' | 'document';
}): JSX.Element {
    return (
        <Modal animationType={'none'} transparent={true} visible={true}>
            <View style={styles.centerView}>
                <View style={styles.modalView}>
                    <Text>
                        Deleting{' '}
                        {props.type === 'document' ? 'Document' : 'Engagement'}
                        {'...'}
                    </Text>
                    <Image
                        source={require('../../assets/loading.gif')}
                        style={{ width: 80, height: 80 }}
                    />
                </View>
            </View>
        </Modal>
    );
}

function ErrorDeletingEngagementModal(props: {
    type: 'engagement' | 'document';
    message: string;
    onCancel: () => void;
}): JSX.Element {
    return (
        <Modal animationType={'none'} transparent={true} visible={true}>
            <View style={styles.centerView}>
                <View style={styles.modalView}>
                    <Text style={{ fontWeight: 'bold', paddingBottom: 20 }}>
                        Error Deleting{' '}
                        {props.type === 'document' ? 'Document' : 'Engagement'}?
                    </Text>
                    <Text>{props.message}</Text>
                    <TouchableOpacity
                        style={styles.modalButton}
                        onPress={props.onCancel}
                    >
                        <Text style={styles.modalButtonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

/**
 * This screen shows the information pertaining to one relationship/connection from a case
 * @param props Properties required by this screen
 */
function RelationshipScreen(props: Props): JSX.Element {
    const [currentTab, setCurrentTab] = useState<
        'engagements' | 'details' | 'documents'
    >('engagements');

    const [isScrolling, setIsScrolling] = useState(false);

    const [showSwipePreview, setShowSwipePreview] = useState(true);

    const [deleteEngagementState, setDeleteEngagementState] = useState<
        | {
              state: 'confirm';
              type: 'document' | 'engagement';
              engagement: EngagementDetail;
          }
        | {
              state: 'delete';
              type: 'document' | 'engagement';
              engagement: EngagementDetail;
          }
        | {
              state: 'error';
              type: 'document' | 'engagement';
              error: string;
          }
        | undefined
    >(undefined);

    const [deleteEngagementGraphQL, { loading }] = useMutation<
        deleteEngagementMutation,
        deleteEngagementMutationVariables
    >(DELETE_ENGAGEMENT_MUTATION, {
        errorPolicy: 'all',
        onCompleted: () => {
            setDeleteEngagementState(undefined);
        },
        onError: (error) => {
            setDeleteEngagementState({
                state: 'error',
                type: deleteEngagementState?.type ?? 'engagement',
                error: error.message ?? 'Unknown error',
            });
        },
    });

    const performDeleteEngagement = (engagement: EngagementDetail) => {
        deleteEngagementGraphQL({
            variables: {
                caseId: engagement.case.id,
                engagementId: engagement.id,
            },
            update: (cache) => {
                deleteEngagementCache(engagement.case.id, engagement, cache);
            },
        });
    };

    useEffect(() => {
        if (props.caseId) {
            props.getRelationship(props.caseId, props.relationshipId);
        }
    }, []);
    useEffect(() => {
        if (props.documentSuccess) {
            setTimeout(() => {
                props.docClearSuccess();
            }, 1600);
        }
    }, [props.documentSuccess]);
    useEffect(() => {
        if (props.engagementSuccess) {
            setTimeout(() => {
                props.clearEngagementSuccess();
            }, 1600);
        }
    }, [props.engagementSuccess]);

    useEffect(() => {
        setShowSwipePreview(true);
    }, [showSwipePreview]);

    const engagementsNoDocuments = props.engagements.filter(
        (engagement) => engagement.__typename !== 'EngagementDocument'
    );

    const navigateToEngagementForm = (type: EngagementTypes): boolean => {
        return props.navigation.navigate('AddEngagementForm', {
            engagementType: type,
            relationshipId: props.relationshipId,
            relationship: props.relationship,
            caseId: props.caseId,
        } as AddEngagementFormParams);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let scroll: SwipeListView<EngagementDetail> | null = null;

    if (!props.auth.isLoggedIn) {
        return <ConnectionsLogin />;
    }

    const renderEngagement = (
        itemInfo: ListRenderItemInfo<EngagementDetail>
    ) => (
        <View style={styles.rowFront}>
            <Engagement
                engagement={itemInfo.item}
                newEngagement={props.engagementSuccess}
                newEngagementID={props.engagementSuccessID}
            />
        </View>
    );

    const renderDocument = (
        itemInfo: ListRenderItemInfo<engagements_engagements_EngagementDocument>
    ) => (
        <View style={styles.rowFront}>
            <Document
                key={itemInfo.item.id}
                document={itemInfo.item}
                documentError={props.documentError}
                newDocument={props.documentSuccess}
                newDocumentID={props.documentSuccessID}
            />
        </View>
    );

    const renderDeleteEngagementSwipeButton = (
        itemInfo: ListRenderItemInfo<EngagementDetail>
    ) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={styles.backRightBtn}
                onPress={() => {
                    setDeleteEngagementState({
                        state: 'confirm',
                        type:
                            itemInfo.item.__typename === 'EngagementDocument'
                                ? 'document'
                                : 'engagement',
                        engagement: itemInfo.item,
                    });
                }}
            >
                <Text style={styles.backTextWhite}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    return props.isLoading || !props.relationship ? (
        <View style={{ ...styles.topView }}>
            <Loader />
        </View>
    ) : (
        <View
            style={[
                { ...styles.topView },
                props.documentError
                    ? { backgroundColor: 'rgba(0,0,0,0.3)' }
                    : {},
            ]}
        >
            <View style={styles.relationshipCard}>
                <RelationshipListItem
                    relationship={props.relationship}
                    documentError={props.documentError}
                />
            </View>
            <View
                style={[
                    styles.tabs,
                    props.documentError
                        ? { borderBottomColor: 'rgba(0,0,0,0.0)' }
                        : {},
                ]}
            >
                <View
                    style={[
                        styles.engagementTab,
                        currentTab === 'engagements'
                            ? styles.engagementSelected
                            : null,
                    ]}
                >
                    <Text
                        style={[
                            {
                                color: '#444444',
                                fontSize: 17.5,
                                paddingBottom: 9,
                            },
                            currentTab === 'engagements'
                                ? { color: '#444444' }
                                : { color: '#444444' },
                        ]}
                        onPress={() => {
                            setCurrentTab('engagements');
                        }}
                    >
                        <Text
                            style={
                                currentTab === 'engagements'
                                    ? styles.thatBlue
                                    : null
                            }
                        >
                            Engagements
                        </Text>
                    </Text>
                </View>
                <View
                    style={[
                        styles.detailsTab,
                        currentTab === 'details'
                            ? styles.detailsSelected
                            : null,
                    ]}
                >
                    <Text
                        style={[
                            {
                                color: '#444444',
                                fontSize: 17.5,
                                paddingBottom: 9,
                            },
                            currentTab === 'details'
                                ? { color: '#444444' }
                                : { color: '#444444' },
                        ]}
                        onPress={() => {
                            setCurrentTab('details');
                        }}
                    >
                        <Text
                            style={
                                currentTab === 'details'
                                    ? styles.thatBlue
                                    : null
                            }
                        >
                            Details
                        </Text>
                    </Text>
                </View>
                <View
                    style={[
                        styles.documentsTab,
                        currentTab === 'documents'
                            ? styles.documentsSelected
                            : null,
                    ]}
                >
                    <Text
                        style={[
                            {
                                color: '#444444',
                                fontSize: 17.5,
                                paddingBottom: 9,
                            },
                            currentTab === 'documents'
                                ? { color: '#444444' }
                                : { color: '#444444' },
                        ]}
                        onPress={() => {
                            setCurrentTab('documents');
                        }}
                    >
                        <Text
                            style={
                                currentTab === 'documents'
                                    ? styles.thatBlue
                                    : null
                            }
                        >
                            Documents
                        </Text>
                    </Text>
                </View>
            </View>
            {currentTab === 'engagements' ? (
                <View
                    style={{
                        width: '100%',
                        minHeight: 350,
                        paddingTop: 10,
                        paddingHorizontal: 10,
                        flex: 1,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                        }}
                    >
                        <View style={styles.iconLabelContainer}>
                            <View style={styles.iconContainer}>
                                <TouchableOpacity
                                    onPress={() => {
                                        navigateToEngagementForm(
                                            'EngagementNote'
                                        );
                                    }}
                                >
                                    <MaterialIcons
                                        name="note-add"
                                        style={styles.iconStyles}
                                    />
                                    <Text style={styles.iconLabel}>
                                        ADD NOTE
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.iconLabelContainer}>
                            <View style={styles.iconContainer}>
                                <TouchableOpacity
                                    onPress={() => {
                                        navigateToEngagementForm(
                                            'EngagementCall'
                                        );
                                    }}
                                >
                                    <MaterialCommunityIcons
                                        name="phone-plus"
                                        style={{
                                            fontSize: 28,
                                            color: constants.highlightColor,
                                            width: 28,
                                            height: 28,
                                            marginHorizontal: 10,
                                        }}
                                    />
                                    <Text style={styles.iconLabel}>
                                        LOG CALL
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.iconLabelContainer}>
                            <View style={styles.iconContainer}>
                                <TouchableOpacity
                                    onPress={async () => {
                                        navigateToEngagementForm(
                                            'EngagementEmail'
                                        );
                                    }}
                                >
                                    <MaterialCommunityIcons
                                        name="email-plus"
                                        style={styles.iconStyles}
                                    />
                                    <Text style={styles.iconLabel}>
                                        LOG EMAIL
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {engagementsNoDocuments.length > 0 ? (
                        <SwipeListView
                            disableRightSwipe
                            data={engagementsNoDocuments}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderEngagement}
                            renderHiddenItem={renderDeleteEngagementSwipeButton}
                            rightOpenValue={-75}
                            listViewRef={(ref) => {
                                scroll = ref;
                            }}
                            onScroll={(scrollingEvent): void => {
                                // TODO change infinity to zero when working
                                setIsScrolling(
                                    scrollingEvent.nativeEvent.contentOffset.y >
                                        Infinity
                                );
                            }}
                            onScrollToTop={(): void => {
                                // TODO scrolling is currently broken
                                setIsScrolling(false);
                            }}
                            scrollEventThrottle={1}
                        />
                    ) : (
                        <Text
                            style={{
                                width: '100%',
                                textAlign: 'center',
                                marginTop: 50,
                            }}
                        >
                            No engagements have been recorded for this person.
                        </Text>
                    )}
                </View>
            ) : null}
            {currentTab === 'details' ? (
                <View
                    style={{
                        minHeight: 350,
                        width: '100%',
                        paddingTop: 40,
                    }}
                >
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {props.relationship ? (
                            <ConnectionsDetailsView
                                details={props.relationship}
                            />
                        ) : null}
                    </View>
                </View>
            ) : null}
            {currentTab === 'documents' ? (
                <View
                    style={{
                        width: '100%',
                        minHeight: 350,
                        paddingTop: 10,
                        paddingHorizontal: 10,
                        flex: 1,
                    }}
                >
                    {props.documentError && (
                        <ErrorModal
                            error={props.documentError}
                            dismissModal={() => props.docClearError()}
                        />
                    )}
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                        }}
                    >
                        <View style={styles.documentsButtonsGroup}>
                            <PickFileButton
                                afterAccept={(media) => {
                                    props.navigation.navigate('DocumentForm', {
                                        media,
                                    });
                                }}
                            />
                            <PickPhotoButton
                                afterAccept={(media) => {
                                    props.navigation.navigate('DocumentForm', {
                                        media,
                                    });
                                }}
                            />
                            <TakePhotoButton
                                afterAccept={(media) => {
                                    props.navigation.navigate('DocumentForm', {
                                        media,
                                    });
                                }}
                            />
                        </View>
                    </View>
                    {props.documents.length > 0 ? (
                        <SwipeListView
                            disableRightSwipe
                            data={props.documents.sort(created).reverse()}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderDocument}
                            renderHiddenItem={renderDeleteEngagementSwipeButton}
                            rightOpenValue={-75}
                            listViewRef={(ref) => {
                                scroll = ref;
                            }}
                            onScroll={(scrollingEvent): void => {
                                // TODO change infinity to zero when working
                                setIsScrolling(
                                    scrollingEvent.nativeEvent.contentOffset.y >
                                        Infinity
                                );
                            }}
                            onScrollToTop={(): void => {
                                // TODO scrolling is currently broken
                                setIsScrolling(false);
                            }}
                            scrollEventThrottle={1}
                        />
                    ) : (
                        <Text
                            style={{
                                width: '100%',
                                textAlign: 'center',
                                marginTop: 50,
                            }}
                        >
                            No documents have been attached to this person.
                        </Text>
                    )}
                </View>
            ) : null}
            {deleteEngagementState?.state === 'confirm' ? (
                <DeleteConfirmationModal
                    type={deleteEngagementState.type}
                    onCancel={() => {
                        setDeleteEngagementState(undefined);
                    }}
                    onDelete={() => {
                        performDeleteEngagement(
                            deleteEngagementState.engagement
                        );
                        setDeleteEngagementState({
                            state: 'delete',
                            type: deleteEngagementState.type,
                            engagement: deleteEngagementState.engagement,
                        });
                    }}
                ></DeleteConfirmationModal>
            ) : null}
            {deleteEngagementState?.state === 'error' ? (
                <ErrorDeletingEngagementModal
                    type={deleteEngagementState.type}
                    message={deleteEngagementState.error}
                    onCancel={() => {
                        setDeleteEngagementState(undefined);
                    }}
                ></ErrorDeletingEngagementModal>
            ) : null}
            {loading ? (
                <DeletingModal
                    type={deleteEngagementState?.type ?? 'document'}
                />
            ) : null}
            {isScrolling ? (
                <ScrollToTop
                    style={{
                        position: 'absolute',
                        zIndex: 1000,
                        bottom: 10,
                        right: 38,
                        backgroundColor: 'white',
                        padding: 8,
                        borderRadius: 35,
                        opacity: 0, // TODO hiding this on purpose
                    }}
                    onPress={(): void => {
                        // TODO this does not currently work
                        /* scroll.current?.scrollToLocation({
                            x: 0,
                            y: 0,
                            animated: true,
                        });*/
                        console.log(scroll?.state);
                    }}
                />
            ) : null}
        </View>
    );
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
    // passed in parameter on navigate
    const relationshipId = ownProps.navigation.getParam(
        'relationshipId'
    ) as number;

    const caseId = state.case.results?.details?.id;

    // engagements are at the case level. Filter to ones relevant
    // to this relationship/connection
    const engagements =
        state.case.results?.engagements.filter(
            (engagement) => engagement.relationship?.id === relationshipId
        ) ?? [];

    const documents =
        engagements?.filter(
            (engagement) => engagement.__typename === 'EngagementDocument'
        ) ?? [];
    const documentError = state.case.documentError;
    const documentSuccessID = state.case.addedDocumentID;
    const documentSuccess = state.case.documentSuccess;
    const engagementSuccessID = state.case.addedEngagementID;
    const engagementSuccess = state.case.engagementSuccess;
    return {
        caseId,
        relationshipId,
        isLoading: state.relationship.isLoading,
        relationship: state.relationship.results,
        engagements: engagements,
        documents: documents as caseDetailFull_engagements_EngagementDocument[],
        documentError,
        documentSuccessID,
        documentSuccess,
        engagementSuccessID,
        engagementSuccess,
        auth: state.auth,
    };
};

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, {
    getRelationship,
    createDocEngagement,
    clearEngagementSuccess,
    docClearError,
    docClearSuccess,
})(RelationshipScreen);
