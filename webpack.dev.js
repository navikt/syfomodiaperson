const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
const mockEndepunkter = require("./mock/mockEndepunkter");
const express = require("express");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  output: {
    publicPath: "/static",
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 8080,
    inline: true,
    staticOptions: {
      redirect: false,
    },
    after: (app, server, compiler) => {
      mockEndepunkter(app, true);
      app.use(
        "/sykefravaer/img",
        express.static(path.resolve(__dirname, "img"))
      );
      app.use("/static", express.static(path.resolve(__dirname, "dist")));

      app.use("*", (req, res) => {
        const filename = path.join(compiler.outputPath, "index.html");
        compiler.outputFileSystem.readFile(filename, (err, result) => {
          if (err) {
            res.sendFile(path.resolve(__dirname, "public/error.html"));
            return;
          }

          res.set("Content-Type", "text/html");
          res.send(result);
          res.end();
        });
      });
    },
  },
});
