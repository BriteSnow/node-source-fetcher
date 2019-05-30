
import { listFiles, RGX_ORIGIN_LINE, readContent } from './utils';
import { writeFile, readFile } from 'fs-extra-plus';


type Status = 'replaced' | 'skipped' | 'failed';

type FetchedItem = {
	status: Status,
	file: string,
	firstLine: string,
	origin: {
		src: string
	},
	error?: string,
}


export async function sfetch(pattern: string) {
	const files = await listFiles(pattern);
	const data: FetchedItem[] = [];
	for (const fi of files) {

		try {

			const firstLine = fi.firstLine;

			let originBody = await readContent(fi.origin.src);


			// remove the eventual origin firstLine
			const originFirsLineIdx = originBody.indexOf('\n');
			const originFirstLine = originBody.substring(0, originFirsLineIdx); // will return '' if -1
			// if the originBody start with a origin line, we remove it. 
			if (originFirstLine.match(RGX_ORIGIN_LINE)) {
				originBody = (originFirsLineIdx + 1 < originBody.length) ? originBody.substring(originFirsLineIdx + 1) : '';
			}

			// create the new content
			const newBody = firstLine + '\n' + originBody;

			// compare the new content with existing content
			const currentBody = await readFile(fi.file, 'utf8');
			if (newBody === currentBody) {
				data.push({ ...fi, status: 'skipped' })
			} else {
				await writeFile(fi.file, newBody);
				data.push({ ...fi, status: 'replaced' })
			}
		} catch (ex) {
			const error = (ex.message) ? ex.message : '' + ex;
			data.push({ ...fi, status: 'failed', error });
		}

	}

	return data;
}


