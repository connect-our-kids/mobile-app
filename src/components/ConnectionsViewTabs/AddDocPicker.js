import React, { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';


export default function AddDocPicker(props) {
    const [ file, setFile ] = useState({});

    async function pickFile() {
        try {
            const response = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: false,
                multiple: false,
            });

            setFile(response);
        }
        catch (err) {
            console.log(err);
        }
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

// class App extends Component {

//     constructor(props) {
//         super(props);
//         this.state = {
//             singleFileOBJ: '',
//         };
//     }

//     async SingleFilePicker() {
//         try {
//             const res = await DocumentPicker.getDocumentAsync({
//                 type: '*/* ',
//                 copyToCacheDirectory: false,
//                 multiple: false,
//             });

//             this.setState({ singleFileOBJ: res });

//         }
//         catch (err) {
//             console.log(err);
//         }
//     }

//     render() {
//         return (
//             <View style={styles.MainContainer}>

//                 <Text style={styles.text}>
//         File Name: {this.state.singleFileOBJ.name ? this.state.singleFileOBJ.name : ''}
//                 </Text>

//                 <TouchableOpacity
//                     activeOpacity={0.5}
//                     style={styles.button}
//                     onPress={this.SingleFilePicker.bind(this)}>
//                     <Text style={styles.buttonText}>
//         Click Here To Pick File
//                     </Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     }
// }

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
