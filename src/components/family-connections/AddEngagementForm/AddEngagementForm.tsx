import React, { useState } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Modal,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import constants from '../../../helpers/constants';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import RelationshipListItem from '../CaseList';
import { RootState } from '../../../store/reducers';
import { RelationshipDetailFullFragment } from '../../../generated/RelationshipDetailFullFragment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {
    createNoteEngagement,
    createCallEngagement,
    createEmailEngagement,
} from '../../../store/actions';
import Loader from '../../Loader/Loader';

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    scrollViewContentContainer: {
        margin: 10,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 17.5,
        marginTop: 12,
        marginBottom: 25,
    },
    subjectView: {
        minHeight: 30,
        marginBottom: 5,
        backgroundColor: 'white',
        borderRadius: 4,
    },
    subject: {
        fontSize: 15,
        backgroundColor: '#FAFAFA',
        borderRadius: 4,
        marginBottom: 5,
        height: 30,
        padding: 5,
    },
    engagementForm: {
        marginBottom: 5,
        height: 250,
        backgroundColor: '#FAFAFA',
        borderRadius: 4,
    },
    saveButtonView: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginTop: 12,
    },
    saveButton: {
        width: 96,
        height: 36,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        borderWidth: 1,
        backgroundColor: constants.highlightColor,
        borderColor: constants.highlightColor,
    },
    saveButtonText: {
        fontSize: 14,
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
        <KeyboardAwareScrollView
            style={styles.keyboardAvoidingView}
            extraScrollHeight={
                props.engagementType === 'EngagementEmail' ? 75 : 72
            }
        >
            <View
                style={[
                    styles.scrollViewContentContainer,
                    toggleErrorModal
                        ? { backgroundColor: 'rgba(0, 0, 0, 0.25)' }
                        : {},
                ]}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{ flex: 1 }}>
                        <RelationshipListItem
                            relationship={props.relationship}
                            roundedCorners={true}
                        />
                        <Text style={styles.title}>
                            {getTitle(props.engagementType)}
                        </Text>
                        {props.engagementType === 'EngagementEmail' ? (
                            <View
                                style={[
                                    styles.subjectView,
                                    toggleErrorModal
                                        ? {
                                              backgroundColor:
                                                  'rgba(0, 0, 0, 0)',
                                          }
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
                                    /* onFocus={(event) => {
                                        const scrollResponder = scrollView?.getScrollResponder();
                                        const inputHandle = findNodeHandle(
                                            event.target
                                        );

                                        scrollResponder?.scrollResponderScrollNativeHandleToKeyboard(
                                            inputHandle, // The TextInput node handle
                                            0, // The scroll view's bottom "contentInset" (default 0)
                                            true // Prevent negative scrolling
                                        );
                                    }} */
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
                                placeholder={dataTypePlaceholder(
                                    props.engagementType
                                )}
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

                        <View style={styles.saveButtonView}>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={() => {
                                    createEngagement();
                                    toggleErrorModalHandler();
                                }}
                            >
                                <Text style={styles.saveButtonText}>SAVE</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ height: 200 }}></View>
                    </View>
                </TouchableWithoutFeedback>
            </View>

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
        </KeyboardAwareScrollView>
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
