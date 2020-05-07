import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Modal,
} from 'react-native';
import constants from '../helpers/constants';
import { connect } from 'react-redux';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import {
    Engagement,
    Documents,
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

const styles = StyleSheet.create({
    topView: {
        backgroundColor: constants.backgroundColor,
        height: '100%',
    },
    tabs: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderTopRightRadius: 4,
        borderBottomColor: '#EBEBEB',
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
        padding: 4,
        width: '100%',
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
        width: 45,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
    },

    iconStyles: {
        fontSize: 28,
        color: constants.highlightColor,
        width: 28,
        height: 28,
        marginHorizontal: 10,
    },

    iconLabel: {
        color: '#0F6580',
        fontSize: 12,
    },
    avatarName: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingBottom: '10%',
        paddingTop: 5,
        paddingLeft: 5,
    },
    centerView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        padding: 35,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
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

    modalButtonText: {
        fontSize: 14,
        textTransform: 'uppercase',
        color: '#fff',
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
        <Modal animationType="fade" transparent={true} visible={true}>
            <View style={styles.centerView}>
                <View style={styles.modalView}>
                    <Text>Error adding document. Please Try again later.</Text>
                    <TouchableOpacity style={styles.modalButton}>
                        <Text
                            style={styles.modalButtonText}
                            onPress={() => modalProps.dismissModal()}
                        >
                            close
                        </Text>
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
    const [tabs, setTabs] = useState({
        engagement: true,
        docs: false,
        details: false,
    });
    const [options] = useState({ x: 0, y: 0, animated: true }); // used as landing coordinates for scroll to top
    const [isScrolling, setIsScrolling] = useState(false);
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

    // const leftArrow = '\u2190';

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

    let scroll: ScrollView | null = null;

    if (!props.auth.isLoggedIn) {
        return <ConnectionsLogin />;
    }

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
                    }}
                    onPress={(): void => {
                        scroll?.scrollTo(options);
                    }}
                />
            ) : null}
            <ScrollView
                ref={(a): void => {
                    scroll = a;
                }}
                style={{ height: '100%', width: '100%' }}
                scrollsToTop
                onScroll={(scrollingEvent): void => {
                    if (scrollingEvent.nativeEvent.contentOffset.y <= 250) {
                        setIsScrolling(false);
                    } else if (
                        scrollingEvent.nativeEvent.contentOffset.y >= 250
                    ) {
                        setIsScrolling(true);
                    }
                }}
                onScrollToTop={(): void => setIsScrolling(false)}
                scrollEventThrottle={16}
            >
                <View>
                    <View style={styles.avatarName}>
                        <RelationshipListItem
                            relationship={props.relationship}
                            documentError={props.documentError}
                        />
                    </View>
                </View>
                <View
                    style={[
                        {
                            justifyContent: 'flex-start',
                            width: '100%',
                            alignItems: 'flex-start',
                        },
                    ]}
                >
                    <View
                        style={{
                            borderRadius: 4,
                            width: '100%',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                        }}
                    >
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
                                    tabs.engagement
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
                                        tabs.engagement
                                            ? { color: '#444444' }
                                            : { color: '#444444' },
                                    ]}
                                    onPress={() => {
                                        setTabs({
                                            engagement: true,
                                            docs: false,
                                            details: false,
                                        });
                                    }}
                                >
                                    <Text
                                        style={
                                            tabs.engagement
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
                                    tabs.details
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
                                        tabs.details
                                            ? { color: '#444444' }
                                            : { color: '#444444' },
                                    ]}
                                    onPress={() => {
                                        setTabs({
                                            engagement: false,
                                            docs: false,
                                            details: true,
                                        });
                                        // TODO what is this for?
                                        // props.setDetails(true);
                                    }}
                                >
                                    <Text
                                        style={
                                            tabs.details
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
                                    tabs.docs ? styles.documentsSelected : null,
                                ]}
                            >
                                <Text
                                    style={[
                                        {
                                            color: '#444444',
                                            fontSize: 17.5,
                                            paddingBottom: 9,
                                        },
                                        tabs.docs
                                            ? { color: '#444444' }
                                            : { color: '#444444' },
                                    ]}
                                    onPress={() => {
                                        setTabs({
                                            engagement: false,
                                            docs: true,
                                            details: false,
                                        });
                                    }}
                                >
                                    <Text
                                        style={
                                            tabs.docs ? styles.thatBlue : null
                                        }
                                    >
                                        Documents
                                    </Text>
                                </Text>
                            </View>
                        </View>

                        {tabs.engagement ? (
                            <View
                                style={{
                                    width: '100%',
                                    minHeight: 350,
                                    paddingVertical: 15,
                                    paddingHorizontal: 10,
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: 4,
                                        marginBottom: 20,
                                        marginHorizontal: 0,
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
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.iconLabel}>
                                            Add Note
                                        </Text>
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
                                                        color:
                                                            constants.highlightColor,
                                                        width: 28,
                                                        height: 28,
                                                        marginHorizontal: 10,
                                                    }}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.iconLabel}>
                                            Log Call
                                        </Text>
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
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.iconLabel}>
                                            Log Email
                                        </Text>
                                    </View>
                                </View>

                                <View>
                                    {engagementsNoDocuments.length > 0 ? (
                                        engagementsNoDocuments.map(
                                            (engagement) => {
                                                return (
                                                    <View
                                                        key={engagement.id}
                                                        style={{ width: '70%' }}
                                                    >
                                                        <Engagement
                                                            engagement={
                                                                engagement
                                                            }
                                                            newEngagement={
                                                                props.engagementSuccess
                                                            }
                                                            newEngagementID={
                                                                props.engagementSuccessID
                                                            }
                                                        />
                                                    </View>
                                                );
                                            }
                                        )
                                    ) : (
                                        <Text
                                            style={{
                                                width: '100%',
                                                textAlign: 'center',
                                                marginTop: 50,
                                            }}
                                        >
                                            No engagements have been recorded
                                            for this person.
                                        </Text>
                                    )}
                                </View>
                            </View>
                        ) : null}

                        {tabs.docs ? (
                            <View style={{ minHeight: 350, width: '100%' }}>
                                {props.documentError && (
                                    <ErrorModal
                                        error={props.documentError}
                                        dismissModal={() =>
                                            props.docClearError()
                                        }
                                    />
                                )}
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <View style={styles.documentsButtonsGroup}>
                                        <PickFileButton
                                            afterAccept={(media) => {
                                                props.navigation.navigate(
                                                    'DocumentForm',
                                                    { media }
                                                );
                                            }}
                                        />
                                        <PickPhotoButton
                                            afterAccept={(media) => {
                                                props.navigation.navigate(
                                                    'DocumentForm',
                                                    { media }
                                                );
                                            }}
                                        />
                                        <TakePhotoButton
                                            afterAccept={(media) => {
                                                props.navigation.navigate(
                                                    'DocumentForm',
                                                    { media }
                                                );
                                            }}
                                        />
                                    </View>
                                </View>
                                <View
                                    style={{ width: '100%', maxHeight: '100%' }}
                                >
                                    {props.documents.length > 0 ? (
                                        props.documents
                                            .sort(created)
                                            .reverse()
                                            .map((document) => {
                                                return (
                                                    <Documents
                                                        key={document.id}
                                                        document={document}
                                                        documentError={
                                                            props.documentError
                                                        }
                                                        newDocument={
                                                            props.documentSuccess
                                                        }
                                                        newDocumentID={
                                                            props.documentSuccessID
                                                        }
                                                    />
                                                );
                                            })
                                    ) : (
                                        <Text
                                            style={{
                                                width: '100%',
                                                textAlign: 'center',
                                                marginTop: 50,
                                            }}
                                        >
                                            No documents have been attached to
                                            this person.
                                        </Text>
                                    )}
                                </View>
                            </View>
                        ) : // </View>
                        null}
                        {tabs.details ? (
                            <View style={{ minHeight: 350, width: '100%' }}>
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <ConnectionsDetailsView
                                        details={props.relationship}
                                        relationshipId={props.relationshipId}
                                    />
                                </View>
                            </View>
                        ) : null}
                    </View>
                </View>
            </ScrollView>
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
