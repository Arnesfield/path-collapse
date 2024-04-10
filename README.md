[npm-img]: https://img.shields.io/npm/v/path-collapse.svg
[npm-url]: https://www.npmjs.com/package/path-collapse
[ci-img]: https://github.com/Arnesfield/path-collapse/workflows/Node.js%20CI/badge.svg
[ci-url]: https://github.com/Arnesfield/path-collapse/actions?query=workflow%3A"Node.js+CI"

# path-collapse

[![npm][npm-img]][npm-url]
[![Node.js CI][ci-img]][ci-url]

Collapse paths that are part of another path.

## Install

```sh
npm install path-collapse
```

## Usage

Import the module ([ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)).

```javascript
import collapse from 'path-collapse';
```

The `collapse(paths)` function accepts an array of strings (paths) to collapse. It returns a `Collapsed` object with the following properties:

- `roots` - An object with root paths mapped to descendant paths.
- `descendants` - An object with descendant paths mapped to ancestor paths.

Note that absolute and relative paths do not collapse into each other. For consistency, it is advised to resolve all paths into one kind (absolute or relative) before collapsing.

```javascript
const collapsed = collapse([
  'a/b',
  '/a/b',
  'a/b/c',
  '/b',
  'a',
  '/a/b/c',
  'a/b/c/../../b' // resolves to 'a/b'
]);
console.log(collapsed);

// get all root paths
console.log('roots:', Object.keys(collapsed.roots));

// get all descendant paths
console.log('descendants:', Object.keys(collapsed.descendants));

// check if path is a root path
console.log('is a/b root:', 'a/b' in collapsed.roots);

// check if path is a descendant path
console.log('is a/b descendant:', 'a/b' in collapsed.descendants);
```

```text
{
  roots: [Object: null prototype] {
    '/a/b': [ '/a/b/c' ],
    '/b': [],
    a: [ 'a/b', 'a/b/c/../../b', 'a/b/c' ]
  },
  descendants: [Object: null prototype] {
    '/a/b/c': [ '/a/b' ],
    'a/b': [ 'a' ],
    'a/b/c/../../b': [ 'a' ],
    'a/b/c': [ 'a' ]
  }
}
roots: [ '/a/b', '/b', 'a' ]
descendants: [ '/a/b/c', 'a/b', 'a/b/c/../../b', 'a/b/c' ]
is a/b root: false
is a/b descendant: true
```

## License

Licensed under the [MIT License](LICENSE).
