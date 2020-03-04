import React from 'react';
import { View } from 'react-native';
import PickFileButton from './PickFileButton.jsx';
import PickPhotoButton from './PickPhotoButton.jsx';
import TakePhotoButton from './TakePhotoButton.jsx';
import styles from './styles.js';

/**********************************************************/

export default function AddDocumentButtonsGroup({ afterAccept }) {
    return (
        <View style={styles.buttonsGroup}>
            <PickFileButton afterAccept={afterAccept}/>
            <PickPhotoButton afterAccept={afterAccept}/>
            <TakePhotoButton afterAccept={afterAccept}/>
        </View>
    );
}
