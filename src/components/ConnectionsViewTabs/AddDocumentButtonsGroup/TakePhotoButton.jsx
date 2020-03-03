import React from 'react';
import Button from './Button.jsx';
import TakePhotoIcon from './TakePhotoIcon.jsx';

/**********************************************************/

export default function TakePhotoButton() {

    function takePhoto() {
        return;
    }

    return (
        <Button onPress={takePhoto}>
            <TakePhotoIcon/>
        </Button>
    );
}
