import React, { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

/**********************************************************/

export default function AddDocPicker(props) {

    const [ file, setFile ] = useState({});

    async function pickFile() {
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
                setFile(re);
            })
            .catch ((error) => {
                console.error('--- There was a problem selecting a file. ---');
                console.log(error);
            });
    }

    return (
        <View style={styles.MainContainer}>

            <Text style={styles.text}>
                File Name: {file.name ? file.name : ''}
            </Text>

            <TouchableOpacity
                activeOpacity={0.5}
                style={styles.button}
                onPress={pickFile}
            >
                <Text style={styles.buttonText}>
                    Click Here To Pick File
                </Text>
            </TouchableOpacity>

        </View>
    );

}

/**********************************************************/

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        justifyContent: 'center',
    },

    button: {
        width: '100%',
        backgroundColor: '#0091EA',
        borderRadius: 9,
    },

    buttonText: {
        color: '#fff',
        fontSize: 21,
        padding: 10,
        textAlign: 'center',
    },

    text: {
        color: '#000',
        fontSize: 16,
        padding: 10,
        textAlign: 'left',
    },
});
