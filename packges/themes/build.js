import esbuild from "esbuild";

esbuild.build({
  entryPoints: ["src/index.js"], // 경로 수정
  bundle: true,
  minify: true,
  sourcemap: true,
  outdir: "dist",
  format: "esm",
});

//commonjs  esmoduled 둘다 제공

esbuild.build({
  entryPoints: ["src/index.js"], // 경로 수정
  bundle: true,
  minify: true,
  sourcemap: true,
  outdir: "dist",
  format: "cjs",
  outExtension: {
    ".js": ".cjs",
  },
});
