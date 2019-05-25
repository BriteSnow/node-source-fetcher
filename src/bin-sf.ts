import * as minimist from 'minimist';
import { ParsedArgs } from 'minimist';
import { sfetch } from '.';


const argv = minimist(process.argv.slice(2), { '--': true });

run(argv);

async function run(agv: ParsedArgs) {
	let path: string | undefined = argv._[0]; // the path (by default )

	path = (!path) ? './' : path;
	console.log(path);
	const files = await sfetch(path);
	let fetchedCount = 0, skippedCount = 0;

	for (const fi of files) {
		if (fi.success) {
			fetchedCount++;
			console.log(`Fetched ${fi.file}`);
		} else {
			skippedCount++;
			console.log(`Skipped ${fi.file} cause: ${fi.error}`);
		}

	}

	let message = `== Fetched ${fetchedCount}`;
	if (skippedCount > 0) {
		message += ` | Skipped ${skippedCount}`;
	}
	console.log(message);
}
