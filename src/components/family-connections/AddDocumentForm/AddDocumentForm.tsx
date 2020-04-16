import React, { useState } from 'react';

import {
    Text,
    ScrollView,
    View,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

import AttachmentIcon from '../Attachment/AttachmentIcon';
import { connect } from 'react-redux';

import styles from './AddDocumentForm.styles';
import constants from '../../../helpers/constants';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { RootState } from '../../../store/reducers';
import { createDocEngagement } from '../../../store/actions';
import { Media, Attachment } from './types';
import convertMediaToAttachment from './convertMediaToAttachment';

interface StateProps {
    caseId: number;
    relationshipId?: number;
    media: Media;
    attachment: Attachment;
}

interface DispatchProps {
    createDocEngagement: typeof createDocEngagement;
}

type Navigation = NavigationScreenProp<NavigationState>;

interface OwnProps {
    navigation: Navigation;
}

type Props = StateProps & DispatchProps & OwnProps;

function AddDocumentForm(props: Props): JSX.Element {
    /* handle attachment data */

    /* form input values */
    const [title, setTitle] = useState('');
    const [note, setNote] = useState('');

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                style={[styles.scrollView]}
                contentContainerStyle={[styles.container]}
            >
                {/* HEADER */}
                <Text style={[styles.content, styles.header]}>
                    Add Document
                </Text>
                {/* ATTACHMENT INFO */}
                <View style={[styles.content, styles.attachmentInfoContainer]}>
                    {props.media.type === 'image' ? (
                        <AttachmentIcon
                            attachment={props.attachment.name}
                            size={80}
                        />
                    ) : (
                        <AttachmentIcon
                            attachment={props.attachment.name}
                            size={80}
                        />
                    )}
                    <View style={[styles.attachmentInfo]}>
                        <Text style={[styles.displayText]}>
                            Document Type: {props.media.type}
                        </Text>
                        <Text style={[styles.displayText]}>
                            File Extension: {props.attachment.ext}
                        </Text>
                    </View>
                </View>
                {/* TITLE INPUT */}
                <TextInput
                    style={[styles.content, styles.inputText]}
                    value={title}
                    onChangeText={setTitle}
                    placeholder={'TITLE'}
                    placeholderTextColor={constants.inputPlaceholderTextColor}
                    textAlignVertical={'center'}
                />
                {/* NOTES INPUT */}
                <TextInput
                    style={[styles.content, styles.inputText]}
                    value={note}
                    onChangeText={setNote}
                    multiline={true}
                    numberOfLines={4}
                    placeholder={'NOTES'}
                    placeholderTextColor={constants.inputPlaceholderTextColor}
                    textAlignVertical={'top'}
                    returnKeyType={'default'}
                    enablesReturnKeyAutomatically={true}
                />
                {/* SAVE BUTTON */}
                <TouchableOpacity
                    style={[styles.content, styles.saveButton]}
                    onPress={(): void => {
                        props.createDocEngagement(props.caseId, {
                            relationshipId: props.relationshipId,
                            title,
                            isPublic: true,
                            note,
                            attachment: props.media,
                        });
                        props.navigation.goBack();
                    }}
                >
                    <Text style={[styles.saveButtonText]}>SAVE</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

function mapStateToProps(state: RootState, ownProps: OwnProps) {
    const relationshipId = state.relationship?.results?.id;
    const caseId = state.case.results?.details?.id;
    if (!caseId) {
        throw new Error('Case id not specified');
    }

    const media = ownProps.navigation.getParam('media') as Media;
    const attachment = convertMediaToAttachment(media);
    return {
        caseId,
        relationshipId,
        media,
        attachment,
    };
}

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, {
    createDocEngagement,
})(AddDocumentForm);
