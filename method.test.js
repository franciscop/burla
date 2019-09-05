import burla, { URL } from "./index";

const replace = url => window.history.replaceState(null, null, url);
const push = url => window.history.pushState(null, null, url);

describe("burla.URL()", () => {
  it("defaults to window.location", () => {
    const url = burla.URL();
    expect(url.path).toBe("/");
    expect(url.pathname).toBe("/");
    expect(burla.path).toBe("/");
    expect(window.location.pathname).toBe("/");
    replace("/users");
    expect(url.path).toBe("/users");
    expect(url.pathname).toBe("/users");
    expect(burla.path).toBe("/users");
    expect(window.location.pathname).toBe("/users");
    replace("/");
    expect(url.path).toBe("/");
    expect(url.pathname).toBe("/");
    expect(burla.path).toBe("/");
    expect(window.location.pathname).toBe("/");
  });

  it("can read a path", () => {
    const url = burla.URL("http://localhost/users?hello=world");
    expect(url.path).toBe("/users");
    expect(url.query.hello).toBe("world");
    expect(burla.path).toBe("/");
    expect(window.location.pathname).toBe("/");
  });

  it("is stable by default", () => {
    const url = burla.URL("http://localhost/users?c=d&a=b");
    expect(url.href).toBe("http://localhost/users?a=b&c=d");
  });
});

describe("burla.URL().path", () => {
  let url;
  beforeEach(() => {
    url = burla.URL("http://localhost/");
  });

  it("does not follow the global path", () => {
    expect(url.href).toBe("http://localhost/");
    expect(burla.href).toBe("http://localhost/");
    burla.path = "/hello";
    expect(url.href).toBe("http://localhost/");
    expect(burla.href).toBe("http://localhost/hello");
    burla.path = "";
    expect(url.href).toBe("http://localhost/");
    expect(burla.href).toBe("http://localhost/");
  });

  it("can set up the path", () => {
    expect(url.href).toBe("http://localhost/");
    url.path = "/hello/world";
    expect(url.href).toBe("http://localhost/hello/world");
    url.path = "/";
    expect(url.href).toBe("http://localhost/");
  });

  it("can set up the pathname", () => {
    expect(url.href).toBe("http://localhost/");
    url.pathname = "/hello/world";
    expect(url.href).toBe("http://localhost/hello/world");
    url.pathname = "/";
    expect(url.href).toBe("http://localhost/");
  });

  it("can read the path set with `url.path = ...`", () => {
    expect(url.path).toBe("/");
    url.path = "/hello/world";
    expect(url.path).toBe("/hello/world");
    url.path = "/";
    expect(url.path).toBe("/");
  });

  // Note: these are the main diff between burla.path and URL().path
  it("will ignore a global `pushState(...)`", () => {
    expect(url.path).toBe("/");
    push("/hello/world");
    expect(url.path).toBe("/");
    push("/");
    expect(url.path).toBe("/");
  });

  // Note: these are the main diff between burla.path and URL().path
  it("will ignore a global `replaceState(...)`", () => {
    expect(url.path).toBe("/");
    replace("/hello/world");
    expect(url.path).toBe("/");
    replace("/");
    expect(url.path).toBe("/");
  });

  it("can delete the path to reset it", () => {
    expect(url.path).toBe("/");
    url.path = "/hello/world";
    expect(url.path).toBe("/hello/world");
    delete url.path;
    expect(url.path).toBe("/");
  });

  it("can delete the pathname to reset it", () => {
    expect(url.path).toBe("/");
    url.path = "/hello/world";
    expect(url.path).toBe("/hello/world");
    delete url.pathname;
    expect(url.path).toBe("/");
  });
});

