import React from 'react';
import Button from './Button.jsx';
import TakePhotoIcon from './TakePhotoIcon.jsx';

/**********************************************************/

export default function TakePhotoButton({ setDocument }) {

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
