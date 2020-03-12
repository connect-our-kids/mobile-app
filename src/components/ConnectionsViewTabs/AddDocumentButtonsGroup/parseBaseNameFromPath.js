export default function parseBaseNameFromPath(path) {

    /*
    clear dir-name from path:
    -   clear characters before and including the LAST '\' or '/'
    */
    return path.replace(/^.*[\\/]/, '');

    /*
    ### EXAMPLES ###
    -   '/dir/name/base-name.ext' -> 'base-name.ext'
    -   '/dir/name/base-name'     -> 'base-name'
    -   '/dir/name/'              -> ''
    */

}
