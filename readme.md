# burla - better url abstraction [![npm install burla](https://img.shields.io/badge/npm%20install-burla-blue.svg)](https://www.npmjs.com/package/burla) [![gzip size](https://img.badgesize.io/franciscop/burla/master/index.min.js.svg?compression=gzip)](https://github.com/franciscop/burla/blob/master/index.min.js)

A URL manipulation library using the History API:

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

// Change a single query while maintaining the rest:
url.query.text = 'hello';
// https://example.com/?language=es&text=hello

// Works with query arrays:
url.query.language = ['en', 'es'];
// https://example.com/?language[]=en&language[]=es&text=hello

// Remove a single query:
delete url.query.language;
// https://example.com/?text=hello
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

If you want to modify several parameters at once without triggering different history events, you can call `.query = { ... }` with the parameters. This will accept **all** the new parameters, ignoring previous ones:

```js
// https://example.com/?code=a1b2
import url from 'burla';

// To maintain the previous parameters with the function, add them manually:
url.query = { ...url.query, user: 'franciscop' };
// https://example.com/?code=a1b2&user=franciscop

// Otherwise the previous parameters will be removed:
url.query = { logged: true };
// https://example.com/?logged=true
```



### `.hash`

Read the hash (without the `#` symbol) and modify it:

```js
// https://example.com/#better-section
import url from 'burla';

url.hash = 'abc';
// https://example.com/#abc
```



### URL()

This can be imported in two ways:

```js
import burla, { URL } from 'burla';

console.log(burla.URL('http://localhost/'));  // Method 1
console.log(URL('http://localhost/'));  // Method 2
```

You can create and manipulate URLs without affecting the `window.location`:

```js
import burla from 'burla';

// Create a new url that is detached from `window.location`:
const url = URL('https://example.com/');
url.query.code = '123456';  // <- no redirects
console.log(url.href);
// https://example.com/?code=123456
```
