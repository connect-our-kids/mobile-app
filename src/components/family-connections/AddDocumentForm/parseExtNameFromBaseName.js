export default function parseExtNameFromBaseName(path) {

    /*
    clear everything but the LAST extension:
    -   clear characters before and including the LAST '.'
    -   ...unless the LAST '.' is the FIRST character (accomodates "dot" names without extensions)
    -   clear all characters when there is no '.' (accomdates names without extensions)
    */
    const extName = path.replace(/^(.+(?=.*?[.])[.](?=[^.]+)|[^.]+)/, '');

    return (extName !== '' ? extName : undefined);

    /*
    ### EXAMPLES ###
    -   'base-name.ext'  -> 'ext'
    -   'base.name.ext'  -> 'ext'
    -   'base-name'      -> ''
    -   '.base-name.ext' -> 'ext'
    -   '.base.name.ext' -> 'ext'
    -   '.base-name'     -> ''
    */

}
