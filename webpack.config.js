const path = require("path")

const CopyPkgJsonPlugin = require("copy-pkg-json-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")

function srcPaths(src) {
  return path.join(__dirname, src)
}

const isEnvProduction = process.env.NODE_ENV === "production"
const isEnvDevelopment = process.env.NODE_ENV === "development"

const getCommonConfig = () => ({
  devtool: isEnvDevelopment ? "inline-source-map" : false,
  mode: isEnvProduction ? "production" : "development",
  output: { path: srcPaths("build") },
  node: { __dirname: false, __filename: false },
  resolve: {
    alias: {
      "@": srcPaths("src"),
    },
    extensions: [".js", ".json", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "@sucrase/webpack-loader",
        exclude: /node_modules/,
        options: {
          transforms: ["jsx", "typescript"],
        },
      },
    ],
  },
})

const buildConfig = ({ entry, target, outputFilename, plugins }) => {
  const result = { ...getCommonConfig(), entry, target, plugins }
  result.output.filename = outputFilename

  return result
}

const mainConfig = buildConfig({
  entry: "./src/main/main.ts",
  target: "electron-main",
  outputFilename: "index.js",
  plugins: [
    new CopyPkgJsonPlugin({
      remove: ["scripts", "devDependencies", "build"],
      replace: {
        main: "./index.js",
        scripts: { start: "electron ./index.js" },
        postinstall: "electron-builder install-app-deps",
      },
    }),
    new CopyPlugin([{ from: "./src/main/preload.js", to: "preload.js" }]),
  ],
})

const rendererConfig = buildConfig({
  entry: "./src/renderer/index.tsx",
  target: "electron-renderer",
  outputFilename: "renderer.bundle.js",
  plugins: [
    new CopyPlugin([
      { from: "./static/index.html", to: "index.html" },
      { from: "./static/styles.css", to: "styles.css" },
    ]),
  ],
})

module.exports = [mainConfig, rendererConfig]
