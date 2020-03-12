import parseBaseNameFromPath from './parseBaseNameFromPath';

/**********************************************************/

export default function convertPhotoToAttachment(media) {

    /*
    typeof media = {
        cancelled  : boolean,
        uri        : string,
        type       : 'image' | 'video'
        width      : number,
        height     : number,
        base64    ?: boolean,
        exif      ?: object,
    }
    */

    return {
        type: media.type,
        uri: media.uri,
        name: parseBaseNameFromPath(media.uri),
        width: media.width,
        height: media.height,
    };

}
