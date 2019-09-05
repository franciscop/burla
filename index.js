import parse from "./parse";

const enc = encodeURIComponent;

// For resetting anything
const defaults = { hash: "", path: "/", query: {} };

// Generate the plain string (href) from the parameters
const toString = ({ origin, path, query, hash }) => {
  query = Object.entries(query)
    .sort(([a], [b]) => (a < b ? -1 : 1)) // Keys cant repeat in objects so a!=b
    .map(([key, value]) => {
      // For arrays in the URL
      if (Array.isArray(value)) {
        return value.map(val => `${enc(key)}[]=${enc(val)}`).join("&");
      }
      return `${enc(key)}=${enc(value)}`;
    })
    .join("&");
  query = query ? `?${query.replace(/^\?/, "")}` : "";
  hash = hash ? `#${hash.replace(/^#/, "")}` : "";
  return origin + path + query + hash;
};

const retrieve = (location, update, options) => {
  const path = location.pathname;

  const params = {};
  const parser = parse(options);

  const search = new URLSearchParams(location.search.slice(1));
  for (const [key, value] of search.entries()) {
    parser(key, value, params);
  }

  // It *is* already parsed for some reason :shrug:
  const query = new Proxy(params, {
    get: (orig, key) => params[key],
    set: (orig, key, value) => {
      return update({ query: { ...params, [key]: value } }, location, options);
    },
    deleteProperty: (orig, key) => {
      const { [key]: abc, ...query } = params;
      return update({ query: query }, location, options);
    }
  });
  const hash = (location.hash || "").replace(/^#/, "");
  const origin = location.origin;
  const href = toString({ origin, path, query, hash });
  return { href, origin, path, query, hash };
};

const update = (data, location, options) => {
  const url = toString({ ...retrieve(location, update, options), ...data });
  if (location === window.location) {
    window.history.pushState({ url }, null, url);
  } else {
    location.href = url;
  }
  return true;
};

export const URL = (
  location = window.location,
  options = { arrayFormat: "bracket" }
) => {
  // We also accept a partial object
  if (typeof location === "string") {
    location = new window.URL(location);
  }

  // This will check whether the query is valid or not
  toString(retrieve(location, update, options));

  const get = (orig, key) => {
    if (orig[key]) return orig[key];
    if (key === "pathname") key = "path";
    return retrieve(location, update, options)[key];
  };

  const set = (orig, key, value) => {
    if (key === "pathname") key = "path";
    return update({ [key]: value }, location, options);
  };

  const deleteProperty = (orig, key) => {
    if (key === "pathname") key = "path";
    return update({ [key]: defaults[key] }, location, options);
  };

  // LOL, this is for `burla.URL()`
  URL.URL = URL;
  return new Proxy(URL, { get, set, deleteProperty });
};

// By default control the global window.location
export default URL(window.location);
