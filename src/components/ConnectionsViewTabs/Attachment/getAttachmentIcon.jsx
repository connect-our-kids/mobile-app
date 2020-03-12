import React from 'react';
import FileIcon from './FileIcon.jsx';
import ImageIcon from './ImageIcon.jsx';
import mime from 'mime';

/**********************************************************/

export default function getAttachmentIcon(attachment) {

    const type = mime.getType(attachment.original_file_name) || 'unknown';

    if (type.startsWith('image')) {
        return (
            <ImageIcon/>
        );
    }
    else {
        return (
            <FileIcon/>
        );
    }

}
