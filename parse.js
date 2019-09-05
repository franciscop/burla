// From query-string
export default options => {
  let result;

  switch (options.arrayFormat) {
    case "index":
      return (key, value, accumulator) => {
        result = /\[(\d*)\]$/.exec(key);

        key = key.replace(/\[\d*\]$/, "");

        if (!result) {
          accumulator[key] = value;
          return;
        }

        if (accumulator[key] === undefined) {
          accumulator[key] = {};
        }

        accumulator[key][result[1]] = value;
      };

    case "bracket":
      return (key, value, accumulator) => {
        result = /(\[\])$/.exec(key);
        key = key.replace(/\[\]$/, "");

        if (!result) {
          accumulator[key] = value;
          return;
        }

        if (accumulator[key] === undefined) {
          accumulator[key] = [value];
          return;
        }

        accumulator[key] = [].concat(accumulator[key], value);
      };

    case "comma":
      return (key, value, accumulator) => {
        const isArray =
          typeof value === "string" && value.split("").indexOf(",") > -1;
        const newValue = isArray ? value.split(",") : value;
        accumulator[key] = newValue;
      };

    default:
      return (key, value, accumulator) => {
        if (accumulator[key] === undefined) {
          accumulator[key] = value;
          return;
        }

        accumulator[key] = [].concat(accumulator[key], value);
      };
  }
};
