import React from 'react';
import Button from './Button';
import PickFileIcon from './PickFileIcon';
import * as DocumentPicker from 'expo-document-picker';
import PickFileLabel from './PickFileLabel';
import { DocumentInfo } from './types';

export default function PickFileButton({
    afterAccept,
}: {
    afterAccept: (document: DocumentInfo) => void;
}) {
    function pickFile() {
        DocumentPicker.getDocumentAsync({
            /* MIME type */
            type: '*/*',
            /* whether to cache file for other expo APIs to use */
            copyToCacheDirectory: false,
            /* whether to let user select multiple files */
            multiple: false,
        })
            .then((file) => {
                if (file.type === 'success') {
                    afterAccept(file);
                }
            })
            .catch((error) => {
                console.log('--- There was a problem selecting a file. ---');
                console.log(error);
            });
    }

    return (
        <Button onPress={pickFile} /*testID="pick-file-button"*/>
            <PickFileIcon />
            <PickFileLabel />
        </Button>
    );
}
