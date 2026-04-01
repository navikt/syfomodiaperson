const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const extensions = [".tsx", ".jsx", ".js", ".ts", ".json"];

module.exports = {
  entry: {
    main: ["./src/index.tsx"],
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/static",
  },
  resolve: {
    plugins: [
      new TsconfigPathsPlugin({
        extensions,
      }),
    ],
    extensions,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
      filename: "index.html",
    }),
    new CleanWebpackPlugin(),
    new Dotenv({
      path: "./.env",
      safe: false,
    }),
  ],
  module: {
    rules: [
      {
        // @navikt/analytics-types is a strict ESM package that omits .js extensions
        // in its internal imports. Webpack 5 requires fullySpecified: false to resolve them.
        test: /\.js$/,
        include: /node_modules\/@navikt\/analytics-types/,
        resolve: { fullySpecified: false },
      },
      {
        test: /\.(js|ts|tsx)$/,
        use: { loader: "babel-loader" },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              modules: {
                mode: "icss",
              },
              url: false,
            },
          },
          {
            loader: "postcss-loader",
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              modules: {
                mode: "icss",
              },
              url: false,
            },
          },
          {
            loader: "postcss-loader",
          },
          {
            loader: "less-loader",
          },
        ],
      },
      {
        test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|gif|ico|mp3)$/,
        type: "asset/inline",
      },
    ],
  },
};
