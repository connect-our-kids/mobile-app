import React, { useState } from 'react';

import {
    Text,
    ScrollView,
    View,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Image,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

// import SwitchToggle from 'react-native-switch-toggle';

import AttachmentIcon from './Attachment/AttachmentIcon.jsx';
import convertMediaToAttachment from './convertMediaToAttachment';

import constants from '../../helpers/constants';
import { connect } from 'react-redux';
import { getEngagements } from '../../store/actions/connectionData';
import { postConnectionDocument } from '../../store/actions/connectionEngagements';

/**********************************************************/

const AddDocumentForm = (props) => {

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
            // style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={[ styles.scrollView, styles.container ]}
            >
                <View
                    style={[ styles.content, styles.displayText, styles.view1 ]}
                >
                    <Text
                        style={styles.text1}
                    >Add Document</Text>

                </View>
                {/* Image thumbnail / Doc Icon */}
                <View
                    style={[ styles.content, styles.displayText, styles.view2 ]}
                >
                    {media.type === 'image'
                        ? <Image
                            source={{ uri: attachment.uri }}
                            style={styles.image1}
                            resizeMode={'cover'}
                        />
                        : <AttachmentIcon attachment={attachment.name} size={80}/>
                    }
                    <View>
                        <Text>Document Type: {media.type}</Text>
                        <Text>File Extension: {attachment.ext}</Text>
                    </View>
                </View>
                {/* TITLE BAR */}
                <View
                    style={[ styles.content, styles.view3 ]}
                >
                    {/* Title text */}
                    <TextInput
                        onChangeText={(text: string) => {
                            setTitle(text);
                        }}
                        placeholder='TITLE'
                        placeholderTextColor={'#AAA9AD'}
                        style={[ styles.inputText, styles.textInput1 ]}
                        textAlignVertical='top'
                        name="title"
                        value={title}
                    />
                </View>
                {/* NOTES BAR */}
                <View
                    style={[ styles.content, styles.view4 ]}
                >
                    <TextInput
                        onChangeText={(text: string) => {
                            setNotes(text);
                        }}
                        placeholder='NOTES'
                        placeholderTextColor={'#AAA9AD'}
                        style={[ styles.inputText, styles.textInput2 ]}
                        textAlignVertical='top'
                        name="notes"
                        value={notes}
                        multiline
                        numberOfLines={4}
                        returnKeyType="default"
                        enablesReturnKeyAutomatically
                    />
                </View>
                <View
                    style={[ styles.content, styles.view5 ]}
                >
                    {/* STAKEHOLDER HAS REQUESTED THE CODE BELOW BE PRESERVERED FOR FUTURE USE */}
                    {/* <View
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
                        </View> */}
                    {/* <View style={{ width: '100%', backgroundColor: 'yellow' }}>
                    <View style={{ alignItems: 'center', marginTop: 10 }}> */}
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={() => {
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
                        <Text style={styles.buttonText}>SAVE</Text>
                    </TouchableOpacity>
                    {/* </View>
                </View> */}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );

};

const styles = StyleSheet.create({

    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },

    content: {
        margin: 8,
    },

    displayText: {
        padding: 2,
    },

    inputText: {
        padding: 8,
        borderRadius: 4,
    },

    saveButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: constants.highlightColor,
        backgroundColor: constants.highlightColor,
    },

    buttonText: {
        fontSize: 30,
        color: constants.iconColor,
    },

    scrollView: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: constants.backgroundColor,
    },

    view1: {
        width: '95%',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },

    view2: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        height: '35%',
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: constants.borderColor,
    },

    view3: {
        minHeight: 25,
        width: '95%',
        backgroundColor: constants.borderColor,
        borderRadius: 4,
    },

    view4: {
        height: 150,
        width: '95%',
        backgroundColor: constants.borderColor,
        borderRadius: 4,
    },

    view5: {
        width: '95%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },

    text1: {
        fontSize: 30,
        fontWeight: 'bold',
    },

    textInput1: {
        fontSize: 15,
        backgroundColor: constants.inputBackgroundColor,
    },

    textInput2: {
        height: '100%',
        width: '100%',
        alignSelf: 'flex-start',
        fontSize: 15,
        backgroundColor: constants.inputBackgroundColor,
    },

    image1: {
        width: '35%',
        height: '90%',
    },

});

const mapStateToProps = (state) => {
    const { accessToken } = state.auth;
    const { isLoadingDocs } = state.engagements;
    return {
        accessToken,
        isLoadingEngagements: state.engagements.isLoadingEngagements,
        engagementsError: state.engagements.engagementsError,
        isLoadingDocs,
    };
};

export default connect(
    mapStateToProps, {
        postConnectionDocument,
        getEngagements,
    },
)(AddDocumentForm);
