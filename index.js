const enc = encodeURIComponent;

// For resetting anything
const defaults = { hash: "", path: "/", query: {} };

// Generate the plain string (href) from the parameters
const toString = ({ origin, path, query, hash }) => {
  query = Object.entries(query)
    // Make it stable
    .sort(([a], [b]) => {
      if (a < b) return -1;
      if (a > b) return 1;
      // Cannot happen since keys cannot be repeated (for now)
      // return 0;
    })
    .map(([key, value]) => `${enc(key)}=${enc(value)}`)
    .join("&");
  query = query ? `?${query.replace(/^\?/, "")}` : "";
  hash = hash ? `#${hash.replace(/^#/, "")}` : "";
  return origin + path + query + hash;
};

const retrieve = (location, update) => {
  const path = location.pathname;
  const search = new URLSearchParams(location.search.slice(1));
  const params = {};
  // It *is* already parsed for some reason :shrug:
  for (const [key, value] of search.entries()) {
    if (/\[\]$/.test(key)) {
      throw new Error("Arrays in queries are not supported");
    }
    if (params[key]) {
      throw new Error(`The URL query param '${key}' is duplicated`);
    }
    params[key] = value;
  }
  const query = new Proxy(params, {
    get: (orig, key) => params[key],
    set: (orig, key, value) => {
      return update({ query: { ...params, [key]: value } }, location);
    },
    deleteProperty: (orig, key) => {
      const { [key]: abc, ...query } = params;
      return update({ query: query }, location);
    }
  });
  const hash = (location.hash || "").replace(/^#/, "");
  const origin = location.origin;
  const href = toString({ origin, path, query, hash });
  return { href, origin, path, query, hash };
};

const update = (data, location) => {
  const url = toString({ ...retrieve(location, update), ...data });
  if (location === window.location) {
    window.history.pushState({ url }, null, url);
  } else {
    location.href = url;
  }
  return true;
};

export const URL = (location = window.location, { stable = true } = {}) => {
  // We also accept a partial object
  if (typeof location === "string") {
    location = new window.URL(location);
  }

  // This will check whether the query is valid or not
  toString(retrieve(location, update));

  const get = (orig, key) => {
    if (orig[key]) return orig[key];
    if (key === "pathname") key = "path";
    return retrieve(location, update)[key];
  };

  const set = (orig, key, value) => {
    if (key === "pathname") key = "path";
    return update({ [key]: value }, location);
  };

  const deleteProperty = (orig, key) => {
    if (key === "pathname") key = "path";
    return update({ [key]: defaults[key] }, location);
  };

  return new Proxy({ URL }, { get, set, deleteProperty });
};

// By default control the global window.location
export default URL(window.location);
