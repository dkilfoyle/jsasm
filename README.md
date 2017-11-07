# jsasm

> A toy assembler in javascript

Based on https://www.mschweighauser.com/make-your-own-assembler-simulator-in-javascript-part1/

## Build Setup

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:8080
$ quasar dev

# build for production with minification
$ quasar build

# lint code
$ quasar lint
```
## antlr and ace setup

1. Download ACE v1.2.6
2. Add jsasm mode and worker and highlighter
3. Build ACE to generate ace-builds
4. Upload ace-builds to a repo
5. Clone brace
6. change build/update.js to point to dkilfoyle/ace-builds
7. changer workers.js to include jsasm
8. npm run update in brace
9. copy brace jsasm/node_modules

