import React, { useState } from 'react';
import {
    Text,
    ScrollView,
    View,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Modal,
} from 'react-native';
import constants from '../../../helpers/constants';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import RelationshipListItem from '../CaseList';
import { RootState } from '../../../store/reducers';
import { RelationshipDetailFullFragment } from '../../../generated/RelationshipDetailFullFragment';

import {
    createNoteEngagement,
    createCallEngagement,
    createEmailEngagement,
} from '../../../store/actions';
import Loader from '../../Loader/Loader';

const styles = StyleSheet.create({
    formContainer: {
        width: '95%',
        // padding: 4,
        marginTop: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },

    saveButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 96,
        height: 36,
        borderRadius: 50,
        borderWidth: 1,
        marginTop: 5,
        backgroundColor: constants.highlightColor,
        borderColor: constants.highlightColor,
    },
    buttonText: {
        fontSize: 14,
        textTransform: 'uppercase',
        color: '#fff',
    },
    modal: {
        margin: 20,
        marginTop: 180,
        backgroundColor: 'white',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        padding: 35,
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
    errorText: {
        textTransform: 'uppercase',
        color: '#fff',
    },
    subjectFormEmail: {
        minHeight: 25,
        marginBottom: 5,
        width: '93%',
        backgroundColor: 'white',
        borderRadius: 4,
    },
    subject: {
        padding: 4,
        fontSize: 15,
        backgroundColor: '#FAFAFA',
        borderRadius: 4,
    },
    engagementForm: {
        height: 270,
        marginBottom: 5,
        width: '93%',
        backgroundColor: '#FAFAFA',
        borderRadius: 4,
    },
    containerStyle: {
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        height: '100%',
    },
    avatarName: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingBottom: '2%',
        paddingTop: 5,
        paddingLeft: 5,
        width: '100%',
    },
});

const getTitle = (dataType: AddEngagementFormEngagementTypes): string => {
    switch (dataType) {
        case 'EngagementCall':
            return 'Log Call';
        case 'EngagementEmail':
            return 'Log Email';
        case 'EngagementNote':
            return 'Add Note';
        default:
            throw new Error(`Unsupported engagement type: ${dataType}`);
    }
};

const dataTypePlaceholder = (
    dataType: AddEngagementFormEngagementTypes
): string => {
    if (dataType === 'EngagementEmail') {
        return 'Your email notes...';
    } else {
        return 'Your notes...';
    }
};

interface StateProps {
    caseId: number;
    relationshipId: number;
    relationship: RelationshipDetailFullFragment;
    engagementType: AddEngagementFormEngagementTypes;
    engagementErrorToggle: boolean;
    isLoadingEngagements: boolean;
}

interface DispatchProps {
    createNoteEngagement: typeof createNoteEngagement;
    createCallEngagement: typeof createCallEngagement;
    createEmailEngagement: typeof createEmailEngagement;
}

type Navigation = NavigationScreenProp<NavigationState>;

interface OwnProps {
    navigation: Navigation;
}

type Props = StateProps & DispatchProps & OwnProps;

export type AddEngagementFormEngagementTypes =
    | 'EngagementCall'
    | 'EngagementEmail'
    | 'EngagementNote';

export interface AddEngagementFormParams {
    relationshipId?: number;
    relationship?: RelationshipDetailFullFragment;
    caseId: number;
    engagementType: AddEngagementFormEngagementTypes;
    engagementErrorToggle: boolean;
    isLoadingEngagements: boolean;
}

