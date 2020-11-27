const mockData = require("./mockData");
const enums = require("./mockDataEnums");

function mockForLokal(server) {
  server.get("/isprediksjon/api/v1/prediksjon", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(mockData[enums.PREDIKSJON]);
  });
}

function mockIspengestopp(server) {
  mockForLokal(server);
}

module.exports = mockIspengestopp;
