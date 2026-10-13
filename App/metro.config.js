/**
 * Metro config — alias Node builtins the @freelawgen/court Kit references to
 * local polyfills, so the bundle builds in React Native.
 *
 * The RN app only uses the Kit's PURE parts (word count, filename grammar,
 * court levels, FIFO). The Kit's CaseNumber minter needs `node:crypto` +
 * `process.env` (Node-only) and runs server-side, not in the app. We alias
 * those builtins to stubs so Metro can resolve the Kit's barrel without a real
 * Node runtime. The stubs throw if actually called (they never are in-app).
 */
const { getDefaultConfig } = require("expo/metro-config")

const path = require("path")

const config = getDefaultConfig(__dirname)

const polyfills = path.resolve(__dirname, "src/polyfills")

// Map `node:crypto` and `crypto` to the polyfill.
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  "node:crypto": path.resolve(polyfills, "node-crypto.js"),
  crypto: path.resolve(polyfills, "node-crypto.js"),
}

module.exports = config
