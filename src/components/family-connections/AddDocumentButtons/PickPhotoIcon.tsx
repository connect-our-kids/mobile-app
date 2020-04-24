import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import icons from './icons';

/**********************************************************/

export default function PickPhotoIcon({
    color = icons.color,
    size = icons.size,
}) {
    return <MaterialIcons name={'add-to-photos'} size={size} color={color} />;
}
