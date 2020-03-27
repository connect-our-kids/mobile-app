import mime from 'mime';
import parseExtNameFromBaseName from './parseExtNameFromBaseName';

/**********************************************************/

export default function convertMediaToAttachment(media) {

    console.debug ('--- convertMediaToAttachment(media) => (attachment) ---');
    console.debug ('media:');
    console.debug (media);
    console.debug ('--------');

    /* construct the attachment */
    const attachment = {
        /* get actual location on device */
        uri: media.uri,
        /* (maybe) infer MIME type from original file name */
        type: mime.getType(media.name),
        name: '',
        ext: '',
    };

    /* when MIME type exists, use it... */
    if (attachment.type) {

        /* get canonical file extension from MIME type */
        attachment.ext = mime.getExtension(attachment.type);

    }
    /* else, use default... */
    else {

        attachment.type = 'application/octet-stream';

        /* get actual file extension from name */
        attachment.ext = parseExtNameFromBaseName(media.name);

    }

    /* when extension exists, use it... */
    if (attachment.ext) {

        attachment.name = `attachment.${attachment.ext}`;

    }
    /* else, use nothing... */
    else {

        attachment.name = 'attachment';

    }

    console.debug ('--- convertMediaToAttachment(media) => (attachment) ---');
    console.debug ('attachment:');
    console.debug (attachment);
    console.debug ('--------');

    return attachment;

}
