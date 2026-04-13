import { merge } from "webpack-merge";
import path from "path";
import { fileURLToPath } from "url";

import common from "./webpack.common.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    port: 8080,
    static: "./public",
    setupMiddlewares: (middlewares, devServer) => {
      const { compiler } = devServer;

      middlewares.push({
        name: "spa-fallback",
        middleware: (req, res) => {
          const filename = path.join(compiler.outputPath, "index.html");
          compiler.outputFileSystem.readFile(filename, (err, result) => {
            if (err) {
              res
                .status(404)
                .sendFile(path.resolve(__dirname, "public/error.html"));
              return;
            }

            res.set("Content-Type", "text/html");
            res.send(result);
            res.end();
          });
        },
      });

      return middlewares;
    },
  },
});
