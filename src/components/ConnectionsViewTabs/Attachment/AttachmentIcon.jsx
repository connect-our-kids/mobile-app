import React from 'react';
import FileIcon from './FileIcon.jsx';
import ImageIcon from './ImageIcon.jsx';
import mime from 'mime';

/**********************************************************/

export default function AttachmentIcon({
    attachment,
    size,
    color,
}) {

    const type = mime.getType(attachment.original_file_name) || 'unknown';

    if (type.startsWith('image')) {
        return (
            <ImageIcon
                size={size}
                color={color}
            />
        );
    }
    else {
        return (
            <FileIcon
                size={size}
                color={color}
            />
        );
    }

}
