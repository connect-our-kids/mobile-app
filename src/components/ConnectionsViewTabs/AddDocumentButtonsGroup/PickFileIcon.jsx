import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import icons from './icons.js';

/**********************************************************/

export default function PickFileIcon({
    color = icons.color,
    size = icons.size,
}) {
    return (
        <MaterialIcons
            name={'insert-drive-file'}
            size={size}
            color={color}
        />
    );
}
