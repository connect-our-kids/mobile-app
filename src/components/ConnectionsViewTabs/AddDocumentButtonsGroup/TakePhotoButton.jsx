import React from 'react';
import Button from './Button.jsx';
import TakePhotoIcon from './TakePhotoIcon.jsx';

/**********************************************************/

export default function TakePhotoButton({ setDocument }) {


   async function getPermissions(){
        if (Constants.platform.ios || Constants.platform.android) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL || Permissions.CAMERA);
            const hasPermission = status === 'granted';
            if (!hasPermission) {
                Alert.alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
        return hasPermission;
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