const AddEngagementForm = (props: Props) => {
    const [note, setNote] = useState('');
    const [subject, setSubject] = useState('');
    const [isPublic] = useState(true);
    const [toggleErrorModal, setErrorToggleModal] = useState(false);

    const toggleErrorModalHandler = () => {
        props.engagementErrorToggle
            ? setErrorToggleModal(!toggleErrorModal)
            : props.navigation.goBack();
    };

    const createEngagement = () => {
        switch (props.engagementType) {
            case 'EngagementCall':
                props.createCallEngagement(props.caseId, {
                    relationshipId: props.relationshipId,
                    isPublic,
                    note,
                });
                break;
            case 'EngagementEmail':
                props.createEmailEngagement(props.caseId, {
                    relationshipId: props.relationshipId,
                    isPublic,
                    body: note,
                    subject,
                });
                break;
            case 'EngagementNote':
                props.createNoteEngagement(props.caseId, {
                    relationshipId: props.relationshipId,
                    isPublic,
                    note,
                });
                break;
            default:
                // EngagementDocument unhandled on purpose
                throw new Error(
                    `Unsupported engagement type: ${props.engagementType}`
                );
        }
    };

    return (
        <ScrollView
            contentContainerStyle={[
                styles.containerStyle,
                toggleErrorModal
                    ? { backgroundColor: 'rgba(0, 0, 0, 0.25)' }
                    : {},
            ]}
        >
            <View style={{ width: '100%' }}>
                <View style={styles.avatarName}>
                    <RelationshipListItem relationship={props.relationship} />
                </View>
            </View>
            <View style={[styles.formContainer]}>
                <View
                    style={{
                        width: '100%',
                        alignItems: 'flex-start',
                        marginTop: 12,
                        marginBottom: 25,
                        paddingLeft: 15,
                    }}
                >
                    <Text style={{ fontSize: 17.5 }}>
                        {getTitle(props.engagementType)}
                    </Text>
                </View>
                {props.engagementType === 'EngagementEmail' ? (
                    <View
                        style={[
                            styles.subjectFormEmail,
                            toggleErrorModal
                                ? { backgroundColor: 'rgba(0, 0, 0, 0)' }
                                : {},
                        ]}
                    >
                        <TextInput
                            onChangeText={(text) => {
                                setSubject(text);
                            }}
                            placeholder="Subject"
                            placeholderTextColor={'#AAA9AD'}
                            style={styles.subject}
                            textAlignVertical="top"
                            value={subject}
                        />
                    </View>
                ) : null}
                <View
                    style={[
                        styles.engagementForm,
                        toggleErrorModal
                            ? { backgroundColor: 'rgba(0, 0, 0, 0)' }
                            : {},
                    ]}
                >
                    <TextInput
                        multiline
                        numberOfLines={4}
                        onChangeText={(text) => {
                            setNote(text);
                        }}
                        placeholder={dataTypePlaceholder(props.engagementType)}
                        placeholderTextColor={'#AAA9AD'}
                        style={{
                            padding: 5,
                            width: '100%',
                            height: '100%',
                            fontSize: 15,
                        }}
                        textAlignVertical="top"
                        value={note}
                    />
                </View>

                {/* Items below here don't change */}
                <View
                    style={{
                        width: '100%',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            width: '100%',
                            justifyContent: 'space-between',
                        }}
                    ></View>
                    <View
                        style={{
                            width: '100%',
                            alignItems: 'flex-end',
                            marginTop: 12,
                        }}
                    >
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={() => {
                                createEngagement();
                                toggleErrorModalHandler();
                            }}
                        >
                            <Text style={styles.buttonText}>SAVE</Text>
                        </TouchableOpacity>

                        <Modal
                            animationType={'fade'}
                            transparent={true}
                            visible={props.isLoadingEngagements}
                        >
                            <View style={styles.modal}>
                                <Text>Adding Engagement...</Text>
                                <Loader />
                            </View>
                        </Modal>

                        <Modal
                            animationType={'fade'}
                            transparent={true}
                            visible={toggleErrorModal}
                        >
                            <View style={styles.modal}>
                                <Text>Error adding engagement!</Text>
                                <Text>Please try again later.</Text>
                                <TouchableOpacity
                                    style={styles.saveButton}
                                    onPress={() => {
                                        toggleErrorModalHandler();
                                    }}
                                >
                                    <Text style={styles.errorText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
    // passed in parameter on navigate
    const relationshipId = ownProps.navigation.getParam(
        'relationshipId'
    ) as number;
    const relationship = ownProps.navigation.getParam(
        'relationship'
    ) as RelationshipDetailFullFragment;
    // passed in parameter on navigate
    const engagementType = ownProps.navigation.getParam(
        'engagementType'
    ) as AddEngagementFormEngagementTypes;

    const engagementErrorToggle: boolean = state.case.engagementErrorToggle;
    const isLoadingEngagements: boolean = state.case.isLoadingEngagements;
    // this component only supports the following types
    if (
        engagementType !== 'EngagementCall' &&
        engagementType !== 'EngagementNote' &&
        engagementType !== 'EngagementEmail'
    ) {
        throw new Error(`Unsupported engagement type: ${engagementType}`);
    }

    const caseId = state.case.results?.details?.id;
    if (caseId === undefined) {
        throw new Error(`No case id specified`);
    }

    return {
        caseId,
        relationshipId,
        relationship,
        engagementType,
        engagementErrorToggle,
        isLoadingEngagements,
    };
};

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, {
    createNoteEngagement,
    createCallEngagement,
    createEmailEngagement,
})(AddEngagementForm);
