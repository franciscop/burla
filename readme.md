#  burla [![npm install burla](https://img.shields.io/badge/npm%20install-burla-blue.svg)](https://www.npmjs.com/package/burla) [![gzip size](https://img.badgesize.io/franciscop/burla/master/index.min.js.svg?compression=gzip)](https://github.com/franciscop/burla/blob/master/index.min.js)

URL manipulation library using the History API to avoid refreshing the browser:

```js
// https://example.com/users
import url from 'burla';

url.path = '/hello/world'; // No refresh here
// https://example.com/hello/world
```

Can change queries easily even when there's already a search query:

```js
// https://example.com/?language=es
import url from 'burla';

url.query.text = 'burla';
// https://example.com/?language=es&text=burla

url.query.language = 'en';
// https://example.com/?language=en&text=burla

delete url.query.language;
// https://example.com/?text=burla
```

The default export will manipulate the `window.location`, effectively changing the current browser URL and adding a new page to the history. You can also [manipulate url strings without changing the browser](#manipulate-local-urls).


## API

### `.path` (or `.pathname`)

Change the full path in the browser:

```js
// Path - redirect to the url without refresh
// https://example.com/users
import url from 'burla';

url.path = '/hello/world';
// https://example.com/hello/world
```

Redirect a React Router page without worries:

```js
import url from 'burla';

export default () => {
  const login = () => {
    // do something fancy here

    url.path = '/user';
  };
  return <div onClick={login}>Login!</div>;
};
```


### `.query`

Modify parameters from the query string independently:

```js
// https://example.com/?code=123
import url from 'burla';

const code = url.query.code;
delete url.query.code;
// https://example.com/

url.query.logged = true;
// https://example.com/?logged=true

console.log(typeof url.query.logged);
// string
```

They are always casted to strings and url entities are escapped, as standard with search strings.

If you want to modify several parameters at once without triggering different history events, you can call `.query({ ... })` with the parameters. This function takes **all** the new parameters, ignoring previous ones:

```js
// https://example.com/?code=123
import url from 'burla';

// To maintain the previous parameters with the function, add them manually:
url.query({ ...url.query, logged: true });
// https://example.com/?code=123&logged=true

// Otherwise the previous parameters will be removed:
url.query({ logged: true });
// https://example.com/?logged=true
```

To keep the previous parameters you can expand it:

```js
// https://example.com/?code=123
const code = url.query.code;
// ...
```


### `.hash`

Modify the hash


## Manipulate local URLs

But you can create and manipulate URLs without affecting the `window.location`:

```js
import burla from 'burla';

const url = burla.URL('https://example.com/');
url.query.code = '123456';  // <- no redirects
console.log(url.href);
// https://example.com/?code=123456
```
