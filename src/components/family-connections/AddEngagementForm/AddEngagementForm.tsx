import React, { useState } from 'react';
import {
    Text,
    ScrollView,
    View,
    TouchableOpacity,
    StyleSheet,
    TextInput,
} from 'react-native';
import constants from '../../../helpers/constants';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { RootState } from '../../../store/reducers';
import {
    createNoteEngagement,
    createCallEngagement,
    createEmailEngagement,
} from '../../../store/actions';

const styles = StyleSheet.create({
    formContainer: {
        width: '95%',
        // padding: 4,
        marginTop: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    saveButton: {
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
    buttonText: {
        fontSize: 14,
        textTransform: 'uppercase',
        color: '#fff',
    },
});

const getTitle = (dataType: AddEngagementFormEngagementTypes): string => {
    switch (dataType) {
        case 'EngagementCall':
            return 'LOG CALL';
        case 'EngagementEmail':
            return 'LOG Email';
        case 'EngagementNote':
            return 'ADD NOTE';
        default:
            throw new Error(`Unsupported engagement type: ${dataType}`);
    }
};

const dataTypePlaceholder = (
    dataType: AddEngagementFormEngagementTypes
): string => {
    if (dataType === 'EngagementEmail') {
        return 'ADD EMAIL';
    } else {
        return 'ADD NOTE';
    }
};

interface StateProps {
    caseId: number;
    relationshipId: number;
    engagementType: AddEngagementFormEngagementTypes;
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
    caseId: number;
    engagementType: AddEngagementFormEngagementTypes;
}

const AddEngagementForm = (props: Props) => {
    const [note, setNote] = useState('');
    const [subject, setSubject] = useState('');
    const [isPublic] = useState(true);

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
            contentContainerStyle={{
                width: '100%',
                justifyContent: 'flex-start',
                alignItems: 'center',
                backgroundColor: '#E5E4E2',
                height: '100%',
            }}
        >
            <View style={styles.formContainer}>
                <View
                    style={{
                        width: '100%',
                        alignItems: 'flex-start',
                        marginTop: 7,
                        marginBottom: 13,
                    }}
                >
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                        {getTitle(props.engagementType)}
                    </Text>
                </View>
                {props.engagementType === 'EngagementEmail' ? (
                    <View
                        style={{
                            minHeight: 25,
                            marginBottom: 5,
                            width: '100%',
                            backgroundColor: 'white',
                            borderRadius: 4,
                        }}
                    >
                        <TextInput
                            onChangeText={(text) => {
                                setSubject(text);
                            }}
                            placeholder="SUBJECT"
                            placeholderTextColor={'#AAA9AD'}
                            style={{ padding: 4, fontSize: 15 }}
                            textAlignVertical="top"
                            value={subject}
                        />
                    </View>
                ) : null}
                <View
                    style={{
                        height: 165,
                        marginBottom: 5,
                        width: '100%',
                        backgroundColor: 'white',
                        borderRadius: 4,
                    }}
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
                            padding: 4,
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
                        marginTop: 20,
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
                            marginTop: 20,
                        }}
                    >
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={() => {
                                createEngagement();
                                props.navigation.goBack();
                            }}
                        >
                            <Text style={styles.buttonText}>SAVE</Text>
                        </TouchableOpacity>
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

    // passed in parameter on navigate
    const engagementType = ownProps.navigation.getParam(
        'engagementType'
    ) as AddEngagementFormEngagementTypes;

    // this component only supports the following types
    if (
        engagementType !== 'EngagementCall' &&
        engagementType !== 'EngagementNote' &&
        engagementType !== 'EngagementEmail'
    ) {
        throw new Error(`Unsupported engagement type: ${engagementType}`);
    }

    const caseId = state.case.results?.details?.id;
    if (!caseId) {
        throw new Error(`No case id specified`);
    }

    return {
        caseId,
        relationshipId,
        engagementType,
    };
};

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, {
    createNoteEngagement,
    createCallEngagement,
    createEmailEngagement,
})(AddEngagementForm);
