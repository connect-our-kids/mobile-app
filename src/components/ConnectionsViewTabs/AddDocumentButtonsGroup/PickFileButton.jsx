import React from 'react';
import Button from './Button.jsx';
import PickFileIcon from './PickFileIcon.jsx';
import * as DocumentPicker from 'expo-document-picker';
import convertFileToAttachment from './convertFileToAttachment';

/**********************************************************/

export default function PickFileButton({ afterAccept }) {

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
            .then ((media) => {

                if (media.type === 'success') {
                    afterAccept(convertFileToAttachment(media));
                }

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
