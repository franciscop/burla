import burla from "./index";

const replace = url => window.history.replaceState(null, null, url);
const push = url => window.history.pushState(null, null, url);

describe("burla()", () => {
  let url;
  beforeEach(() => {
    url = burla("http://localhost/");
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

  describe("burla()", () => {
    it("defaults to window.location", () => {
      const url = burla();
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
      const url = burla("http://localhost/users?hello=world");
      expect(url.path).toBe("/users");
      expect(url.query.hello).toBe("world");
      expect(burla.path).toBe("/");
      expect(window.location.pathname).toBe("/");
    });

    it("is stable by default", () => {
      const url = burla("http://localhost/users?c=d&a=b");
      expect(url.href).toBe("http://localhost/users?a=b&c=d");
    });
  });

  describe("URL().path", () => {
    it("does not follow the global path", () => {
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
      replace("/?a=b&e=f&c=d");
      expect(url.href).toBe("http://localhost/");
      expect(burla.href).toBe("http://localhost/?a=b&c=d&e=f");
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
      expect(burla("http://localhost/?a[]=b").query.a).toEqual(["b"]);
    });

    it("will overwrite previous keys by default", () => {
      expect(burla("http://localhost/?a=b&c=d&a=e").query.a).toBe("e");
    });

    it("can parse them with options", () => {
      expect(
        burla("http://localhost/?a=b&a=c", { arrayFormat: "none" }).query.a
      ).toEqual(["b", "c"]);
      expect(
        burla("http://localhost/?a[]=b&a[]=c", { arrayFormat: "bracket" }).query
          .a
      ).toEqual(["b", "c"]);
      expect(
        burla("http://localhost/?a[1]=b&a[2]=c", { arrayFormat: "index" }).query
          .a
      ).toEqual({ 1: "b", 2: "c" });
      expect(
        burla("http://localhost/?a=b,c", { arrayFormat: "comma" }).query.a
      ).toEqual(["b", "c"]);
    });
  });

  describe("burla.URL().hash", () => {
    let url;
    beforeEach(() => {
      url = burla("http://localhost/");
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
});
