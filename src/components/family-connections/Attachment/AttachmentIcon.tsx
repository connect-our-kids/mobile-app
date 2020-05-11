import React from 'react';
import FileIcon from './FileIcon';
import ImageIcon from './ImageIcon';
import icons from './icons';
import mime from 'mime';

export default function AttachmentIcon({
    attachment,
    size = icons.size,
    color = icons.color,
}) {
    // TODO check this. I haven't see original_file_name anywhere
    const type = mime.getType(attachment.original_file_name) || 'unknown';

    if (type.startsWith('image')) {
        return <ImageIcon size={size} color={color} />;
    } else {
        return <FileIcon size={size} color={color} />;
    }
}
