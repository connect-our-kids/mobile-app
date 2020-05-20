// Discontinued AddCaseScreen. Occasional errors referencing import semicolons. Not connected to axios
import React, { useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
    TextInput,
    Keyboard,
} from 'react-native';
import { Button } from 'react-native-elements';
import constants from '../helpers/constants';

export default function AddCaseScreen(props: {
    setAddCaseModalVisible: (arg0: boolean) => void;
    addCaseModalVisible: boolean;
}) {
    const styles = StyleSheet.create({
        selected: {
            backgroundColor: constants.highlightColor,
        },
        textInput: {
            padding: 10,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: `${constants.highlightColor}`,
            color: `${constants.highlightColor}`,
        },
        text: {
            alignContent: 'center',
            marginVertical: 60,
            marginHorizontal: 30,
            fontSize: 80,
            fontWeight: 'bold',
            paddingTop: -10,
        },
    });

    const [caseInput, setCaseInput] = useState({
        first_name: '',
        last_name: '',
    });

    // handle the changes to the form
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleChange(e: any) {
        setCaseInput({ ...caseInput, [e.target.name]: e.target.value });
    }

    return (
        <View>
            <View
                style={{
                    marginVertical: 200,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text>First Name</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="First Name"
                    onBlur={Keyboard.dismiss}
                    value={caseInput.first_name}
                    onChangeText={handleChange}
                />
                <Text>Last Name</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Last Name"
                    onBlur={Keyboard.dismiss}
                    value={caseInput.last_name}
                    onChangeText={handleChange}
                />
                <TouchableOpacity>
                    <Button
                        style={(styles.selected, styles.text)}
                        title="Confirm"
                        onPress={() => {
                            props.setAddCaseModalVisible(
                                !props.addCaseModalVisible
                            );
                        }}
                    />
                </TouchableOpacity>
            </View>
            <TouchableHighlight
                underlayColor="lightgray"
                style={{ alignItems: 'center' }}
                onPress={() => {
                    props.setAddCaseModalVisible(false);
                }}
            >
                {/* close button */}
                <Text style={(styles.text, styles.selected)}>Close</Text>
            </TouchableHighlight>
        </View>
    );
}
