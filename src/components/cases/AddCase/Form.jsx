import React from 'react';

import { View } from 'react-native';

import {
    FormValidationMessage,
} from 'react-native-elements';

import Input from './Input';

import styles from './Form.styles';

/**********************************************************/

export default function AddCaseForm({ inputs, error }) {

    const [ state, setState ] = useState(
        Object.fromEntries(
            inputs.map(({ name, initialValue }) => [
                name,
                initialValue ? initialValue : '',
            ]),
        ),
    );

    function onChange(name, value) {
        setState({});
    }

    function onTouch(name, value) {
        setState({});
    }

    return (
        <View style={styles.root}>
            {inputs.map ((input) => (
                <Input
                    name={input.name}
                    label={input.label}
                    placeholder={input.placeholder}
                    value={state[input.name].value}
                    error={state[input.name].error}
                    onChange={onChange}
                    onTouch={onTouch}
                />
            ))}
            {error && <FormValidationMessage>{error}</FormValidationMessage>}
        </View>
    );

}
