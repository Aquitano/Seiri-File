import { exec } from 'child_process';
import alert from 'cli-alerts';
import { mkdirs } from 'fs-extra';
import inquirer from 'inquirer';
import config from '../config.json' assert { type: 'json' };

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

    const folderStructure = [
        '+Inbox',
        'Archive/Backups',
        'Archive/Social Media',
        'Archive/Websites',
        'Audio/Books',
        'Audio/Music/Various Artists',
        'Audio/Playlists',
        'Audio/Podcasts',
        'Document/Important',
        'Document/Recipes',
        'Document/Scans',
        'Image/Artwork',
        'Image/Charts',
        'Image/Memes',
        'Image/Photos',
        'Image/Screenshots',
        'Notes',
        'School',
        'Software/Applications',
        'Software/Assets/2D',
        'Software/Assets/3D',
        'Software/Assets/Concepts',
        'Software/Assets/Drawings',
        'Software/Assets/Icons',
        'Software/Assets/Materials',
        'Software/Assets/SoundFX',
        'Software/Assets/Typefaces',
        'Software/Coding/Scripts',
        'Software/Coding/Sources',
        'Software/Configs',
        'Software/Games',
        'Software/Plugins',
        'Video/Movies',
        'Video/Shows',
        'Video/Web/YouTube',
        'Writing/0 Science and knowledge/Newspapers. Magazines',
        'Writing/1 Philosophy. Psychology',
        'Writing/2 Religion. Theology',
        'Writing/3 Social sciences/Economics',
        'Writing/3 Social sciences/Education',
        'Writing/3 Social sciences/Law',
        'Writing/3 Social sciences/Politics',
        'Writing/4 Currently Vacant',
        'Writing/5 Mathematics. Natural sciences/Biology',
        'Writing/5 Mathematics. Natural sciences/Botany',
        'Writing/5 Mathematics. Natural sciences/Chemistry',
        'Writing/5 Mathematics. Natural sciences/Mathematics',
        'Writing/5 Mathematics. Natural sciences/Physics',
        'Writing/5 Mathematics. Natural sciences/Zoology',
        'Writing/6 Applied sciences. Medicine. Technology',
        'Writing/6 Applied sciences. Medicine. Technology/Computer science/AI',
        'Writing/6 Applied sciences. Medicine. Technology/Computer science/Algorithms',
        'Writing/6 Applied sciences. Medicine. Technology/Computer science/Computer',
        'Writing/6 Applied sciences. Medicine. Technology/Computer science/Data',
        'Writing/6 Applied sciences. Medicine. Technology/Computer science/Hardware',
        'Writing/6 Applied sciences. Medicine. Technology/Computer science/Internet',
        'Writing/6 Applied sciences. Medicine. Technology/Computer science/Security',
        'Writing/6 Applied sciences. Medicine. Technology/Computer science/Software',
        'Writing/6 Applied sciences. Medicine. Technology/Engineering',
        'Writing/6 Applied sciences. Medicine. Technology/Medicine',
        'Writing/6 Applied sciences. Medicine. Technology/Technology',
        'Writing/7 The arts. Recreation. Entertainment. Sport/Architecture',
        'Writing/7 The arts. Recreation. Entertainment. Sport/Drawing',
        'Writing/7 The arts. Recreation. Entertainment. Sport/Graphic design',
        'Writing/7 The arts. Recreation. Entertainment. Sport/Music',
        'Writing/7 The arts. Recreation. Entertainment. Sport/Painting',
        'Writing/7 The arts. Recreation. Entertainment. Sport/Photography',
        'Writing/8 Language. Linguistics. Literature/Linguistics and languages',
        'Writing/8 Language. Linguistics. Literature/Literature/Drama. Plays',
        'Writing/8 Language. Linguistics. Literature/Literature/Essays. Speeches',
        'Writing/8 Language. Linguistics. Literature/Literature/Fiction. Novels',
        'Writing/8 Language. Linguistics. Literature/Literature/Memoirs. Biographies',
        'Writing/8 Language. Linguistics. Literature/Literature/Poetry. Poems. Verses',
        'Writing/9 Geography. Biography. History/Biography',
        'Writing/9 Geography. Biography. History/Geography',
        'Writing/9 Geography. Biography. History/History',
        'Writing/9 Geography. Biography. History/History/Ancient history',
        'Writing/9 Geography. Biography. History/History/Medieval history',
        'Writing/9 Geography. Biography. History/History/Modern history',
        'Writing/9 Geography. Biography. History/History/World history',
    ];

    folderStructure.forEach((folder) => {
        mkdirs(config.rootFolder + '/' + folder, (err) => {
            if (err) {
                alert({
                    type: `error`,
                    msg: `Folder structure could not be initialized!\n${err}`,
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
