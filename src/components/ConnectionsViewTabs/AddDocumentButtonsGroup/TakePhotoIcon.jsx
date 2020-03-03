import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import icons from './icons.js';

/**********************************************************/

export default function TakePhotoIcon({
    color = icons.color,
    size = icons.size,
}) {
    return (
        <MaterialIcons
            name={'photo-camera'}
            size={size}
            color={color}
        />
    );
}
