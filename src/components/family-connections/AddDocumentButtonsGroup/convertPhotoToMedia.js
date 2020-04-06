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

    console.debug('--- convertPhotoToMedia(photo) => (media) ---');
    console.debug('photo:');
    console.debug(photo);
    console.debug('--------');

    const media = {
        type: photo.type,
        uri: photo.uri,
        name: parseBaseNameFromUri(photo.uri),
        width: photo.width,
        height: photo.height,
    };

    console.debug('--- convertPhotoToMedia(photo) => (media) ---');
    console.debug('media:');
    console.debug(media);
    console.debug('--------');

    return media;
}
