import next from "eslint-config-next";

// ESLint 9 flat config. Next.js 16 removed the `next lint` command, so the
// project lints via standalone ESLint. `eslint-config-next`'s default export
// is already a flat-config array (core-web-vitals + TS presets).
const flatConfig = [
  ...next,
  {
    // Ignore build + dep artifacts.
    ignores: [
      ".next/**",
      "node_modules/**",
      "node_distribution/**",
      "Lib/**",
      "Extension/**",
      "drizzle/**",
    ],
  },
];

export default flatConfig;
