import React from 'react';
import Button from './Button.jsx';
import PickFileIcon from './PickFileIcon.jsx';

/**********************************************************/

export default function PickFileButton() {

    function pickFile() {
        return;
    }

    return (
        <Button onPress={pickFile}>
            <PickFileIcon/>
        </Button>
    );
}
