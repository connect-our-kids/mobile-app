import React from 'react';
import Button from './Button.jsx';
import PickFileIcon from './PickFileIcon.jsx';
import * as DocumentPicker from 'expo-document-picker';

/**********************************************************/

export default function PickFileButton({ setDocument }) {

    function pickFile() {
        DocumentPicker
            .getDocumentAsync({
                /* MIME type */
                type: '*/*',
                /* whether to cache file for other expo APIs to use */
                copyToCacheDirectory: false,
                /* whether to let user select multiple files */
                multiple: false,
            })
            .then ((re) => {
                setDocument(re);
            })
            .catch ((error) => {
                console.error('--- There was a problem selecting a file. ---');
                console.log(error);
            });
    }

    return (
        <Button onPress={pickFile}>
            <PickFileIcon/>
        </Button>
    );
}
