import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import icons from './icons';

/**********************************************************/

export default function PickFileIcon({
    color = icons.color,
    size = icons.size,
}) {
    return <MaterialIcons name={'note-add'} size={size} color={color} />;
}
