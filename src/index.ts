
import { listFiles, RGX_ORIGIN_LINE, readContent } from './utils';
import { writeFile } from 'fs-extra-plus';


type FetchedItem = {
	success: boolean,
	file: string,
	firstLine: string,
	origin: string,
	error?: string,
}


export async function sfetch(pattern: string) {
	const files = await listFiles(pattern);
	const data: FetchedItem[] = [];
	for (const fi of files) {

		try {

			const firstLine = fi.firstLine;

			let originBody = await readContent(fi.origin);


			// remove the eventual origin firstLine
			const originFirsLineIdx = originBody.indexOf('\n');
			const originFirstLine = originBody.substring(0, originFirsLineIdx); // will return '' if -1
			// if the originBody start with a origin line, we remove it. 
			if (originFirstLine.match(RGX_ORIGIN_LINE)) {
				originBody = (originFirsLineIdx + 1 < originBody.length) ? originBody.substring(originFirsLineIdx + 1) : '';
			}

			const newBody = firstLine + '\n' + originBody;

			await writeFile(fi.file, newBody);

			data.push({ ...fi, success: true });
		} catch (ex) {
			const error = (ex.message) ? ex.message : '' + ex;
			data.push({ ...fi, error, success: false });
		}

	}

	return data;
}


