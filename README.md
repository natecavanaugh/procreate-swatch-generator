# procreate-swatch-generator
[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

> Generate a Procreate swatches file from a list of colors


## Install

```
$ npm install --save procreate-swatch-generator
```


## Usage

```js
var procreateSwatchGenerator = require('procreate-swatch-generator');

procreateSwatchGenerator('belgian');
//=> BEST BEER EVAR!
```

## CLI

```
$ npm install --global procreate-swatch-generator
```
```
$ procreate-swatch-generator --help

  Usage
    procreate-swatch-generator [input]

  Example
    procreate-swatch-generator
    BEER!

    procreate-swatch-generator belgian
    BEST BEER EVAR!

  Options
    --foo Lorem ipsum. Default: false
```


## API

### procreateSwatchGenerator(input, [options])

#### input

*Required*
Type: `string`

Lorem ipsum.

#### options

##### foo

Type: `boolean`
Default: `false`

Lorem ipsum.


## License

MIT © [Nate Cavanaugh](http://alterform.com)

[npm-image]: https://img.shields.io/npm/v/procreate-swatch-generator.svg?style=flat-square
[npm-url]: https://npmjs.org/package/procreate-swatch-generator
[travis-image]: https://img.shields.io/travis/natecavanaugh/procreate-swatch-generator/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/natecavanaugh/procreate-swatch-generator
[coveralls-image]: https://img.shields.io/coveralls/natecavanaugh/procreate-swatch-generator/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/natecavanaugh/procreate-swatch-generator?branch=master