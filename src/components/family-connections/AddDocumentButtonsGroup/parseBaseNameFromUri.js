import * as URI from 'uri-js';
import parseBaseNameFromPath from './parseBaseNameFromPath';

/**********************************************************/

export default function parseBaseNameFromUri(uri) {
    /* take 'path' from URI, removing 'scheme', 'host', 'query', 'fragment' */
    const path = URI.parse(uri).path;

    return parseBaseNameFromPath(path);
}
