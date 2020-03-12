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

    return {
        type: 'file',
        uri: file.uri,
        name: parseBaseNameFromUri(file.name), // ... as a precaution
        size: file.size,
    };

}
