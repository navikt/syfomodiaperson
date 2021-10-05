import axios from "axios";
import nock from "nock";

export const apiMock = () => {
  axios.defaults.adapter = require("axios/lib/adapters/http");
  return nock("http://localhost").persist();
};
