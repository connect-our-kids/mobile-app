import React from 'react';
import { Alert } from 'react-native';
import Button from './Button.jsx';
import TakePhotoIcon from './TakePhotoIcon.jsx';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

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
        const result = await ImagePicker.launchCameraAsync({
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
