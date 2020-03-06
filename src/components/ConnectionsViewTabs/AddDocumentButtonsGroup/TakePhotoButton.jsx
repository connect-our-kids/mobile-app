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
        const media = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
        });

        /*
        typeof media = {
            cancelled  : boolean,
            uri        : string,
            type       : 'image' | 'video'
            width      : number,
            height     : number,
            base64    ?: boolean,
            exif      ?: object,
        }
        */

        if (!media.cancelled) {
            afterAccept({
                type: media.type,
                uri: media.uri,
                name: (media.uri).replace(/^.*[\\/]/, ''),
                width: media.width,
                height: media.height,
            });
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
