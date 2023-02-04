import meowHelp from 'cli-meow-help';
import meow from 'meow';

const flags = {
	clear: {
		type: `boolean`,
		default: false,
		alias: `c`,
		desc: `Clear the console`
	},
	noClear: {
		type: `boolean`,
		default: false,
		desc: `Don't clear the console`
	},
	debug: {
		type: `boolean`,
		default: false,
		alias: `d`,
		desc: `Print debug info`
	},
	version: {
		type: `boolean`,
		alias: `v`,
		desc: `Print CLI version`
	}
};

const commands = {
	help: { desc: `Print help info` },
	init: { desc: `Initialize folder structure` },
	index: { desc: `Run indexer` }
};

const helpText = meowHelp({
	name: `sosharu`,
	flags,
	commands
});

const options = {
	inferType: true,
	description: false,
	hardRejection: false,
	importMeta: import.meta,
	flags
};

export default meow(helpText, options);
