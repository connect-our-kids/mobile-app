// @ts-nocheck
import React, { useState } from 'react';

import { View } from 'react-native';

import { FormValidationMessage } from 'react-native-elements';

import AddCaseInput from '../AddCaseInput';

import styles from './AddCaseForm.styles';

export default function AddCaseForm({ inputs, error }) {
    const [state, setState] = useState(
        Object.fromEntries(
            inputs.map(({ name, initialValue }) => [
                name,
                initialValue ? initialValue : '',
            ])
        )
    );

    function onChange() {
        setState({});
    }

    function onTouch() {
        setState({});
    }

    return (
        <View style={styles.root}>
            {inputs.map((input) => (
                <AddCaseInput
                    key={input.name}
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
