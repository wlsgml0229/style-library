import esbuild from "esbuild";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const pkg = require(path.resolve(__dirname, "package.json"));

const dev = process.argv.includes("--dev");
const doWatch = process.argv.includes("--watch");
const minify = !dev;

const external = Object.keys({
  ...(pkg.dependencies ?? {}),
  ...(pkg.peerDependencies ?? {}),
});

const baseConfig = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify,
  sourcemap: true,
  outdir: "dist",
  target: "es2019",
  external,
};

async function buildAll() {
  try {
    const buildTasks = [
      esbuild.context({
        ...baseConfig,
        format: "esm",
      }),
      esbuild.context({
        ...baseConfig,
        format: "cjs",
        outExtension: { ".js": ".cjs" },
      }),
    ];

    const contexts = await Promise.all(buildTasks);

    if (doWatch) {
      await Promise.all(contexts.map((ctx) => ctx.watch()));
      console.log("Watching for changes...");
    } else {
      await Promise.all(contexts.map((ctx) => ctx.rebuild()));
      await Promise.all(contexts.map((ctx) => ctx.dispose()));
      console.log("Build complete.");
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

buildAll();
