export default function parseDirNameFromPath(path) {

    /*
    clear base-name from path:
    -   clear characters after and NOT including the LAST '\' or '/'
    */
    const dirName = path.replace(/[^\\/]*$/, '');

    return (dirName !== '' ? dirName : undefined);

    /*
    ### EXAMPLES ###
    -   '/dir/name/base-name.ext' -> '/dir/name/'
    -   '/dir/name/base-name'     -> '/dir/name/'
    -   '/dir/name/'              -> '/dir/name/'
    */

}
