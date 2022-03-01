const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const extensions = [".tsx", ".jsx", ".js", ".ts", ".json"];

module.exports = {
  entry: {
    main: ["@babel/polyfill", "./src/index.js"],
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
        test: /\.(js|ts|tsx)$/,
        use: { loader: "babel-loader" },
        exclude: /node_modules/,
      },
      {
        test: /\.(less|css)$/,
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
            options: {
              postcssOptions: {
                plugins: [["postcss-preset-env"]],
              },
            },
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
