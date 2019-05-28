#!/usr/bin/env node
import * as minimist from 'minimist';
import { ParsedArgs } from 'minimist';
import { sfetch } from '.';
import { listFiles } from './utils';


const argv = minimist(process.argv.slice(2), { '--': true });

run(argv);

async function run(agv: ParsedArgs) {
	let path: string | undefined = argv._[0]; // the path (by default )

	path = (!path) ? './**' : path;
	// if `-l` just do the list
	if (argv.l) {
		const files = await listFiles(path);
		console.log(`==== source-fetcher LIST '${path}'`)
		for (const fi of files) {
			let msg = fi.file;
			if (argv.o) {
				msg += ' - ' + fi.origin;
			}
			console.log(msg);
		}
		console.log(`== Fetchable: ${files.length}`);
	}
	//// perform the fetching
	else {
		const files = await sfetch(path);
		let fetchedCount = 0, skippedCount = 0;

		console.log(`==== source-fetcher FETCH '${path}'`)
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

}
