import React from 'react';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Alert } from 'react-native';
import Button from './Button.jsx';
import PickPhotoIcon from './PickPhotoIcon.jsx';
import convertPhotoToAttachment from './convertPhotoToAttachment';

/**********************************************************/

export default function PickPhotoButton({ afterAccept }) {

    async function getPermissions() {

        let hasPermissions = false;

        if (Constants.platform.ios || Constants.platform.android) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            hasPermissions = status === 'granted';
        }

        return hasPermissions;

    }

    async function pickPhoto() {

        const media = await ImagePicker.launchImageLibraryAsync({
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
            await pickPhoto();
        }
        else {
            Alert.alert('Sorry, we need camera roll permissions to make this work!');
        }

    }

    return (
        <Button onPress={onPress}>
            <PickPhotoIcon/>
        </Button>
    );
}
