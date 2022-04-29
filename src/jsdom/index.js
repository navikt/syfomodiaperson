/* eslint-disable */

const jsdom = require("jsdom");

/**
 * Borrowed from: https://github.com/tmpvar/jsdom/issues/135#issuecomment-68191941
 */
const applyJsdomWorkaround = (window) => {
  Object.defineProperties(window.HTMLElement.prototype, {
    offsetLeft: {
      get: () => {
        return parseFloat(window.getComputedStyle(this).marginLeft) || 0;
      },
    },
    offsetTop: {
      get: () => {
        return parseFloat(window.getComputedStyle(this).marginTop) || 0;
      },
    },
    offsetHeight: {
      get: () => {
        return parseFloat(window.getComputedStyle(this).height) || 0;
      },
    },
    offsetWidth: {
      get: () => {
        return parseFloat(window.getComputedStyle(this).width) || 0;
      },
    },
  });
};

const setupDom = () => {
  const baseMarkup =
    "<!DOCTYPE html><html><head><title></title></head><body></body></html>";
  const window = jsdom.jsdom(baseMarkup).defaultView;

  global.window = window;
  global.document = window.document;
  global.navigator = window.navigator;
  applyJsdomWorkaround(window);
};

setupDom();
