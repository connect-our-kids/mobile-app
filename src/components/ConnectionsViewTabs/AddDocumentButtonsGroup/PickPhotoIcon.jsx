import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import icons from './icons.js';

/**********************************************************/

export default function PickPhotoIcon({
    color = icons.color,
    size = icons.size,
}) {
    return (
        <MaterialIcons
            name={'photo-library'}
            size={size}
            color={color}
        />
    );
}
