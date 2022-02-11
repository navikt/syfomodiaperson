import { merge } from "webpack-merge";
import mockEndepunkter from "./mock/mockEndepunkter";

const express = require("express");
const common = require("./webpack.common.ts");
const path = require("path");

const Auth = require("./server/auth/index.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    port: 8080,
    static: {
      directory: path.join(__dirname, "dist"),
      staticOptions: {
        redirect: false,
      },
    },
    setupMiddlewares: (middlewares, devServer) => {
      setupDev(devServer);
      return middlewares;
    },
  },
});

const setupDev = async (devServer) => {
  const { app, compiler } = devServer;

  await Auth.setupAuth(app);

  mockEndepunkter(app);
  app.use("/static", express.static(path.resolve(__dirname, "dist")));

  app.use("*", (req, res) => {
    const filename = path.join(compiler.outputPath, "index.html");
    compiler.outputFileSystem.readFile(filename, (err, result) => {
      if (err) {
        res.status(404).sendFile(path.resolve(__dirname, "public/error.html"));
        return;
      }

      res.set("Content-Type", "text/html");
      res.send(result);
      res.end();
    });
  });
};
