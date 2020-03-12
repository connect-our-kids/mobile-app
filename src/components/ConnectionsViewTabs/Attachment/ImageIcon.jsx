import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import icons from './icons.js';

/**********************************************************/

export default function ImageIcon({
    color = icons.color,
    size = icons.size,
}) {
    return (
        <MaterialCommunityIcons
            name={'image-outline'}
            size={size}
            color={color}
        />
    );
}
