import React from 'react';
import { Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    mainText: {
        fontSize: 16,
        lineHeight: 26,
        marginBottom: 4,
    },
});

const CustomText = (props) => {
    // by spreading props and styles in an array, we can pass it custom styles to override or add to these base styles when we use this component
    return (
        <Text {...props} style={[styles.mainText, { ...props.style }]}>
            {props.children}
        </Text>
    );
};

export default CustomText;
