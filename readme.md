#  bURLa [![npm install burla](https://img.shields.io/badge/npm%20install-burla-blue.svg)](https://www.npmjs.com/package/burla) [![gzip size](https://img.badgesize.io/franciscop/burla/master/index.min.js.svg?compression=gzip)](https://github.com/franciscop/burla/blob/master/index.min.js)


Sensible URL manipulation library using the History API. Examples:

```js
// Redirect to the url without refresh:
import url from 'burla';

// Keeps query and hash the same, only changes the path
url.path = '/hello/world';
```

```js
// Read and remove a code from the query string:
import url from 'burla';

const code = url.query.code;
if (code) {
  // Do something
}

// Delete it from the URL without redirect
delete url.query.code;
```

Why? Do you know how difficult it is to change a single query string parameter without this library? No, and you don't want to know.
