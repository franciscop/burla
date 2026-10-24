export default {
  test: {
    globals: true,
    environment: "jsdom",
    // The tests expect jest's default URL, not vitest's localhost:3000
    environmentOptions: { jsdom: { url: "http://localhost/" } },
  },
};
