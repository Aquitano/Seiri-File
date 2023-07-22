#!/usr/bin/env node

/**
 * Sosharu CLI
 * Init and start Sosharu
 *
 * @author Aquitano <thomasbreindl.me>
 */

import cli from './utils/cli.js';
import { askList, initStructure, startIndexer } from './utils/functions.js';
import init from './utils/init.js';
import log from './utils/log.js';

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags as Record<string, boolean>;

(async () => {
    init({ clear });
    input.includes(`help`) && cli.showHelp(0);

    if (input.includes(`init`)) initStructure();
    else if (input.includes(`index`)) startIndexer();
    else if (input.length === 0) {
        const answer = await askList();

        if (answer === `help`) cli.showHelp(0);
        else if (answer === `init`) initStructure();
        else if (answer === `index`) startIndexer();
    }

    debug && log(flags);
})();
