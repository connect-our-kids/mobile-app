import React from 'react';

import {
    View,
    StyleSheet,
} from 'react-native';

import {
    FormLabel,
    FormInput,
    FormValidationMessage,
} from 'react-native-elements';

/**********************************************************/

export default function AddCaseInput(props) {

    const { label, error, ...rest } = props;

    function handleChange(value) {
        props.onChange(props.name, value);
    }

    function handleTouch(value) {
        props.onTouch(props.name, value);
    }

    return (
        <View style={styles.root}>
            <FormLabel>{label}</FormLabel>
            <FormInput
                onChangeText={handleChange}
                onBlur={handleTouch}
                placeholder={label}
                {...rest}
            />
            {error && <FormValidationMessage>{error}</FormValidationMessage>}
        </View>
    );

}

/**********************************************************/

const styles = StyleSheet.create({

    root: {
        width: '90%',
        alignSelf: 'center',
    },

});
