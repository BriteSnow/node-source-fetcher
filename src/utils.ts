import { createReadStream, glob, readFile } from 'fs-extra-plus';
import { join } from 'path';
import * as readline from 'readline';
import got = require('got');

type FileInfo = {
	file: string,
	firstLine: string,
	origin: {
		src: string
	}
}

export const RGX_ORIGIN_LINE = /^(\/\/|\/\*|#|<!--)\s*<origin\s*src=["'](.*)["']\s*\/>/;
const GLOB_EXCLUDES = ['!**/.git/**', '!**/node_modules/**'];
const EXT_DEFAULT = '(ts|pcss|js|css|swift|rust|java|py|go|yaml|html|tmpl)';

//#region    ---------- list files ---------- 
/**
 * List the (.ts, files in all of the sub directory
 * @param pattern a glob, or a dir, or nothing (will default to './')
 */
export async function listFiles(pattern?: string) {
	// if known, current directory
	pattern = (!pattern) ? './' : pattern;

	// if pattern is not a glob, we add the default glob pattern
	if (pattern.indexOf('*') === -1) {
		pattern = join(pattern, '/**/*.+' + EXT_DEFAULT);
	}

	// add the default extensions if pattern end with **
	if (pattern.endsWith('**')) {
		pattern += '/*.+' + EXT_DEFAULT;
	}

	// TODO: probably needs to check that the pattern is still relative to current dir (to avoid changing parent folder files)

	const globExp = [...GLOB_EXCLUDES, pattern];
	const files = await glob(globExp);
	const fileInfoList: FileInfo[] = [];

	for (const file of files) {
		const firstLine = await readFirstLine(file);
		if (firstLine) {
			const m = firstLine.match(RGX_ORIGIN_LINE);
			if (m && m.length > 2) {
				const src = m[2].trim();
				fileInfoList.push({ file, firstLine, origin: { src } });
			}
		}

	}
	return fileInfoList;
}
//#endregion ---------- /list files ---------- 

//#region    ---------- Fetch Origin ---------- 

/**
 * Read and return a file content given it's url or path. 
 * If starts with 'http' it will do a http load, otherwise, will do a local file system read. 
 * @param url 'https://....' or local path '../my_other_project/src/base.ts'
 */
export async function readContent(url: string): Promise<string> {
	if (url.startsWith('http')) {
		const response = await got(url, { timeout: 300 });
		return response.body;
	}
	// else assume, local file
	else {
		const content = await readFile(url, 'utf8');
		return content;
	}
}

//#endregion ---------- /Fetch Origin ---------- 

// reads and returns the first line of a file (and stop)
export async function readFirstLine(file: string): Promise<string | null> {

	return new Promise((resolve, reject) => {

		try {
			let rl = readline.createInterface({
				input: createReadStream(file)
			});

			rl.on('line', function (line) {
				resolve(line);
				rl.close();
			});
			rl.on('close', function () {
				resolve(null);
				rl.close();
			});

		} catch (ex) {
			reject(ex);
		}
	})



}