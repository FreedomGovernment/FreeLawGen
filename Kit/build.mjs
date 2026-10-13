// Copyright AStarship <https://astarship.net>.
//
// Build @freelawgen/court -> dist/ (CJS + ESM + types), mirroring the
// @astarship/api + @astarship/subsecond-id prebuilt-dist layout so Turbopack
// (Next 16) can bundle it. Run with: pnpm --filter @freelawgen/court build
// (or `node build.mjs` from this dir).
//
// Uses tsc twice:
//   1) ESM  (.mjs) + declarations (.d.ts)  -> dist/   (walks nested court/ + subsecond/)
//   2) CJS  (.js)                          -> dist/
// We emit .mjs/.d.ts first, then .js, renaming the ESM .js -> .mjs to match
// the package exports map (handle: "." -> dist/index.{js,mjs,d.ts}).

import { execSync } from "node:child_process"
import { rmSync, mkdirSync, existsSync, renameSync, readdirSync, statSync } from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"

const here = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(here, "dist")

function run(args) {
  execSync(`npx tsc ${args}`, { cwd: here, stdio: "inherit" })
}

// Recursively rename every <x>.js -> <x>.mjs (and .js.map -> .mjs.map) under dist/.
function renameJsToMjs(dir) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name)
    if (statSync(full).isDirectory()) {
      renameJsToMjs(full)
    } else if (name.endsWith(".js")) {
      renameSync(full, full.slice(0, -3) + ".mjs")
    } else if (name.endsWith(".js.map")) {
      renameSync(full, full.slice(0, -7) + ".mjs.map")
    }
  }
}

// 1) ESM + types
rmSync(dist, { recursive: true, force: true })
mkdirSync(dist, { recursive: true })
run(
  "--project tsconfig.build.json " +
    "--module ESNext --moduleResolution Bundler " +
    "--declaration true --declarationMap true --sourceMap true " +
    `--outDir "${dist}"`,
)
renameJsToMjs(dist)

// 2) CJS (no decl; the .d.ts from pass 1 is shared by both)
run(
  "--project tsconfig.build.json " +
    "--module CommonJS --moduleResolution Node10 " +
    "--declaration false --declarationMap false --sourceMap true " +
    `--outDir "${dist}"`,
)

console.log("[@freelawgen/court] build complete -> dist/")
