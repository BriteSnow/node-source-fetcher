## Intro 

`source-fetcher` is a utility to reuse source files without having to make them into a library. In other words, `source-fetcher` is for sharing code that should not be in a library.

- Just add a `// <origin src='...'/>` comment-tag as the first line of your designated source files.
- Run the `npm run sf` command.
- All marked files content will be replaced with their origin.src content (the first line will be preserved)


## Install

`npm install source-fetcher --save-dev`

Probably want to add a package.json script entry:

```js
...
  "scripts": {
    ...,
    "sf": "node ./node_modules/source-fetcher/dist/bin-sf.js"
  }
...
```

## Command Example

Create a file **src/web-components/c-base.ts** with the following content

```ts
// <origin src="https://raw.githubusercontent.com/BriteSnow/cloud-starter/master/frontends/web/src/web-components/c-base.ts " />
import { puller, pusher, trigger } from "mvdom";
import { attr } from "ts/utils";
....// here will be the codeo from the origin c-base.ts which might be stale
```

Run `npm run sf` 

All files with first line starting with `// <origin` or `/* <origin` and a value `src` attribute will see their content replaced with the content of the origin src file, except the first `// <origin` which will be preserved. 

Supports glob expression `npm run sf 'src/**.ts'` 

Ignore `node_modules/**` and `.git/**`.

## Programmatic

> Warning: API will change! 

```js
import {sfetch} from 'source-fetcher'

run();

async function run(){
  const files = await sfetch('src/**.ts');
}

```

## Command Options

- `-l` to list all of the fetchable files (files marked with a valid `// <origin ...` comment tag)
- `-o` show the orgin.scr next to the fetchable (for now only works with `-l`, e.g., `-lo`)

> Tips: When `sf` used from npm script, `--` must be added before the options. e.g., `npm run sf "src/**" -- -l`

## Notes

- Supported default file extensions `ts|pcss|js|css|swift|rust|java|py|go`
- `// <origin` must be in the first line at the beginning of the line.
- When glob pattern ends with `**` the default file extensions `/*.+(ts|pcss....)` will be added. This allows to do `npm run sf 'src/**'` and still have the above default extensions added.
- Beware that there are current no  git guard that check if the files to be replaced have been committed or not. 


### Roadmap

- Only write files when the content actually change. 
- Add support for `# <origin ...>` comment-tag (e.g., for python and yaml)
- Update the console log (`== Fetched: 6 | Replaced: 2 | Skipped: 3 | Failed: 1` ) (what is called 'Skipped' will be called 'Failed')
  - Only Replaced and Failed source files will be listed. 
- Add color to console log.
- Supports multiple glob params, including exclude `npm run sf 'src/**/*.ts' '!test/**'`
- add `--dry-run` mode
- Git guard: Pause and ask to continue when a source files are scheduled to be replaced but were not committed. (will stop the replace of others as well until user confirm to override)
- Add support for **insert** `<insert at="last">...</insert>` and/or **slots** `<slot name='a-placeholder'/>` 

