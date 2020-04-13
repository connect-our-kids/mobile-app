import { ReactNativeFile } from 'extract-files';

export interface Media {
    height: number;
    width: number;
    name: string;
    type: string;
    uri: string;
}

export type Attachment = ReactNativeFile & { ext: string };
