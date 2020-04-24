export interface DocumentInfo {
    name: string;
    size: number;
    uri: string;
    lastModified?: number;
    file?: File;
    output?: FileList | null;
}
