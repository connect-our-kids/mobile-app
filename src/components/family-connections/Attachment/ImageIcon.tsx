import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import icons from './icons';

export default function ImageIcon({ size = icons.size, color = icons.color }) {
    return (
        <MaterialCommunityIcons
            name={'image-outline'}
            size={size}
            color={color}
        />
    );
}
