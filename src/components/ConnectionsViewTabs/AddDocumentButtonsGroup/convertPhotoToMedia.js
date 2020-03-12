import parseBaseNameFromUri from './parseBaseNameFromUri';

/**********************************************************/

export default function convertPhotoToMedia(photo) {

    /*
    typeof photo = {
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
        type: photo.type,
        uri: photo.uri,
        name: parseBaseNameFromUri(photo.uri),
        width: photo.width,
        height: photo.height,
    };

}
