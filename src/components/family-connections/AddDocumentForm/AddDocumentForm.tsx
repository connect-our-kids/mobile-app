import React, { useState } from 'react';

import {
    Text,
    ScrollView,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

// import SwitchToggle from 'react-native-switch-toggle';

import AttachmentIcon from '../Attachment/AttachmentIcon.jsx';
import convertMediaToAttachment from './convertMediaToAttachment';

import { connect } from 'react-redux';
import { getEngagements } from '../../../store/actions/connectionData';
import { postConnectionDocument } from '../../../store/actions/connectionEngagements';

import styles from './AddDocumentForm.styles';
import constants from '../../../helpers/constants';

/**********************************************************/

export default connect(
    mapStateToProps,
    {
        postConnectionDocument,
        getEngagements,
    },
)(AddDocumentForm);

function mapStateToProps(state: Record<string, any>): Record<string, any> {
    const { accessToken } = state.auth;
    const { isLoadingDocs } = state.engagements;
    return {
        accessToken,
        isLoadingEngagements: state.engagements.isLoadingEngagements,
        engagementsError: state.engagements.engagementsError,
        isLoadingDocs,
    };
}

/**********************************************************/

function AddDocumentForm(props: Record<string, any>): JSX.Element {

    // /* DEV */ console.log(props.navigation);

    /* handle attachment data */
    const [ media ] = useState(() => props.navigation.getParam('media'));
    const [ attachment ] = useState(() => convertMediaToAttachment(media));

    /* form input values */
    const [ title, setTitle ] = useState('');
    const [ notes, setNotes ] = useState('');

    /* previous form input values -- preserved for backward compatibility */
    const [ category ] = useState(4); // 1-Education, 2-Friends, 3-Network, 4-Other, 5-Relatives, 6-Sports
    const [ isPublic ] = useState(true);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                style={[ styles.scrollView ]}
                contentContainerStyle={[ styles.container ]}
            >
                {/* HEADER */}
                <Text style={[ styles.content, styles.header ]}>
                    Add Document
                </Text>
                {/* ATTACHMENT INFO */}
                <View style={[ styles.content, styles.attachmentInfoContainer ]}>
                    {(media.type === 'image') ? (
                        <Image
                            source={{ uri: attachment.uri }}
                            resizeMode={'cover'}
                            style={[ styles.attachmentPreview ]}
                        />
                    ) : (
                        <AttachmentIcon
                            attachment={attachment.name}
                            size={80}
                        />
                    )}
                    <View style={[ styles.attachmentInfo ]}>
                        <Text style={[ styles.displayText ]}>
                            Document Type: {media.type}
                        </Text>
                        <Text style={[ styles.displayText ]}>
                            File Extension: {attachment.ext}
                        </Text>
                    </View>
                </View>
                {/* TITLE INPUT */}
                <TextInput
                    style={[ styles.content, styles.inputText ]}
                    value={title}
                    onChangeText={setTitle}
                    placeholder={'TITLE'}
                    placeholderTextColor={constants.textColor}
                    textAlignVertical={'center'}
                />
                {/* NOTES INPUT */}
                <TextInput
                    style={[ styles.content, styles.inputText ]}
                    value={notes}
                    onChangeText={setNotes}
                    multiline={true}
                    numberOfLines={4}
                    placeholder={'NOTES'}
                    placeholderTextColor={constants.textColor}
                    textAlignVertical={'top'}
                    returnKeyType={'default'}
                    enablesReturnKeyAutomatically={true}
                />
                {/* SAVE BUTTON */}
                <TouchableOpacity
                    style={[ styles.content, styles.saveButton ]}
                    onPress={(): void => {
                        props.postConnectionDocument(
                            props.navigation.getParam('id'),
                            title,
                            category,
                            isPublic,
                            notes,
                            attachment,
                        );
                        props.navigation.goBack();
                    }}
                >
                    <Text style={[ styles.saveButtonText ]}>
                        SAVE
                    </Text>
                </TouchableOpacity>
                {/* STAKEHOLDER HAS REQUESTED THE CODE BELOW BE PRESERVERED FOR FUTURE USE */}
                {/*
                <View
                    style={{
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between',
                        marginTop: 15,
                    }}
                >
                    <Text style={{ width: '75%', fontSize: 15 }}>This Information is Sensitive</Text>
                    <View>
                        <SwitchToggle
                            switchOn={!isPublic}
                            backgroundColorOn='#158FB4'
                            backgroundColorOff='#AAA9AD'
                            circleColorOn='#0F6580'
                            circleColorOff='#E5E4E2'
                            containerStyle={{
                                width: 49,
                                height: 20,
                                borderRadius: 16,
                                padding: 0.1,
                            }}
                            circleStyle={{ width: 28,
                                height: 28,
                                borderRadius: 15,
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 1,
                                    height: 3,
                                },
                                shadowOpacity: 0.23,
                                shadowRadius: 2.62,
                                elevation: 4 }}
                            onPress={() => setIsPublic(!isPublic)}
                        />
                    </View>
                </View>
                */}
            </ScrollView>
        </KeyboardAvoidingView>
    );

}
