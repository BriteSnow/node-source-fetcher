## Intro 

`source-fetcher` is a utility to reuse source files without having to make them into a library. In other words, `source-fetcher` is for sharing code that should not be in a library.

- Just add a `//<origin src='...'/>` comment-tag as the first line of your designated source files.
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
//<origin src="https://raw.githubusercontent.com/BriteSnow/cloud-starter/master/frontends/web/src/web-components/c-base.ts " />
import { puller, pusher, trigger } from "mvdom";
import { attr } from "ts/utils";
....// here will be the codeo from the origin c-base.ts which might be stale
```

Run `npm run sf` 

All files with first line starting with `//<origin` or `/*<origin` and a value `src` attribute will see their content replaced with the content of the origin src file, except the first `//<origin` which will be preserved. 

Supports glob expression `npm run sf 'src/**.ts'` 

Ignore `node_modules/**` and `.git/**`.

## Programmatic

```js
import {sfetch} from 'source-fetcher'

run();

async function run(){
  const files = await sfetch('src/**.ts');
}

```

## Notes

- Supported default file extensions `ts|pcss|js|css|swift|rust|java|py|go`
- `//<origin` must be first line, first character, with no space. The rest of the tag can have spaces. 
- When glob pattern ends with `**` the default file extension `/*.+(ts|pcss....)` will be added. This allows to do `npm run sf 'src/**'` and still have the above default extensions added.
- Beware that this files will be modified on fetch and are not generally intended to be modified on the current folder. 


### Roadmap

- add more extension support 
- Supports multiple glob params, including exclude `npm run sf 'src/**/*.ts' '!test/**'`
- add `--dry-run` mode
- Add support for **slots** `<slot name='a-placeholder'/>`
- Check that planned files to be updated are not in a git uncommitted state. 
