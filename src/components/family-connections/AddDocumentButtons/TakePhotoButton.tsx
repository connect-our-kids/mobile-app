import React from 'react';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Alert } from 'react-native';
import Button from './Button';
import TakePhotoIcon from './TakePhotoIcon';
import TakePhotoLabel from './TakePhotoLabel';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';

export default function TakePhotoButton({
    afterAccept,
}: {
    afterAccept: (image: ImageInfo) => void;
}) {
    async function getPermissions() {
        let hasPermissions = false;

        if (Constants.platform?.ios || Constants.platform?.android) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA);
            hasPermissions = status === 'granted';
        }

        return hasPermissions;
    }

    async function takePhoto() {
        const photo = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
        });

        if (!photo.cancelled) {
            afterAccept(photo);
        }

        return;
    }

    async function onPress() {
        const hasPermissions = await getPermissions();

        if (hasPermissions) {
            await takePhoto();
        } else {
            Alert.alert('Sorry, we need camera permissions to make this work!');
        }
    }

    return (
        <Button onPress={onPress} /*testID="take-photo-button"*/>
            <TakePhotoIcon />
            <TakePhotoLabel />
        </Button>
    );
}
