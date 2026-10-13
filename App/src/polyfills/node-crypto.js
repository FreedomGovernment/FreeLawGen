/**
 * Node builtin polyfills for the React Native runtime.
 *
 * The @freelawgen/court Kit's CaseNumber module imports `node:crypto`
 * (createHash) for the case-number minter. That minter is Node-only and is NOT
 * used by the RN app (the app uses the pure parts: word count, filename
 * grammar, court levels, FIFO). But Metro resolves the Kit's barrel, which
 * re-exports CaseNumber, so `node:crypto` must resolve for the bundle to
 * build. This polyfill makes it resolvable; it throws if actually called (the
 * RN app never calls it — the case number is minted server-side).
 */
module.exports = {
  // createHash is the only node:crypto API the Kit touches. Provide a stub that
  // throws a clear error if (improperly) called from the RN runtime.
  createHash: function createHash(_alg) {
    throw new Error(
      "node:crypto.createHash is not available in React Native. " +
        "The case-number minter runs server-side (Node), not in the app.",
    )
  },
  randomBytes: function randomBytes(_n) {
    throw new Error("node:crypto.randomBytes is not available in React Native.")
  },
}
