import burla, { URL } from "./index";

const replace = url => window.history.replaceState(null, null, url);
const push = url => window.history.pushState(null, null, url);

describe("URL()", () => {
  let url;
  beforeEach(() => {
    url = URL("http://localhost/");
  });
  afterEach(() => {
    burla.path = "/";
    burla.query = {};
    burla.hash = "";
    url.path = "/";
    url.query = {};
    url.hash = "";
    expect(url.href).toBe("http://localhost/");
  });

  it("is the same as burla.URL", () => {
    expect(URL).toBe(burla.URL);
  });

  it("defaults to window.location", () => {
    const url = URL();
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
    const url = URL("http://localhost/users?hello=world");
    expect(url.path).toBe("/users");
    expect(url.query.hello).toBe("world");
    expect(burla.path).toBe("/");
    expect(window.location.pathname).toBe("/");
  });

  it("is stable by default", () => {
    const url = URL("http://localhost/users?c=d&a=b");
    expect(url.href).toBe("http://localhost/users?a=b&c=d");
  });

  describe("URL().path", () => {
    let url;
    beforeEach(() => {
      url = URL("http://localhost/");
    });
    afterEach(() => {
      burla.path = "/";
      burla.query = {};
      burla.hash = "";
      url.path = "/";
      url.query = {};
      url.hash = "";
      expect(url.href).toBe("http://localhost/");
    });

    it("does not follow the global path", () => {
      expect(url.href).toBe("http://localhost/");
      expect(burla.href).toBe("http://localhost/");
      burla.path = "/hello";
      expect(url.href).toBe("http://localhost/");
      expect(burla.href).toBe("http://localhost/hello");
    });

    it("can set up the path", () => {
      url.path = "/hello/world";
      expect(url.href).toBe("http://localhost/hello/world");
    });

    it("can set up the pathname", () => {
      url.pathname = "/hello/world";
      expect(url.href).toBe("http://localhost/hello/world");
    });

    it("can read the path set with `url.path = ...`", () => {
      url.path = "/hello/world";
      expect(url.path).toBe("/hello/world");
    });

    // Note: these are the main diff between burla.path and URL().path
    it("will ignore a global `pushState(...)`", () => {
      push("/hello/world");
      expect(url.path).toBe("/");
    });

    // Note: these are the main diff between burla.path and URL().path
    it("will ignore a global `replaceState(...)`", () => {
      replace("/hello/world");
      expect(url.path).toBe("/");
    });

    it("can delete the path to reset it", () => {
      url.path = "/hello/world";
      expect(url.path).toBe("/hello/world");
      delete url.path;
      expect(url.path).toBe("/");
    });

    it("can delete the pathname to reset it", () => {
      url.path = "/hello/world";
      expect(url.path).toBe("/hello/world");
      delete url.pathname;
      expect(url.path).toBe("/");
    });
  });

  describe("burla.URL().query", () => {
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
      url.query.hello = "world";
      expect(url.href).toBe("http://localhost/?hello=world");
    });

    it("can set a query parameter with an object", () => {
      url.query = { hello: "world" };
      expect(url.href).toBe("http://localhost/?hello=world");
    });

    it("can delete the whole query to reset it", () => {
      url.query = { hello: "world" };
      expect(url.href).toBe("http://localhost/?hello=world");
      delete url.query;
      expect(url.href).toBe("http://localhost/");
    });

    it("can extend a query", () => {
      url.query = { hello: "world" };
      expect(url.href).toBe("http://localhost/?hello=world");
      url.query = { ...url.query, bye: "there" };
      expect(url.href).toBe("http://localhost/?bye=there&hello=world");
    });

    it("can set a query parameter with an object twice", () => {
      url.query = { hello: "world" };
      expect(url.href).toBe("http://localhost/?hello=world");
      url.query = { hello: "sekai" };
      expect(url.href).toBe("http://localhost/?hello=sekai");
    });

    it("escapes characters", () => {
      url.query.hello = "wo/ld";
      expect(url.href).toBe("http://localhost/?hello=wo%2Fld");
    });

    it("escapes characters with the object", () => {
      url.query = { hello: "wo/ld" };
      expect(url.href).toBe("http://localhost/?hello=wo%2Fld");
    });

    // Note: these are the main diff between burla.query[] and URL().query[]
    it("will ignore a global `pushState(...)`", () => {
      push("/?hello=world");
      expect(url.query.hello).toBe(undefined);
    });

    // Note: these are the main diff between burla.query[] and URL().query[]
    it("will ignore a global `replaceState(...)`", () => {
      replace("/?hello=world");
      expect(url.query.hello).toBe(undefined);
    });

    it("sets the parameters alphabetically", () => {
      url.query.hello = "world";
      expect(url.href).toBe("http://localhost/?hello=world");
      url.query.bye = "there";
      expect(url.href).toBe("http://localhost/?bye=there&hello=world");
      delete url.query.bye;
      expect(url.href).toBe("http://localhost/?hello=world");
    });

    it("accepts arrays in queries", () => {
      expect(URL("http://localhost/?a[]=b").query.a).toEqual(["b"]);
    });

    it("will overwrite previous keys by default", () => {
      expect(URL("http://localhost/?a=b&c=d&a=e").query.a).toBe("e");
    });

    it("accepts duplicated keys in queries", () => {
      expect(
        URL("http://localhost/?a=b&a=c", { arrayFormat: "none" }).query.a
      ).toEqual(["b", "c"]);
      expect(
        URL("http://localhost/?a[]=b&a[]=c", { arrayFormat: "bracket" }).query.a
      ).toEqual(["b", "c"]);
      expect(
        URL("http://localhost/?a[1]=b&a[2]=c", { arrayFormat: "index" }).query.a
      ).toEqual({ 1: "b", 2: "c" });
      expect(
        URL("http://localhost/?a=b,c", { arrayFormat: "comma" }).query.a
      ).toEqual(["b", "c"]);
    });
  });

  describe("burla.URL().hash", () => {
    it("is empty by default", () => {
      expect(url.href).toBe("http://localhost/");
      expect(url.hash).toBe("");
    });

    it("does not follow the global hash", () => {
      burla.hash = "hello";
      expect(url.href).toBe("http://localhost/");
      expect(burla.href).toBe("http://localhost/#hello");
    });

    it("the global hash  does not follow the local one", () => {
      url.hash = "hello";
      expect(url.href).toBe("http://localhost/#hello");
      expect(burla.href).toBe("http://localhost/");
    });

    it("can be modified", () => {
      url.hash = "hello";
      expect(url.href).toBe("http://localhost/#hello");
    });

    it("will not duplicate the beginning hashtag", () => {
      url.hash = "#hello";
      expect(url.href).toBe("http://localhost/#hello");
    });

    it("can be deleted", () => {
      url.hash = "hello";
      expect(url.href).toBe("http://localhost/#hello");
      delete url.hash;
      expect(url.href).toBe("http://localhost/");
    });
  });
});
