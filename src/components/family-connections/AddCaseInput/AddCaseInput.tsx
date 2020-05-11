// @ts-nocheck
import React from 'react';

import { View } from 'react-native';

import {
    FormLabel,
    FormInput,
    FormValidationMessage,
} from 'react-native-elements';

import styles from './AddCaseInput.styles';

export default function AddCaseInput({
    label,
    name,
    placeholder,
    value,
    error,
    onChange,
    onTouch,
}) {
    function handleChange(value) {
        onChange(name, value);
    }

    function handleTouch(value) {
        onTouch(name, value);
    }

    return (
        <View style={styles.root}>
            <FormLabel>{label}</FormLabel>
            <FormInput
                name={name}
                placeholder={placeholder ? placeholder : label}
                value={value}
                onChangeText={handleChange}
                onBlur={handleTouch}
            />
            {error && <FormValidationMessage>{error}</FormValidationMessage>}
        </View>
    );
}
