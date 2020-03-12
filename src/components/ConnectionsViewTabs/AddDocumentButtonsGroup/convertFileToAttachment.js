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
        name: media.name,
        size: media.size,
    };

}
