import React from 'react';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Alert, Text } from 'react-native';
import Button from './Button.jsx';
import PickPhotoIcon from './PickPhotoIcon.jsx';
import convertPhotoToMedia from './convertPhotoToMedia';

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

        const photo = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
        });

        if (!photo.cancelled) {
            afterAccept(convertPhotoToMedia(photo));
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
        <Button onPress={onPress} testID="pick-photo-button">
            <PickPhotoIcon/>
            <Text>UPLOAD PHOTO</Text>
        </Button>
    );
}
