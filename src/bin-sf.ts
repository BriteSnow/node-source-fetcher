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

		console.log(`==== source-fetcher FETCH '${path}'`);
		let replacedCount = 0, skippedCount = 0, failedCount = 0;

		for (const fi of files) {
			if (fi.status === 'replaced') {
				replacedCount++;
				console.log(`Replaced: ${fi.file}`);
			} else if (fi.status === 'failed') {
				failedCount++
				console.log(`Failed - ${fi.file} cause: ${fi.error}`);
			} else if (fi.status === 'skipped') {
				skippedCount++;
				// no log on skipped
			}
			// should never happen, but just in case
			else {
				console.log(`CODE ERROR - unknown status ${fi.status} for file ${fi.file}`);
			}
		}

		let message = '== ';
		if (replacedCount === 0 && failedCount === 0) {
			message += 'All source up to date'
		} else {
			message += ` Replaced: ${replacedCount}`;
			if (failedCount > 0) {
				message += ` | Error: ${failedCount}`;
			}
		}
		message += ` (total processed: ${files.length})`;
		console.log(message);
	}

}
