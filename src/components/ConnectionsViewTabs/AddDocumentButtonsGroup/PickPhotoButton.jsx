import React from 'react';
import Button from './Button.jsx';
import PickPhotoIcon from './PickPhotoIcon.jsx';
import * as ImagePicker from 'expo-image-picker';

/**********************************************************/

export default function PickPhotoButton({ setDocument }) {

    async function pickPhoto() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
        });

        if (!result.cancelled) {
            setDocument(result.uri);
        }

        return;
    }

    return (
        <Button onPress={pickPhoto}>
            <PickPhotoIcon/>
        </Button>
    );
}
