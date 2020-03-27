import React from 'react';
import { TouchableOpacity } from 'react-native';
import styles from './styles.js';

/**********************************************************/

export default function Button({ onPress, children }) {
    return (
        <TouchableOpacity
            style={styles.button}
            onPress={onPress}
        >
            {children}
        </TouchableOpacity>
    );
}
