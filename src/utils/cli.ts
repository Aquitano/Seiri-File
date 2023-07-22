// @ts-expect-error No types available
import meowHelp from 'cli-meow-help';
import meow, { type AnyFlags, type BooleanFlag, type Options } from 'meow';

const flags: Record<string, BooleanFlag & { desc: string }> = {
    clear: {
        type: `boolean`,
        default: false,
        shortFlag: `c`,
        desc: `Clear the console`,
    },
    noClear: {
        type: `boolean`,
        default: false,
        desc: `Don't clear the console`,
    },
    debug: {
        type: `boolean`,
        default: false,
        shortFlag: `d`,
        desc: `Print debug info`,
    },
    version: {
        type: `boolean`,
        shortFlag: `v`,
        desc: `Print CLI version`,
    },
};

const commands = {
    help: { desc: `Print help info` },
    init: { desc: `Initialize folder structure` },
    index: { desc: `Run indexer` },
};

const helpText = meowHelp({
    name: `sosharu`,
    flags,
    commands,
});

const options: Options<AnyFlags> = {
    inferType: true,
    description: false,
    hardRejection: false,
    importMeta: import.meta,
};

export default meow(helpText, options);
