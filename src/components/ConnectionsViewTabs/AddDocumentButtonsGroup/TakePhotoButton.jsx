import React from 'react';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Alert } from 'react-native';
import Button from './Button.jsx';
import TakePhotoIcon from './TakePhotoIcon.jsx';
import convertPhotoToAttachment from './convertPhotoToAttachment';

/**********************************************************/

export default function TakePhotoButton({ afterAccept }) {


    async function getPermissions() {

        let hasPermissions = false;

        if (Constants.platform.ios || Constants.platform.android) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA);
            hasPermissions = status === 'granted';
        }

        return hasPermissions;

    }

    async function takePhoto() {

        const media = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
        });

        if (!media.cancelled) {
            afterAccept(convertPhotoToAttachment(media));
        }

        return;

    }

    async function onPress() {

        const hasPermissions = await getPermissions();

        if (hasPermissions) {
            await takePhoto();
        }
        else {
            Alert.alert('Sorry, we need camera permissions to make this work!');
        }

    }

    return (
        <Button onPress={onPress}>
            <TakePhotoIcon/>
        </Button>
    );
}
