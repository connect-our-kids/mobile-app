import React, { useState, useEffect } from 'react';
import {
    Image,
    Text,
    ScrollView,
    View,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { getEngagements } from '../../store/actions/connectionData';
import constants from '../../helpers/constants';
import { connect } from 'react-redux';
import { postConnectionDocument } from '../../store/actions/connectionEngagements';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { MaterialIcons } from '@expo/vector-icons';

const AddImage = (props) => {
    const [ title, setTitle ] = useState('');
    // const [ category, setCategory ] = useState(4); // 1-Education, 2-Friends, 3-Network, 4-Other, 5-Relatives, 6-Sports
    // const [ tags, setTags ] = useState([]);
    // const [ notes, setNotes ] = useState('');
    const [ attachment, setAttachment ] = useState(null);
    // const [ isPublic, setIsPublic ] = useState(true);

    // set type of engagement
    useEffect(() => {
        getPermissionAsync();
    }, [ false ]);

    // permissions for the camera && camera roll
    const getPermissionAsync = async () => {
        if (Constants.platform.ios || Constants.platform.android) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL || Permissions.CAMERA);
            if (status !== 'granted') {
                Alert.alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    };

    //
    const _pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            // aspect: [ 4, 3 ],
            quality: 1,
        });

        if (!result.cancelled) {
            setAttachment(result.uri);
        }

        return;
    };

    // taking image function
    const takeImage = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.cancelled) {
            setAttachment(result.uri);
        }

        return;
    };

    return (
        <ScrollView
            style={styles.viewportContainer}>
            <View style={styles.buttonImageContainer}>
                <TouchableOpacity
                    style={styles.imageButton}
                    onPress={() => {
                        _pickImage();
                    }}
                >
                    {attachment
                        ? <Image
                            source={{ uri: attachment }}
                            style={styles.image}
                        />
                        : <MaterialIcons
                            name="photo-library"
                            size={75}
                            color={constants.highlightColor}
                            // onPress={() => {
                            //   props.closeForm()
                            // }}
                        />
                    }
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.imageButton}
                    onPress={() => {
                        takeImage();
                    }}
                >
                    {attachment
                        ? <Image
                            source={{ uri: attachment }}
                            style={styles.image}
                        />
                        : <MaterialIcons
                            name="photo-camera"
                            size={75}
                            color={constants.highlightColor}
                            // onPress={() => {
                            //   props.closeForm()
                            // }}
                        />
                    }
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    viewportContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start',
        borderRadius: 4,
    },
    image: {
        width: 125,
        height: 125,
        marginBottom: 4,
        marginTop: 4,
    },
    buttonImageContainer: { width: '95%' },
    imageButton: { width: '50%' },

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
)(AddImage);
