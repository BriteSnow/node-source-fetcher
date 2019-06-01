import { copy, mkdirs, saferRemove, glob } from 'fs-extra-plus';
import { sfetch } from '../src/index';
import { listFiles } from '../src/utils';
import { strictEqual } from 'assert';

const testDataDir = './test/data/src/';
const testTmpDir = './test/~tmp/';

describe("index", function () {

	it("dev", async () => {
		//const files = await glob(['**/*.js', '!**/.git/**', '!**/node_modules/**']);
	});

	it("list", async () => {
		let files = await listFiles(testDataDir);
		strictEqual(files.length, 6, `source files in ${testDataDir}`);

		files = await listFiles('./src/**.ts');
		strictEqual(files.length, 0, `source with origin files in "./src/**.ts"`);

		files = await listFiles(`${testDataDir}**/*.ts`);
		strictEqual(files.length, 2, `source files in "${testDataDir}**/*.ts"`);

		files = await listFiles(`${testDataDir}**/*.pcss`);
		strictEqual(files.length, 1, `source files in "${testDataDir}**/*.pcss"`);
	});

	it("sfetch", async function () {
		this.timeout(5000);
		await saferRemove(testTmpDir);
		await mkdirs(testTmpDir);
		await copy(testDataDir, testTmpDir);
		const files = await sfetch(testTmpDir);
		for (const f of files) {
			if (f.status === "failed") {
				throw new Error(`File ${f.file} did not process because ${f.error}`);
			}
		}
	});
});