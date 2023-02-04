import unhandled from 'cli-handle-unhandled';
import welcome from 'cli-welcome';
import config from '../package.json' assert { type: 'json' };
//  from '../package.json' assert { type: 'json' };

export default ({ clear = true }) => {
	unhandled();
	welcome({
		title: `Sosharu CLI`,
		tagLine: `by Aquitano`,
		version: config.version,
		bgColor: '#36BB09',
		color: '#000000',
		bold: true,
		clear
	});
};
