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
            <PickFileButton/>
            <PickPhotoButton/>
            <TakePhotoButton/>
        </View>
    );
}
