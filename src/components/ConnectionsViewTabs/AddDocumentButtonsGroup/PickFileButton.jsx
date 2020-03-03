import React from 'react';
import Button from './Button.jsx';
import PickFileIcon from './PickFileIcon.jsx';

/**********************************************************/

export default function PickFileButton({ setDocument }) {

    function pickFile() {
        return;
    }

    return (
        <Button onPress={pickFile}>
            <PickFileIcon/>
        </Button>
    );
}
