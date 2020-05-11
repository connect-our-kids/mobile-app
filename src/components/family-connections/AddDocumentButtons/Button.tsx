import React from 'react';
import { TouchableOpacity } from 'react-native';
import styles from './styles';

export default function Button({ onPress, children }) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            {children}
        </TouchableOpacity>
    );
}
