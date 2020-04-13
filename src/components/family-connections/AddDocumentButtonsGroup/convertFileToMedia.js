import parseBaseNameFromUri from './parseBaseNameFromUri';

/**********************************************************/

export default function convertFileToMedia(file) {
    /*
    typeof file = {
        type  : 'success' | 'cancel'
        uri   : string,
        name  : string,
        size  : number,
    }
    */

    console.debug('--- convertFileToMedia(file) => (media) ---');
    console.debug('file:');
    console.debug(file);
    console.debug('--------');

    const media = {
        type: 'file',
        uri: file.uri,
        name: parseBaseNameFromUri(file.name), // ... as a precaution
        size: file.size,
    };

    console.debug('--- convertFileToMedia(file) => (media) ---');
    console.debug('media:');
    console.debug(media);
    console.debug('--------');

    return media;
}
