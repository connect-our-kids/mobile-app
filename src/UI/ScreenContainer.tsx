import React from 'react';
import { StyleSheet } from 'react-native';
import { Container } from 'native-base';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 20,
    },
});

const ScreenContainer = (props) => {
    return (
        <Container style={[styles.container, { ...props.style }]}>
            {props.children}
        </Container>
    );
};
export default ScreenContainer;
