import { merge } from "webpack-merge";

const common = require("./webpack.common.ts");
const path = require("path");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    port: 8080,
    static: "./public",
    setupMiddlewares: (middlewares: any, devServer: any) => {
      const { compiler } = devServer;

      middlewares.push({
        name: "spa-fallback",
        middleware: (req: any, res: any) => {
          const filename = path.join(compiler.outputPath, "index.html");
          compiler.outputFileSystem.readFile(
            filename,
            (err: any, result: any) => {
              if (err) {
                res
                  .status(404)
                  .sendFile(path.resolve(__dirname, "public/error.html"));
                return;
              }

              res.set("Content-Type", "text/html");
              res.send(result);
              res.end();
            }
          );
        },
      });

      return middlewares;
    },
  },
});
