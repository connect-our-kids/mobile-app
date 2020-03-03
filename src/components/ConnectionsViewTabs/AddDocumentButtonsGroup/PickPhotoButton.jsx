import React from 'react';
import Button from './Button.jsx';
import PickPhotoIcon from './PickPhotoIcon.jsx';

/**********************************************************/

export default function PickPhotoButton({ setDocument }) {

    function pickPhoto() {
        return;
    }

    return (
        <Button onPress={pickPhoto}>
            <PickPhotoIcon/>
        </Button>
    );
}
