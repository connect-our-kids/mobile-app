import React from 'react';
import FileIcon from './FileIcon';
import ImageIcon from './ImageIcon';
import icons from './icons';
import mime from 'mime';

interface AttachmentIconProps {
    attachment: string | undefined;
    size?: number;
    color?: string;
}

export default function AttachmentIcon({
    attachment = 'unknown',
    size = icons.size,
    color = icons.color,
}: AttachmentIconProps) {
    if (mime.getType(attachment)?.startsWith('image')) {
        return <ImageIcon size={size} color={color} />;
    } else {
        return <FileIcon size={size} color={color} />;
    }
}
