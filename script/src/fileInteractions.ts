import fs from 'fs/promises';
import { JSDOM } from 'jsdom';
import fetch, { fileFromSync } from 'node-fetch';
import path from 'node:path';
import puppeteer, { Browser } from 'puppeteer';
import config from '../config.json';
import { fileCreateInput, getMediaType, getMetaData } from './fileTypes';

async function innerText(htmlCode: string, browser: Browser): Promise<string> {
    const page = await browser.newPage();

    await page.setContent(htmlCode);

    const text = await page.evaluate(() => {
        return document.body.innerText;
    });

    // Remove all lines with only whitespace
    return text.replace(/^\s*[\r ]*\n/gm, '');
}

export async function getAllNewFiles(
    dir: string,
    lastTimeInMs: number,
): Promise<fileCreateInput[] | []> {
    const files = await fs.readdir(dir, { withFileTypes: true });

    let newFiles: fileCreateInput[] = [];

    if (files.length === 0) return newFiles;

    const browser = await puppeteer.launch();

    await Promise.all(
        files.map(async (file) => {
            const filePath = path.join(dir, file.name);

            if (file.isDirectory()) {
                // Recurse into directory
                const newFilesInDir = await getAllNewFiles(
                    filePath,
                    lastTimeInMs,
                );

                // Check if there are any new files in the directory
                if (newFilesInDir.length > 0) {
                    // Add the new files to the list of new files
                    newFiles.push(...newFilesInDir);
                }

                return;
            }

            const stat = await fs.stat(filePath);

            if (stat.mtimeMs > lastTimeInMs && !file.isDirectory()) {
                console.log(`${dir}/${file.name}`);

                const response = await fetch(`http://localhost:9998/tika`, {
                    method: 'PUT',
                    body: fileFromSync(filePath),
                });

                const window = new JSDOM(await response.text()).window;

                const content = await innerText(
                    window.document.body.innerHTML,
                    browser,
                );

                const head = window.document.head.innerHTML;

                const mediaType = getMediaType(path.extname(file.name));

                const fileInfo: fileCreateInput = {
                    name: file.name.replace(path.extname(file.name), ''),
                    fileSize: stat.size,
                    filePath: filePath.replace(config.rootFolderLocation, ''),
                    fileExtension: path.extname(file.name),
                    fileCreatedAt: stat.birthtime,
                    fileUpdatedAt: stat.mtime,
                    mediaType: mediaType,
                    mediaTypeSpecificMetaData: getMetaData(
                        mediaType,
                        getMetaTags(head),
                        content.split(' ').length,
                    ),
                    miscellaneous: getMetaTags(head),
                    content: content || undefined,
                };

                newFiles.push(fileInfo);
            }
        }),
    );

    await browser.close();

    // console.log(newFiles);
    return newFiles;
}

function getMetaTags(head: string) {
    const obj = {};

    const regex = /<meta name="([^"]+)" content="([^"]+)">/g;

    let match;

    while ((match = regex.exec(head)) !== null) {
        // Don't do if it starts with "X-TIKA:"
        if (match[1].startsWith('X-TIKA:')) continue;
        // @ts-ignore
        obj[match[1]] = match[2];
    }

    return obj;
}
