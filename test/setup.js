import Adapter from "enzyme-adapter-react-16";
import { configure } from "enzyme";
import path from "path";
import jsdom from "jsdom";

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter((prop) => typeof target[prop] === "undefined")
    .map((prop) => Object.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props);
}

function setUpDomEnvironment() {
  const { JSDOM } = jsdom;
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/",
  });
  const { window } = dom;

  let temp = null;
  const localS = {
    getItem(key) {
      return temp;
    },
    setItem(key, value) {
      temp = value;
    },
  };

  global.localStorage = localS;
  global.window = window;
  global.document = window.document;
  global.navigator = {
    userAgent: "node.js",
  };

  copyProps(window, global);

  const dotEnvPath = path.resolve(".env");

  require("dotenv").config({
    path: dotEnvPath,
  });
}

propagateToGlobal(window);

function propagateToGlobal(window) {
  for (const key in window) {
    if (!window.hasOwnProperty(key)) {
      continue;
    }

    if (key in global) {
      continue;
    }
    global[key] = window[key];
  }
}

setUpDomEnvironment();
configure({ adapter: new Adapter() });
