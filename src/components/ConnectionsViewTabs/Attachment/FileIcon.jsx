import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import icons from './icons.js';

/**********************************************************/

export default function FileIcon({
    color = icons.color,
    size = icons.size,
}) {
    return (
        <MaterialCommunityIcons
            name={'file-document-box-outline'}
            size={size}
            color={color}
        />
    );
}
