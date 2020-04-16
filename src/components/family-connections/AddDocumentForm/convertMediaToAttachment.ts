import mime from 'mime';
import parseExtNameFromBaseName from './parseExtNameFromBaseName';
import { Attachment, Media } from './types';

export default function convertMediaToAttachment(media: Media): Attachment {
    console.debug('--- convertMediaToAttachment(media) => (attachment) ---');
    console.debug('media:');
    console.debug(media);
    console.debug('--------');

    /* construct the attachment */
    const attachment = {
        /* get actual location on device */
        uri: media.uri,
        /* (maybe) infer MIME type from original file name */
        type: mime.getType(media.name) ?? '',
        name: media.name,
        ext: '',
    };

    /* when MIME type exists, use it... */
    if (attachment.type) {
        /* get canonical file extension from MIME type */
        attachment.ext = mime.getExtension(attachment.type) ?? '';
    } else {
        /* else, use default... */
        attachment.type = 'application/octet-stream';

        /* get actual file extension from name */
        attachment.ext = parseExtNameFromBaseName(media.name);
    }

    console.debug('--- convertMediaToAttachment(media) => (attachment) ---');
    console.debug('attachment:');
    console.debug(attachment);
    console.debug('--------');

    return attachment;
}
