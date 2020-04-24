import React, { useState } from 'react';
import mime from 'mime';
import {
    Text,
    ScrollView,
    View,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Image,
} from 'react-native';

import AttachmentIcon from '../Attachment/AttachmentIcon';
import { connect } from 'react-redux';

import styles from './AddDocumentForm.styles';
import constants from '../../../helpers/constants';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { RootState } from '../../../store/reducers';
import { createDocEngagement } from '../../../store/actions';
import { DocumentInfo } from '../AddDocumentButtons/types';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import { ReactNativeFile } from 'apollo-upload-client';

interface StateProps {
    caseId: number;
    relationshipId?: number;
    image?: ImageInfo; // either this or document will be specified, not both
    document?: DocumentInfo; // either this or image will be specified, not both
    fileName: string;
    fileType: string;
    size?: string;
    attachment: ReactNativeFile;
}

interface DispatchProps {
    createDocEngagement: typeof createDocEngagement;
}

type Navigation = NavigationScreenProp<NavigationState>;

interface OwnProps {
    navigation: Navigation;
}

type Props = StateProps & DispatchProps & OwnProps;

function humanFileSize(bytes: number, si: boolean): string {
    const thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    const units = si
        ? ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    const digitsAfterDecimal = units[u].startsWith('K') ? 0 : 1;
    return bytes.toFixed(digitsAfterDecimal) + ' ' + units[u];
}

function AddDocumentForm(props: Props): JSX.Element {
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
                    {props.image ? (
                        <Image
                            source={{ uri: props.image.uri }}
                            resizeMode={'cover'}
                            style={[styles.attachmentPreview]}
                        />
                    ) : (
                        <AttachmentIcon
                            attachment={props.attachment.name}
                            size={80}
                        />
                    )}
                    <View style={[styles.attachmentInfo]}>
                        <Text style={[styles.displayText]}>
                            Name: {props.fileName}
                        </Text>
                        <Text style={[styles.displayText]}>
                            Type: {props.fileType}
                        </Text>
                        {props.size ? (
                            <Text style={[styles.displayText]}>
                                Size: {props.size}
                            </Text>
                        ) : null}
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
                            attachment: props.attachment,
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

    const isImageInfo = (media: unknown): media is ImageInfo =>
        (media as ImageInfo)?.width !== undefined;

    const isDocumentInfo = (media: unknown): media is DocumentInfo =>
        (media as DocumentInfo)?.size !== undefined;

    const input = ownProps.navigation.getParam('media') as
        | ImageInfo
        | DocumentInfo;

    const image = isImageInfo(input) ? input : undefined;
    const document = isDocumentInfo(input) ? input : undefined;

    const fileName = isImageInfo(input)
        ? input.uri.split('/').pop() ?? 'Unknown'
        : input.name;

    const size = document ? humanFileSize(document.size, true) : undefined;
    const fileType = mime.getType(input.uri) ?? 'Unknown';

    const attachment = new ReactNativeFile({
        uri: input.uri,
        type: fileType,
        name: fileName,
    });

    return {
        caseId,
        relationshipId,
        image,
        document,
        fileName,
        fileType,
        size,
        attachment,
    };
}

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, {
    createDocEngagement,
})(AddDocumentForm);
