// const bookFileTypes = ['epub', 'mobi', 'djvu', 'pdf', 'azw', 'azw3'];
// const articleFileTypes = ['docx', 'doc', 'odt', 'rtf', 'txt', 'html', 'md'];
// const videoFileTypes = ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm'];
// const audioFileTypes = ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'wma'];
// const imageFileTypes = [
//     'jpg',
//     'jpeg',
//     'png',
//     'gif',
//     'bmp',
//     'svg',
//     'webp',
//     'tiff',
//     'tif',
//     'ico',
//     'heic',
//     'heif',
// ];
// const websiteFileTypes = ['html', 'htm', 'mhtml', 'mht', 'php', 'pdf'];
// const documentFileTypes = ['docx', 'doc', 'odt', 'rtf', 'txt', 'md', 'pdf'];
// const presentationFileTypes = ['pptx', 'ppt', 'odp', 'pdf'];
// const spreadsheetFileTypes = ['xlsx', 'xls', 'ods', 'csv', 'tsv', 'pdf'];
// const databaseFileTypes = ['sqlite', 'sqlite3', 'db', 'db3', 'mdb', 'accdb'];
// const archiveFileTypes = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'lzma'];

// export const allowedMediaTypes = [
//     'Book',
//     'Article',
//     'Video',
//     'Audio',
//     'Image',
//     'Website',
//     'Document',
//     'Presentation',
//     'Spreadsheet',
//     'Database',
//     'Archive',
//     'Other',
// ];

export const allowedFileTypes = {
    Book: ['epub', 'mobi', 'djvu', 'pdf', 'azw', 'azw3'],
    Article: ['docx', 'doc', 'odt', 'rtf', 'txt', 'html', 'md'],
    Video: ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm'],
    Audio: ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'wma'],
    Image: [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'bmp',
        'svg',
        'webp',
        'tiff',
        'tif',
        'ico',
        'heic',
        'heif',
    ],
    Website: ['html', 'htm', 'mhtml', 'mht', 'php', 'pdf'],
    Document: ['docx', 'doc', 'odt', 'rtf', 'txt', 'md', 'pdf'],
    Presentation: ['pptx', 'ppt', 'odp', 'pdf'],
    Spreadsheet: ['xlsx', 'xls', 'ods', 'csv', 'tsv', 'pdf'],
    Database: ['sqlite', 'sqlite3', 'db', 'db3', 'mdb', 'accdb'],
    Archive: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'lzma'],
    Other: [],
};

export type bookMetaData = {
    pages?: number;
    author?: string;
    ISBN?: string;
    publisher?: string;
    publicationDate?: string;
    language?: string;
    genres?: string[];
    series?: string;
    coverImage?: string;
};

export type metaDataTypes = bookMetaData | {};

export type fileCreateInput = {
    name: string;

    tags?: string[];
    notes?: string;

    fileSize: number;
    filePath: string;
    fileExtension: string;
    fileCreatedAt: Date | string;
    fileUpdatedAt: Date | string;
    mediaType: string;
    mediaTypeSpecificMetaData?: metaDataTypes;

    miscellaneous?: { [key: string]: string };

    content?: string;

    deletedAt?: Date | string | null;
};

export function getMediaType(fileType: string): string {
    const type = fileType.replace('.', '');

    // Check if file type is in the list of allowed file types
    if (allowedFileTypes.Book.includes(type)) return 'Book';
    else if (allowedFileTypes.Article.includes(type)) return 'Article';
    else if (allowedFileTypes.Video.includes(type)) return 'Video';
    else if (allowedFileTypes.Audio.includes(type)) return 'Audio';
    else if (allowedFileTypes.Image.includes(type)) return 'Image';
    else if (allowedFileTypes.Website.includes(type)) return 'Website';
    else if (allowedFileTypes.Document.includes(type)) return 'Document';
    else if (allowedFileTypes.Presentation.includes(type))
        return 'Presentation';
    else if (allowedFileTypes.Spreadsheet.includes(type)) return 'Spreadsheet';
    else if (allowedFileTypes.Database.includes(type)) return 'Database';
    else if (allowedFileTypes.Archive.includes(type)) return 'Archive';
    else return 'Other';
}

export function getMetaData(
    mediaType: string,
    head: { [key: string]: string },
    wordCount?: number,
): metaDataTypes {
    if (mediaType === 'Book') {
        const metaData: bookMetaData = {};

        if (head['dc:publisher']) {
            metaData.publisher = head['dc:publisher'];
        }
        if (head['dc:creator']) {
            metaData.author = head['dc:creator'];
        }
        if (head['dcterms:created']) {
            metaData.publicationDate = head['dcterms:created'];
        }
        if (head['dc:identifier']) {
            metaData.ISBN = head['dc:identifier'].split(':').pop();
        }
        if (wordCount) {
            metaData.pages = Math.ceil(wordCount / 250);
        }

        return metaData;
    } else {
        return {};
    }
}

export function canBeMultipleFileTypes(fileType: string): [boolean, string[]?] {
    const multipleFileTypes: { [key: string]: string[] } = {
        html: ['Website', 'Article'],
        pdf: ['Book', 'Article', 'Document'],
        docx: ['Article', 'Document'],
        doc: ['Article', 'Document'],
        odt: ['Article', 'Document'],
        rtf: ['Article', 'Document'],
        txt: ['Article', 'Document'],
        md: ['Article', 'Document', 'Note'],
    };

    return [
        Object.keys(multipleFileTypes).includes(fileType),
        multipleFileTypes[fileType] || undefined,
    ];
}
