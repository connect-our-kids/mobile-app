import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import icons from './icons';

/**********************************************************/

export default function TakePhotoIcon({
    color = icons.color,
    size = icons.size,
}) {
    return <MaterialIcons name={'add-a-photo'} size={size} color={color} />;
}
