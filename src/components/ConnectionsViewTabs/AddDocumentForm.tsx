import React, { useState } from 'react';
import {
    Text,
    ScrollView,
    View,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Image,
} from 'react-native';
// import SwitchToggle from 'react-native-switch-toggle';
import { getEngagements } from '../../store/actions/connectionData';
import constants from '../../helpers/constants';
import { connect } from 'react-redux';
import { postConnectionDocument } from '../../store/actions/connectionEngagements';
import convertMediaToAttachment from './convertMediaToAttachment';
import AttachmentIcon from './Attachment/AttachmentIcon.jsx';


const AddDocumentForm = (props) => {
    const [ title, setTitle ] = useState('');
    const [ category ] = useState(4); // 1-Education, 2-Friends, 3-Network, 4-Other, 5-Relatives, 6-Sports
    const [ notes, setNotes ] = useState('');
    const [ isPublic ] = useState(true);
    const [ media ] = useState(() => props.navigation.getParam('media'));
    const [ attachment ] = useState(() => {

        const attachment = convertMediaToAttachment(media);

        return attachment;

    });

    console.log(props.navigation);

    return (
        <ScrollView
            contentContainerStyle={styles.scrollView}
        >
            <View
                style={styles.view1}
            >
                <Text
                    style={styles.text1}
                >Add Document</Text>

            </View>
            {/* Image thumbnail / Doc Icon */}
            <View
                style={styles.view2}
            >
                {media.type === 'image'
                    ? <Image
                        source={{ uri: attachment.uri }}
                        style={{
                            width: '35%',
                            margin: '2%',
                        }}
                        resizeMode='contain'
                    />
                    : <AttachmentIcon attachment={attachment.name}/>
                }
                <View>
                    <Text>Document Type: {media.type}</Text>
                    <Text>File Extension: {attachment.ext}</Text>
                </View>
            </View>
            {/* TITLE BAR */}
            <View
                style={styles.view3}
            >
                {/* Title text */}
                <TextInput
                    onChangeText={(text: string) => {
                        setTitle(text);
                    }}
                    placeholder='TITLE'
                    placeholderTextColor={'#AAA9AD'}
                    style={styles.textInput1}
                    textAlignVertical='top'
                    name="title"
                    value={title}
                />
            </View>
            {/* NOTES BAR */}
            <View
                style={styles.view4}
            >
                <TextInput
                    onChangeText={(text: string) => {
                        setNotes(text);
                    }}
                    placeholder='NOTES'
                    placeholderTextColor={'#AAA9AD'}
                    style={styles.textInput2}
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
                style={styles.view5}
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
                <View style={{ width: '100%', backgroundColor: 'yellow' }}>
                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={() => {
                                props.postConnectionDocument(props.navigation.getParam('id'), title, category, isPublic, notes, attachment);
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

const styles = StyleSheet.create({
    saveButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 200,
        height: 50,
        // backgroundColor: 'lightgray',
        borderRadius: 50,
        borderWidth: 1,
        marginTop: 10,
        marginBottom: 20,
        backgroundColor: constants.highlightColor,
        borderColor: constants.highlightColor,
    },
    buttonText: {
        fontSize: 30,
        color: '#fff',
    },
    scrollView: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
    },
    view1: {
        width: '95%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        marginBottom: 13,
        backgroundColor: 'purple',
    },
    view2: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 100,
    },
    view3: {
        minHeight: 25,
        marginTop: 10,
        marginBottom: 5,
        width: '95%',
        backgroundColor: 'red',
        borderRadius: 4,
        padding: 2,
    },
    view4: {
        height: 150,
        marginTop: 5,
        marginBottom: 10,
        width: '95%',
        backgroundColor: 'red',
        borderRadius: 4,
        padding: 2,
    },
    view5: {
        width: '95%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    text1: { fontSize: 30,
        fontWeight: 'bold' },
    textInput1: {
        padding: 4,
        paddingRight: 80,
        fontSize: 15,
        backgroundColor: 'green',
    },
    textInput2: {
        paddingTop: 4,
        paddingLeft: 4,
        height: '100%',
        width: '100%',
        alignSelf: 'flex-start',
        fontSize: 15,
        backgroundColor: 'green',
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
