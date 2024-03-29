import { PrismaClient } from '@prisma/client';
import inquirer from 'inquirer';
import { getAllNewFiles } from './fileInteractions.js';
import {
    canBeMultipleFileTypes,
    fileCreateInput,
    getMetaData,
} from './fileTypes.js';
import { config } from './utils/config.js';

const prisma = new PrismaClient();

// A `main` function so that we can use async/await
async function main() {
    const files = await getAllNewFiles(
        config.get('rootFolderLocation') as string,
        (config.get('lastTimeIn') as number) ||
            Date.parse('1970-01-01T00:00:00.000Z'),
    );

    await Promise.all(
        files.map(async (file) => {
            const multipleFileTypes = canBeMultipleFileTypes(
                file.fileExtension,
            );
            if (multipleFileTypes[0] && multipleFileTypes[1] !== undefined) {
                const answers = await inquirer.prompt({
                    name: 'fileType',
                    type: 'list',
                    message: 'What type of file is this?',
                    choices: [...multipleFileTypes[1]],
                });

                if (file.miscellaneous !== undefined) {
                    file.mediaTypeSpecificMetaData = getMetaData(
                        answers,
                        file.miscellaneous,
                        file.content?.split(' ').length,
                    );
                }
            }
            // Was the find moved?
            if (await isMovedFile(file)) {
                return;
            }
            // Create file in database
            const request = await createFile(file);

            // Check if file couldn't be created
            if (!request) {
                console.error(
                    `Error: Could not create file ${file.name} in database.`,
                );
            }
        }),
    );

    config.set('lastTimeIn', Date.now());
}

main()
    .then(() => {
        prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

async function createFile(file: fileCreateInput) {
    return await prisma.localFile.create({
        data: {
            name: file.name,
            fileSize: file.fileSize,
            filePath: file.filePath,
            fileExtension: file.fileExtension,
            fileCreatedAt: file.fileCreatedAt,
            fileUpdatedAt: file.fileUpdatedAt,
            mediaType: file.mediaType,
            mediaTypeSpecificMetaData: JSON.stringify(
                file.mediaTypeSpecificMetaData,
            ),
            miscellaneous: JSON.stringify(file.miscellaneous),
            content: file.content,
            profileId: 'TEST',
        },
    });
}

async function isMovedFile(file: fileCreateInput) {
    const res = await prisma.localFile.findMany({
        where: {
            name: file.name,
            fileSize: file.fileSize,
            content: file.content,
            fileCreatedAt: file.fileCreatedAt,
            fileExtension: file.fileExtension,
        },
    });

    // No file found
    if (res.length === 0) {
        return false;
    }

    // File found
    const answers = await inquirer.prompt({
        name: 'isMoved',
        type: 'confirm',
        message: `${file.name} is already in the database. Was it moved from ${res[0].filePath} to ${file.filePath}?`,
    });

    if (answers.isMoved) {
        await prisma.localFile.update({
            where: {
                id: res[0].id,
            },
            data: {
                filePath: file.filePath,
                fileUpdatedAt: file.fileUpdatedAt,
            },
        });
        return true;
    }
    return false;
}