describe("burla.URL().query", () => {
  let url;
  beforeEach(() => {
    url = burla.URL("http://localhost/");
  });

  it("does not follow the global query", () => {
    expect(url.href).toBe("http://localhost/");
    expect(burla.href).toBe("http://localhost/");
    replace("/?a=b&e=f&c=d");
    expect(url.href).toBe("http://localhost/");
    expect(burla.href).toBe("http://localhost/?a=b&c=d&e=f");
    replace("/");
    expect(url.href).toBe("http://localhost/");
    expect(burla.href).toBe("http://localhost/");
  });

  it("can set a query parameter", () => {
    expect(url.href).toBe("http://localhost/");
    url.query.hello = "world";
    expect(url.href).toBe("http://localhost/?hello=world");
    delete url.query.hello;
    expect(url.href).toBe("http://localhost/");
  });

  it("can set a query parameter with an object", () => {
    expect(url.href).toBe("http://localhost/");
    url.query = { hello: "world" };
    expect(url.href).toBe("http://localhost/?hello=world");
    delete url.query.hello;
    expect(url.href).toBe("http://localhost/");
  });

  it("can delete the whole query to reset it", () => {
    expect(url.href).toBe("http://localhost/");
    url.query = { hello: "world" };
    expect(url.href).toBe("http://localhost/?hello=world");
    delete url.query;
    expect(url.href).toBe("http://localhost/");
  });

  it("can extend a query", () => {
    expect(url.href).toBe("http://localhost/");
    url.query = { hello: "world" };
    expect(url.href).toBe("http://localhost/?hello=world");
    url.query = { ...url.query, bye: "there" };
    expect(url.href).toBe("http://localhost/?bye=there&hello=world");
    delete url.query;
    expect(url.href).toBe("http://localhost/");
  });

  it("can set a query parameter with an object twice", () => {
    expect(url.href).toBe("http://localhost/");
    url.query = { hello: "world" };
    expect(url.href).toBe("http://localhost/?hello=world");
    url.query = { hello: "sekai" };
    expect(url.href).toBe("http://localhost/?hello=sekai");
    delete url.query.hello;
    expect(url.href).toBe("http://localhost/");
  });

  it("escapes characters", () => {
    expect(url.href).toBe("http://localhost/");
    url.query.hello = "wo/ld";
    expect(url.href).toBe("http://localhost/?hello=wo%2Fld");
    delete url.query.hello;
    expect(url.href).toBe("http://localhost/");
  });

  it("escapes characters with the object", () => {
    expect(url.href).toBe("http://localhost/");
    url.query = { hello: "wo/ld" };
    expect(url.href).toBe("http://localhost/?hello=wo%2Fld");
    delete url.query.hello;
    expect(url.href).toBe("http://localhost/");
  });

  // Note: these are the main diff between burla.query[] and URL().query[]
  it("will ignore a global `pushState(...)`", () => {
    expect(url.query.hello).toBe(undefined);
    push("/?hello=world");
    expect(url.query.hello).toBe(undefined);
    push("/");
  });

  // Note: these are the main diff between burla.query[] and URL().query[]
  it("will ignore a global `replaceState(...)`", () => {
    expect(url.query.hello).toBe(undefined);
    replace("/?hello=world");
    expect(url.query.hello).toBe(undefined);
    replace("/");
  });

  it("sets the parameters alphabetically", () => {
    expect(url.href).toBe("http://localhost/");
    url.query.hello = "world";
    expect(url.href).toBe("http://localhost/?hello=world");
    url.query.bye = "there";
    expect(url.href).toBe("http://localhost/?bye=there&hello=world");
    delete url.query.bye;
    expect(url.href).toBe("http://localhost/?hello=world");
    delete url.query.hello;
    expect(url.href).toBe("http://localhost/");
  });

  it("accepts arrays in queries", () => {
    const a = url.URL("http://localhost/?a[]=b");
    expect(a.query.a).toEqual(["b"]);
  });

  it("accepts duplicated keys in queries", () => {
    const curr = url.URL("http://localhost/?a=b&c=d&a=e");
    expect(curr.query.a).toEqual("e");
  });
});

describe("burla.URL().hash", () => {
  let url;
  beforeEach(() => {
    url = burla.URL("http://localhost/");
  });

  it("does not follow the global hash", () => {
    expect(url.href).toBe("http://localhost/");
    expect(burla.href).toBe("http://localhost/");
    burla.hash = "hello";
    expect(url.href).toBe("http://localhost/");
    expect(burla.href).toBe("http://localhost/#hello");
    burla.hash = "";
    expect(url.href).toBe("http://localhost/");
    expect(burla.href).toBe("http://localhost/");
  });

  it("is empty by default", () => {
    expect(url.hash).toBe("");
  });

  it("can be modified", () => {
    expect(url.href).toBe("http://localhost/");
    expect(url.hash).toBe("");
    url.hash = "hello";
    expect(url.href).toBe("http://localhost/#hello");
    url.hash = "";
    expect(url.href).toBe("http://localhost/");
  });

  it("will not duplicate the beginning hashtag", () => {
    expect(url.href).toBe("http://localhost/");
    expect(url.hash).toBe("");
    url.hash = "#hello";
    expect(url.href).toBe("http://localhost/#hello");
    url.hash = "";
    expect(url.href).toBe("http://localhost/");
  });

  it("can be deleted", () => {
    expect(url.href).toBe("http://localhost/");
    expect(url.hash).toBe("");
    url.hash = "hello";
    expect(url.href).toBe("http://localhost/#hello");
    delete url.hash;
    expect(url.href).toBe("http://localhost/");
  });

  it("can be modified", () => {
    expect(url.hash).toBe("");
    url.hash = "hello";
    expect(url.href).toBe("http://localhost/#hello");
  });
});
