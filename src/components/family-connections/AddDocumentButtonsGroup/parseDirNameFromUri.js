import * as URI from 'uri-js';
import parseDirNameFromPath from './parseDirNameFromPath';

/**********************************************************/

export default function parseDirNameFromUri(uri) {
    /* take 'path' from URI, removing 'scheme', 'host', 'query', 'fragment' */
    const path = URI.parse(uri).path;

    return parseDirNameFromPath(path);
}
