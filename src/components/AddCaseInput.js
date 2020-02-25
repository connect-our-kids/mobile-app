import React, { PureComponent } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableHighlight,
    Alert,
} from 'react-native';
import {
    FormLabel,
    FormInput,
    FormValidationMessage,
} from 'react-native-elements';

export default function Input(props) {
    const styles = StyleSheet.create({
        root: {
            width: '90%',
            alignSelf: 'center',
        },
    });

    _handleChange = (value) => {
        this.props.onChange(this.props.name, value);
    };
    _handleTouch = (value) => {
        this.props.onTouch(this.props.name, value);
    };

    const { label, error, ...rest } = props;
    return (
        <View style={styles.root}>
            <FormLabel>{label}</FormLabel>
            <FormInput
                onChangeText={this._handleChange}
                onBlur={this._handleTouch}
                placeholder={label}
                {...rest}
            />
            {error && <FormValidationMessage>{error}</FormValidationMessage>}
        </View>
    );
}


// function Input(props) {
//     return (
//         <View>
//             {/* <FormLabel>{props.label}</FormLabel>
//             <FormInput placeholder={props.label}/>
//             <FormValidationMessage>Error</FormValidationMessage> */}

//         </View>
//     )
// }
