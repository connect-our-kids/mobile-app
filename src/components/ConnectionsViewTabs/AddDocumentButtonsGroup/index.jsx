import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import PickFileButton from './PickFileButton.jsx';
import PickPhotoButton from './PickPhotoButton.jsx';
import TakePhotoButton from './TakePhotoButton.jsx';

/**********************************************************/

export default function AddDocumentButtonsGroup(props) {

    const [ document, setDocument ] = useState(null);

    return (
        <View>
            <PickFileButton setDocument={setDocument} />
            <PickPhotoButton setDocument={setDocument} />
            <TakePhotoButton setDocument={setDocument} />
        </View>
    );
}
