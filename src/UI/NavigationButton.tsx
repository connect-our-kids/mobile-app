import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Text } from 'native-base';
import constants from '../helpers/constants';

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        marginBottom: 10,
    },
    primaryBtn: {
        backgroundColor: constants.highlightColor,
    },
    primaryBtnText: {
        fontSize: 12,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: constants.highlightColor,
        flex: 1,
    },
    buttonText: {
        color: constants.highlightColor,
        fontSize: 12,
        textTransform: 'uppercase',
    },
    lightBtn: {
        color: '#fff',
    },
});

export const NavigationButton = ({
    handlePress,
    subTitleText,
    style,
    titleText,
}) => {
    return (
        <Button
            style={[styles.button, styles.primaryBtn, { ...style }]}
            block
            onPress={handlePress}
        >
            <Text style={[styles.primaryBtnText, styles.lightBtn]}>
                {titleText}
            </Text>
            <Text style={[styles.buttonText, styles.lightBtn]}>
                {subTitleText}
            </Text>
        </Button>
    );
};
