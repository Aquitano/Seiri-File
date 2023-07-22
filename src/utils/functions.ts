import { exec } from 'child_process';
// @ts-expect-error No types available
import alert from 'cli-alerts';
import { mkdirs } from 'fs-extra';
import inquirer from 'inquirer';
import { folderStructure } from './structure.js';

export async function askList() {
    const answers = await inquirer.prompt({
        type: `list`,
        name: `method`,
        message: `What do you want to do?`,
        choices: [
            { name: `Initialize folder structure`, value: `init` },
            { name: `Run indexer`, value: `index` },
            { name: `Help`, value: `help` },
        ],
    });

    return answers.method;
}

export async function initStructure() {
    alert({
        type: `info`,
        msg: `Initializing folder structure...`,
    });

    folderStructure.forEach((folder: string) => {
        mkdirs('../' + folder, (err) => {
            if (err) {
                alert({
                    type: `error`,
                    msg: `Folder structure could not be initialized!\n${JSON.stringify(
                        err,
                    )}`,
                });
            }
        });
    });

    alert({
        type: `success`,
        msg: `Folder structure initialized!\n  ${folderStructure.length} folders created.`,
    });
}

export async function startIndexer() {
    alert({
        type: `info`,
        msg: `Starting indexer...`,
    });

    // Start nodejs process
    exec('cd ./script && pnpm run start', (error, _stdout, stderr) => {
        if (error) {
            alert({
                type: `error`,
                msg: `Indexing failed!\n${error.message}`,
            });
            return;
        }
        if (stderr) {
            alert({
                type: `error`,
                msg: `Indexing failed!\n${stderr}`,
            });
            return;
        }
        alert({
            type: `success`,
            msg: `Indexing finished!`,
        });
    });
}
