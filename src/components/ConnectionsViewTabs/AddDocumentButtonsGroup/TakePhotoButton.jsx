import React from 'react';
import Button from './Button.jsx';
import TakePhotoIcon from './TakePhotoIcon.jsx';

/**********************************************************/

export default function TakePhotoButton({ setDocument }) {

    async function getPermissions() {
        let hasPermissions = false;
        if (Constants.platform.ios || Constants.platform.android) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL || Permissions.CAMERA);
            hasPermissions = status === 'granted';
            if (!hasPermissions) {
                Alert.alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
        return hasPermissions;
    }

    async function takePhoto() {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
        });

        if (!result.cancelled) {
            setDocument(result.uri);
        }

        return;
    }

    return (
        <Button onPress={takePhoto}>
            <TakePhotoIcon/>
        </Button>
    );
}
