import React from 'react';
import { View } from 'react-native';
import PickFileButton from './PickFileButton';
import PickPhotoButton from './PickPhotoButton';
import TakePhotoButton from './TakePhotoButton';
import styles from './styles';

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
