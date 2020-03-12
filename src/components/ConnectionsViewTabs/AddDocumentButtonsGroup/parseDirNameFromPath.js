export default function parseDirNameFromPath(path) {

    // clear everything after and NOT including the LAST '\' or '/'
    return path.replace(/[^\\/]*$/, '');

    /*
        ### EXAMPLES ###
        '/dir/name/base-name.ext' -> '/dir/name/'
        '/dir/name/base-name'     -> '/dir/name/'
        '/dir/name/'              -> '/dir/name/'
    */

}
