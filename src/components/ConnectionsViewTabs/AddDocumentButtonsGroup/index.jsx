import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import PickFileButton from './PickFileButton.jsx';
import PickPhotoButton from './PickPhotoButton.jsx';
import TakePhotoButton from './TakePhotoButton.jsx';
import styles from './styles.js';

/**********************************************************/

export default function AddDocumentButtonsGroup({ afterAccept }) {

    const [ document, setDocument ] = useState(null);

    return (
        <View style={styles.buttonsGroup}>
            <PickFileButton setDocument={setDocument} afterAccept={afterAccept}/>
            <PickPhotoButton setDocument={setDocument} afterAccept={afterAccept}/>
            <TakePhotoButton setDocument={setDocument} afterAccept={afterAccept}/>
        </View>
    );
}
