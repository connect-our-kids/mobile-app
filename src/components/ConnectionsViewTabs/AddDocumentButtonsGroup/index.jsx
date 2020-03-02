import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import constants from '../../../helpers/constants';

/**********************************************************/

export default function AddDocumentButtonsGroup(props) {

    const [ document, setDocument ] = useState(null);

    function pickFile() {
        return;
    }
    function pickPhoto() {
        return;
    }
    function takePhoto() {
        return;
    }

    return (
        <View>
            <Button
                iconName={'file'}
                onPress={pickFile}
            />
            <Button
                iconName={'photo-library'}
                onPress={pickPhoto}
            />
            <Button
                iconName={'photo-camera'}
                onPress={takePhoto}
            />
        </View>
    );
}

function Button({ onPress, iconName, ...rest }) {
    return (
        <TouchableOpacity
            style={styles.imageButton}
            onPress={onPress}
        >
            <MaterialIcons
                name={iconName}
                size={75}
                color={constants.highlightColor}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    viewportContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start',
        borderRadius: 4,
    },
    image: {
        width: 125,
        height: 125,
        marginBottom: 4,
        marginTop: 4,
    },
    buttonImageContainer: { width: '95%' },
    imageButton: { width: '50%' },

});
