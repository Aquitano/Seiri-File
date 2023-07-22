import Conf from 'conf';

export const config = new Conf({
    projectName: 'Sosharu',
    projectSuffix: '',
    defaults: { lastTimeIn: 0, rootFolderLocation: '..' },
    schema: {
        lastTimeIn: {
            type: 'number',
            minimum: 0,
        },
        rootFolderLocation: {
            type: 'string',
        },
    },
});

export type Config = {
    lastTimeIn: number;
    rootFolderLocation: string;
};
