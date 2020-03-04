import React from 'react';
import Button from './Button.jsx';
import { Alert } from 'react-native';
import PickPhotoIcon from './PickPhotoIcon.jsx';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

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
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
        });

        if (!result.cancelled) {
            afterAccept(result.uri);
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
