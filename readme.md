#  bURLa [![npm install burla](https://img.shields.io/badge/npm%20install-burla-blue.svg)](https://www.npmjs.com/package/burla) [![gzip size](https://img.badgesize.io/franciscop/burla/master/index.min.js.svg?compression=gzip)](https://github.com/franciscop/burla/blob/master/index.min.js)

Advanced URL manipulation library using the History API:

```js
// Path - redirect to the url without refresh
// https://example.com/users
import url from 'burla';

url.path = '/hello/world';
// https://example.com/hello/world
```

```js
// Query - change query strings independently
// https://example.com/?language=es
import url from 'burla';

url.query.text = 'burla';
// https://example.com/?language=es&text=burla

url.query.language = 'en';
// https://example.com/?language=en&text=burla

delete url.query.language;
// https://example.com/?text=burla
```

The default export will manipulate the `window.location`, effectively changing the current browser URL and adding a new page to the history.

But you can create and manipulate URLs without affecting the `window.location`:

```js
import burla from 'burla';

const url = burla.URL('https://example.com/');
url.query.code = '123456';  // <- no redirects
fetch(url.href).then()
```
