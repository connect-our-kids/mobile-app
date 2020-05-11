import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import icons from './icons';

export default function FileIcon({ size = icons.size, color = icons.color }) {
    return (
        <MaterialCommunityIcons
            name={'file-document-box-outline'}
            size={size}
            color={color}
        />
    );
}
