const path = require("path")

const CopyPkgJsonPlugin = require("copy-pkg-json-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")

function srcPaths(src) {
  return path.join(__dirname, src)
}

const isEnvProduction = process.env.NODE_ENV === "production"
const isEnvDevelopment = process.env.NODE_ENV === "development"

const babelOptions = {
  cacheDirectory: true,
  presets: [
    "@babel/env",
    "@babel/preset-react",
    [
      "@babel/preset-typescript",
      {
        allExtensions: true,
        isTSX: true,
      },
    ],
  ],
  plugins: [
    "@babel/plugin-syntax-dynamic-import",
    "@babel/proposal-class-properties",
    "@babel/proposal-object-rest-spread",
    [
      "@babel/plugin-transform-runtime",
      {
        regenerator: true,
      },
    ],
  ],
}

const getCommonConfig = () => ({
  devtool: isEnvDevelopment ? "inline-source-map" : false,
  mode: isEnvProduction ? "production" : "development",
  output: { path: srcPaths("dist") },
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
        loader: "babel-loader",
        exclude: /node_modules/,
        options: babelOptions,
      },
      {
        test: /\.(jpg|png|svg|ico|icns)$/,
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
        },
      },
    ],
  },
})

const buildConfig = ({ entry, target, outputFilename, plugins }) => {
  const result = getCommonConfig()
  result.entry = entry
  result.target = target
  result.output.filename = outputFilename
  result.plugins = plugins

  return result
}

const mainConfig = buildConfig({
  entry: "./src/main/main.ts",
  target: "electron-main",
  outputFilename: "main.bundle.js",
  plugins: [
    new CopyPkgJsonPlugin({
      remove: ["scripts", "devDependencies", "build"],
      replace: {
        main: "./main.bundle.js",
        scripts: { start: "electron ./main.bundle.js" },
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
  plugins: [new CopyPlugin([{ from: "./index.html", to: "index.html" }])],
})

module.exports = [mainConfig, rendererConfig]
