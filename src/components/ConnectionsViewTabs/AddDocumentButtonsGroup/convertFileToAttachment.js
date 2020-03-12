import parseBaseNameFromUri from './parseBaseNameFromUri';

/**********************************************************/

export default function convertFileToAttachment(media) {

    /*
    typeof media = {
        type  : 'success' | 'cancel'
        uri   : string,
        name  : string,
        size  : number,
    }
    */

    return {
        type: 'file',
        uri: media.uri,
        name: parseBaseNameFromUri(media.name), // ... as a precaution
        size: media.size,
    };

}
