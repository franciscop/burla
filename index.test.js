import burla from "./index";

const replace = url => window.history.replaceState(null, null, url);
const push = url => window.history.pushState(null, null, url);

describe("burla", () => {
  beforeEach(() => {
    expect(burla.href).toBe("http://localhost/");
  });
  afterEach(() => {
    burla.path = "/";
    burla.query = {};
    burla.hash = "";
    expect(burla.href).toBe("http://localhost/");
  });

  describe("burla", () => {
    it("can be stringified", () => {
      expect(burla.href).toBe("http://localhost/");
    });

    it("is localhost by default", () => {
      expect(burla.href).toBe("http://localhost/");
    });
  });

  describe("burla.path", () => {
    it("can set up the path", () => {
      burla.path = "/hello/world";
      expect(burla.href).toBe("http://localhost/hello/world");
    });

    it("can set up the pathname", () => {
      burla.pathname = "/hello/world";
      expect(burla.href).toBe("http://localhost/hello/world");
    });

    it("can read the path set with `burla.path = ...`", () => {
      burla.path = "/hello/world";
      expect(burla.path).toBe("/hello/world");
    });

    it("can read the path set with `pushState(...)`", () => {
      push("/hello/world");
      expect(burla.path).toBe("/hello/world");
    });

    it("can read the path set with `replaceState(...)`", () => {
      replace("/hello/world");
      expect(burla.path).toBe("/hello/world");
    });

    it("can delete the path to reset it", () => {
      burla.path = "/hello/world";
      delete burla.path;
      expect(burla.path).toBe("/");
    });

    it("can delete the pathname to reset it", () => {
      burla.path = "/hello/world";
      delete burla.pathname;
      expect(burla.path).toBe("/");
    });
  });

  describe("burla.query", () => {
    it("can read parameters", () => {
      replace("/?a=b&e=f&c=d");
      expect(burla.query.a).toBe("b");
      expect(burla.query.c).toBe("d");
      expect(burla.query.e).toBe("f");
      expect(burla.href).toBe("http://localhost/?a=b&c=d&e=f");
    });

    it("can set a query parameter", () => {
      burla.query.hello = "world";
      expect(burla.href).toBe("http://localhost/?hello=world");
    });

    it("can set a query parameter with an object assignment", () => {
      burla.query = { hello: "world" };
      expect(burla.href).toBe("http://localhost/?hello=world");
    });

    it("can delete the whole query to reset it", () => {
      burla.query = { hello: "world" };
      expect(burla.href).toBe("http://localhost/?hello=world");
      delete burla.query;
      expect(burla.href).toBe("http://localhost/");
    });

    it("can extend a query", () => {
      burla.query = { hello: "world" };
      expect(burla.href).toBe("http://localhost/?hello=world");
      burla.query = { ...burla.query, bye: "there" };
      expect(burla.href).toBe("http://localhost/?bye=there&hello=world");
    });

    it("can set a query parameter with an object twice", () => {
      burla.query = { hello: "world" };
      expect(burla.href).toBe("http://localhost/?hello=world");
      burla.query = { hello: "sekai" };
      expect(burla.href).toBe("http://localhost/?hello=sekai");
    });

    it("can set a query parameter after set it with an object assignment", () => {
      burla.query = { hello: "world" };
      burla.query.hello = "sekai";
      expect(burla.href).toBe("http://localhost/?hello=sekai");
    });

    it("escapes characters", () => {
      burla.query.hello = "wo/ld";
      expect(burla.href).toBe("http://localhost/?hello=wo%2Fld");
    });

    it("escapes characters with the object", () => {
      burla.query = { hello: "wo/ld" };
      expect(burla.href).toBe("http://localhost/?hello=wo%2Fld");
    });

    it("can read the parameter set with `pushState(...)`", () => {
      push("/?hello=world");
      expect(burla.query.hello).toBe("world");
    });

    it("can read the parameter set with `replaceState(...)`", () => {
      replace("/?hello=world");
      expect(burla.query.hello).toBe("world");
    });

    it("sets the parameters alphabetically", () => {
      burla.query.hello = "world";
      expect(burla.href).toBe("http://localhost/?hello=world");
      burla.query.bye = "there";
      expect(burla.href).toBe("http://localhost/?bye=there&hello=world");
      delete burla.query.bye;
      expect(burla.href).toBe("http://localhost/?hello=world");
    });

    it("can read arrays in queries", () => {
      replace("/?a[]=b&a[]=c");
      expect(burla.query.a).toEqual(["b", "c"]);
    });

    it("can set arrays in queries", () => {
      burla.query.a = ["b", "c"];
      expect(burla.href).toEqual("http://localhost/?a[]=b&a[]=c");
    });
  });

  describe("burla.hash", () => {
    it("is empty by default", () => {
      expect(burla.href).toBe("http://localhost/");
      expect(burla.hash).toBe("");
    });

    it("can be modified", () => {
      burla.hash = "hello";
      expect(burla.href).toBe("http://localhost/#hello");
    });

    it("will not duplicate the beginning hashtag", () => {
      burla.hash = "#hello";
      expect(burla.hash).toBe("hello");
      expect(burla.href).toBe("http://localhost/#hello");
    });

    it("can be deleted by setting it empty", () => {
      burla.hash = "hello";
      expect(burla.href).toBe("http://localhost/#hello");
      burla.hash = "";
      expect(burla.href).toBe("http://localhost/");
    });

    it("can be deleted", () => {
      burla.hash = "hello";
      expect(burla.href).toBe("http://localhost/#hello");
      delete burla.hash;
      expect(burla.href).toBe("http://localhost/");
    });

    it("can be modified", () => {
      expect(burla.hash).toBe("");
      burla.hash = "hello";
      expect(burla.href).toBe("http://localhost/#hello");
    });
  });
});
